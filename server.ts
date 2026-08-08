import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Chưa cấu hình GEMINI_API_KEY trong hệ thống.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const SOCRATES_SYSTEM_INSTRUCTION = `
Bạn là "Socrates Tin Học" - Trợ lý học tập AI thông minh, kiên nhẫn, vui vẻ và truyền cảm hứng dành riêng cho học sinh THPT (Trung học phổ thông Lớp 10, 11, 12 tại Việt Nam) trong môn Tin học.

Nhiệm vụ cốt lõi của bạn:
1. Hướng dẫn học sinh giải quyết bài tập Tin học (Lập trình Python, C++, Thuật toán & Cấu trúc dữ liệu, Cơ sở dữ liệu SQL, Mạng máy tính & Kiến thức Tin học THPT).
2. QUY TẮC TÂM NIỆM: KHÔNG BAO GIỜ cho đáp án trực tiếp, KHÔNG BAO GIỜ chép sẵn toàn bộ đoạn code hoàn chỉnh ngay lập tức cho học sinh.
3. Sử dụng PHƯƠNG PHÁP SOCRATIC (Đặt câu hỏi gợi mở từng bước):
   - Bước 1: Kiểm tra xem học sinh đã hiểu đề bài chưa (Hỏi học sinh Input là gì, Output là gì, cho ví dụ nhỏ).
   - Bước 2: Dẫn dắt tư duy logic và thuật toán trước khi nói về cú pháp lập trình. (Ví dụ: "Để tìm số lớn nhất trong danh sách, nếu làm bằng tay em sẽ so sánh thế nào?").
   - Bước 3: Gợi ý cú pháp từng đoạn nhỏ hoặc sơ đồ tư duy.
   - Bước 4: Khi học sinh gửi code bị lỗi hoặc cần tư vấn lỗi: Hãy chỉ ra chính xác DÒNG BỊ LỖI, GIẢI THÍCH NGUYÊN NHÂN ngắn gọn dễ hiểu, sau đó ĐẶT CÂU HỎI yêu cầu học sinh tự suy nghĩ và sửa lại.
4. Ngôn ngữ & Phong cách:
   - Thân thiện, khuyến khích, tích cực, xưng "Thầy Socrates" (hoặc "Thầy") và gọi học sinh là "em".
   - Dùng định dạng Markdown đẹp mắt, xuống dòng rõ ràng, đóng khung code/pseudo-code khi cần.
   - Tuyên dương khi em trả lời đúng hoặc có sự tiến bộ!
`;

// API Endpoint for Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, topic, grade, image } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Thắt chặt danh sách tin nhắn." });
    }

    const ai = getGeminiClient();

    // Context prefix according to topic & grade
    let contextNote = "";
    if (topic || grade) {
      contextNote = `[Thông tin bối cảnh: Học sinh đang hỏi về Chủ đề "${topic || "Tổng hợp"}", Lớp "${grade || "THPT"}"]\n\n`;
    }

    // Format messages for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string; image?: string }, index: number) => {
      const isLast = index === messages.length - 1;
      const role = m.role === "user" ? "user" : "model";
      
      const parts: any[] = [{ text: index === 0 && m.role === "user" ? contextNote + m.content : m.content }];

      // Include image if present in last message or specific message
      if (m.image && m.image.startsWith("data:image")) {
        const matches = m.image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          parts.unshift({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }

      return { role, parts };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SOCRATES_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.status(500).json({
      error: error.message || "Đã xảy ra lỗi khi kết nối với Thầy Socrates.",
    });
  }
});

// API Endpoint for Code Analysis (Socratic Debugger)
app.post("/api/analyze-code", async (req, res) => {
  try {
    const { code, language, problemDescription } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Vui lòng cung cấp mã nguồn." });
    }

    const ai = getGeminiClient();

    const prompt = `
Hãy đóng vai Thầy Socrates Tin Học phân tích đoạn code sau đây của học sinh:
Ngôn ngữ: ${language || "Tự động nhận diện"}
Đề bài (nếu có): ${problemDescription || "Không có mô tả"}

Code của học sinh:
\`\`\`${language || ""}
${code}
\`\`\`

Yêu cầu phản hồi:
1. Nhận xét tinh thần làm bài của học sinh (khuyến khích, tích cực).
2. Phát hiện lỗi (cú pháp, logic, thuật toán, ranh giới mảng, tràn số, v.v.):
   - NẾU CÓ LỖI: Chỉ ra chính xác DÒNG MẤY có vấn đề. Giải thích vì sao dòng đó bị lỗi hoặc chưa tối ưu. ĐẶT CÂU HỎI gợi mở để học sinh TỰ SỬA (TỰT ĐỐI KHÔNG SỬA LẠI ĐOẠN CODE ĐẦY ĐỦ).
   - NẾU CÓ THỂ TỐI ƯU: Hỏi học sinh xem có cách nào giảm độ phức tạp thời gian/bộ nhớ không.
   - NẾU CODE ĐÃ ĐÚNG: Tuyên dương học sinh và đặt một câu hỏi thử thách mở rộng.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SOCRATES_SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    return res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Analyze Code Error:", error);
    return res.status(500).json({ error: error.message || "Lỗi khi phân tích mã nguồn." });
  }
});

// API Endpoint for Quick Practice Generator
app.post("/api/generate-problem", async (req, res) => {
  try {
    const { grade, topic, difficulty } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Tạo 1 bài tập Tin học THPT hấp dẫn, gần gũi với học sinh Việt Nam.
Thông số:
- Lớp: ${grade || "Lớp 10/11/12"}
- Chủ đề: ${topic || "Lập trình Python/C++/Thuật toán/CSDL"}
- Mức độ: ${difficulty || "Cơ bản"}

Trả về cấu trúc JSON với các trường:
- "title": Tên bài tập
- "grade": Cấp lớp (VD: Lớp 10, Lớp 11)
- "topic": Chủ đề
- "description": Yêu cầu đề bài chi tiết
- "inputFormat": Định dạng Dữ liệu vào (Input)
- "outputFormat": Định dạng Dữ liệu ra (Output)
- "sampleInput": Ví dụ Input
- "sampleOutput": Ví dụ Output
- "socraticQuestion": 1-2 câu hỏi gợi mở của Thầy Socrates để học sinh bắt đầu tư duy
- "hintSteps": Danh sách các bước gợi ý tư duy (không chứa mã nguồn)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Generate Problem Error:", error);
    return res.status(500).json({ error: error.message || "Lỗi tạo bài tập." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Socrates Tin Hoc] Server running on http://localhost:${PORT}`);
  });
}

startServer();
