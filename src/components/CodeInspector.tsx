import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Code2,
  Play,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  RotateCcw,
  Loader2,
  GraduationCap
} from "lucide-react";

interface CodeInspectorProps {
  initialCode?: string;
  initialLanguage?: string;
  onAttachCodeToChat: (code: string, language: string) => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  initialCode,
  initialLanguage,
  onAttachCodeToChat,
}) => {
  const [code, setCode] = useState<string>(
    initialCode ||
      `# Bài tập: Tính tổng các số lẻ từ 1 đến N trong Python\nn = int(input("Nhập N = "))\n\ntong = 0\nfor i in range(1, n):\n    if i % 2 == 0:  # Chú ý: Đây là số chẵn hay số lẻ?\n        tong += i\n\nprint("Tổng các số lẻ là:", tong)\n`
  );
  const [language, setLanguage] = useState<string>(initialLanguage || "python");
  const [problemContext, setProblemContext] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleTemplates: Record<string, string> = {
    python: `# Python: Đếm số lượng từ trong xâu\ns = input("Nhập xâu ký tự: ")\n# Hãy hoàn thiện vòng lặp đếm số từ...\nwords = s.split()\nprint("Số từ là:", len(words))\n`,
    cpp: `// C++: Sắp xếp mảng tăng dần\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for(int i = 0; i < n; i++) cin >> a[i];\n    \n    sort(a.begin(), a.end());\n    \n    for(int x : a) cout << x << " ";\n    return 0;\n}\n`,
    sql: `-- SQL: Truy vấn danh sách học sinh có điểm trung bình >= 8.0\nSELECT HOCSINH.MaHS, HOCSINH.HoTen, DIEM.DiemTB\nFROM HOCSINH\nJOIN DIEM ON HOCSINH.MaHS = DIEM.MaHS\nWHERE DIEM.DiemTB >= 8.0;\n`,
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (sampleTemplates[lang]) {
      setCode(sampleTemplates[lang]);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          problemDescription: problemContext,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisResult(data.error || "Không thể phân tích code.");
      }
    } catch (err: any) {
      setAnalysisResult("Lỗi kết nối máy chủ: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunSimulation = () => {
    setSimulatedOutput(null);
    try {
      if (language === "python") {
        if (code.includes("input(")) {
          setSimulatedOutput(
            "▶ [Chế độ Mô Phỏng Python]\nCode đang chờ dữ liệu đầu vào. Thầy Socrates đề xuất dùng nút 'Phân Tích Socratic' để được Thầy review logic chi tiết hơn!"
          );
        } else {
          setSimulatedOutput(
            "▶ [Mô phỏng Chạy Code]: Cú pháp tổng quát hợp lệ. Thầy Socrates đã sẵn sàng đánh giá logic thuật toán cho em."
          );
        }
      } else {
        setSimulatedOutput(
          `▶ [Biên dịch mô phỏng ${language.toUpperCase()}]: Cú pháp căn bản hợp lệ. Hãy bấm "Phân Tích Socratic" để Thầy kiểm tra lỗi dòng & thuật toán!`
        );
      }
    } catch (e: any) {
      setSimulatedOutput("⚠️ Cảnh báo cú pháp: " + e.message);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line counter for code textarea
  const lineCount = code.split("\n").length;
  const linesArray = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column: Code Editor & Settings */}
      <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Editor Toolbar */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-slate-100">
              Soạn Thảo Code THPT
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-medium">Ngôn ngữ:</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-950 text-amber-300 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="python">Python 3</option>
              <option value="cpp">C++ 17</option>
              <option value="sql">SQL Database</option>
            </select>

            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs flex items-center gap-1"
              title="Sao chép code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Problem Context Input */}
        <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
          <input
            type="text"
            value={problemContext}
            onChange={(e) => setProblemContext(e.target.value)}
            placeholder="Tùy chọn: Nhập đề bài hoặc yêu cầu bài tập (giúp Thầy Socrates gợi ý chính xác hơn)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Code Editor Area with Line Numbers */}
        <div className="flex-1 relative flex bg-slate-950 font-mono text-xs overflow-hidden min-h-[360px]">
          {/* Line Numbers */}
          <div className="w-12 bg-slate-900/80 text-slate-600 select-none py-3 text-right pr-3 font-mono border-r border-slate-800">
            {linesArray.map((line) => (
              <div key={line} className="h-5 leading-5">
                {line}
              </div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Viết hoặc dán mã nguồn của em tại đây..."
            className="flex-1 bg-transparent p-3 text-emerald-300 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-0 selection:bg-indigo-500/30 selection:text-white"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleRunSimulation}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Chạy Thử</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAttachCodeToChat(code, language)}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-indigo-500/40 transition-all shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Gửi vào Chat Socratic</span>
            </button>

            <button
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing || !code.trim()}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Phân Tích Socratic</span>
            </button>
          </div>
        </div>

        {/* Console / Simulated Output */}
        {simulatedOutput && (
          <div className="bg-slate-950 p-3 border-t border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Kết quả chạy mô phỏng</span>
              <button
                onClick={() => setSimulatedOutput(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                Xóa
              </button>
            </div>
            <p className="whitespace-pre-wrap text-slate-300">{simulatedOutput}</p>
          </div>
        )}
      </div>

      {/* Right Column: Socratic Analysis Results */}
      <div className="lg:col-span-5 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden min-h-[400px]">
        {/* Panel Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Đánh Giá & Nhận Xét Socratic
          </h3>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-amber-300">
                Thầy Socrates đang soi kĩ từng dòng code...
              </h4>
              <p className="text-xs text-slate-400">
                Kiểm tra cú pháp, thuật toán, ranh giới mảng & nguy cơ lặp vô hạn...
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Thầy đã phân tích xong! Nhớ nhé: Thầy chỉ ra dòng bị lỗi và gợi ý để em tự sửa.
                </span>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">
                Chưa có phân tích
              </h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Soạn bài code của em ở góc bên trái, sau đó bấm{" "}
                <strong className="text-amber-300">"Phân Tích Socratic"</strong> để
                nhận phản hồi trực tiếp từ Thầy Socrates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
