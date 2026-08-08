import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  Code,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  GraduationCap
} from "lucide-react";
import { ChatMessage, GradeLevel, SubjectCategory } from "../types";

interface SocraticChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string) => Promise<void>;
  isLoading: boolean;
  selectedGrade: GradeLevel | "Tất cả";
  selectedCategory: SubjectCategory | "all";
  codeSnippetToAttach?: { code: string; language: string } | null;
  onClearAttachedCode?: () => void;
  onOpenEditorWithCode?: (code: string, language: string) => void;
}

export const SocraticChat: React.FC<SocraticChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedGrade,
  selectedCategory,
  codeSnippetToAttach,
  onClearAttachedCode,
  onOpenEditorWithCode,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage && !codeSnippetToAttach) || isLoading) return;

    let fullText = inputText.trim();
    if (codeSnippetToAttach) {
      fullText += `\n\n\`\`\`${codeSnippetToAttach.language}\n${codeSnippetToAttach.code}\n\`\`\``;
    }

    onSendMessage(fullText, selectedImage || undefined);
    setInputText("");
    setSelectedImage(null);
    if (onClearAttachedCode) onClearAttachedCode();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dung lượng ảnh tối đa là 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputText(promptText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Lớp Học Socratic
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                Đang trực tuyến
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Đang chọn: <strong className="text-amber-300">{selectedGrade}</strong> •{" "}
              <strong className="text-amber-300">
                {selectedCategory === "all"
                  ? "Tất cả chủ đề"
                  : selectedCategory.toUpperCase()}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Thầy sẽ đặt câu hỏi gợi mở - Học sinh tự suy nghĩ!</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto my-6 p-6 bg-slate-800/50 border border-slate-700/80 rounded-2xl text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-amber-500/10">
              <GraduationCap className="w-9 h-9 text-slate-950" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-300">
                Chào em! Thầy là Socrates Tin Học
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Thầy ở đây để đồng hành cùng em chinh phục các bài tập Tin học THPT
                (Python, C++, Thuật toán, CSDL SQL).
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 text-left space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-4 h-4" /> Nguyên tắc học cùng Thầy Socrates:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Thầy sẽ <strong>không cho sẵn code đáp án</strong> trực tiếp.</li>
                <li>Thầy sẽ <strong>đặt từng câu hỏi nhỏ</strong> để giúp em tự hiểu thuật toán.</li>
                <li>Nếu code em bị lỗi, Thầy sẽ chỉ ra <strong>dòng lỗi</strong> và giải thích nguyên nhân để em tự sửa.</li>
              </ul>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2 pt-2">
              <p className="text-xs text-slate-400 font-medium">Bắt đầu bằng một câu hỏi hoặc chụp bài tập gửi Thầy:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Em gặp khó khăn khi làm bài tập tính tiền điện Python",
                  "Cho em hỏi làm sao kiểm tra số nguyên tố tối ưu?",
                  "Dãy con tăng dài nhất dùng thuật toán gì ạ?",
                  "Cách viết SQL JOIN 2 bảng HOCSINH và DIEM",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-amber-300 px-3 py-1.5 rounded-xl border border-slate-600/60 transition-all text-left"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-amber-500 text-slate-950 border border-amber-300"
                }`}
              >
                {msg.role === "user" ? <User className="w-5 h-5" /> : <GraduationCap className="w-5.5 h-5.5" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600/90 text-white rounded-tr-none shadow"
                    : "bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none shadow-md"
                }`}
              >
                {/* User Attachment image if exists */}
                {msg.image && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-slate-700 max-w-sm">
                    <img src={msg.image} alt="Bài tập đính kèm" className="w-full object-contain max-h-60" />
                  </div>
                )}

                {/* Message Markdown Content */}
                <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeString = String(children).replace(/\n$/, "");
                        if (!inline) {
                          return (
                            <div className="my-2 rounded-lg overflow-hidden border border-slate-700 bg-slate-950/80">
                              <div className="bg-slate-900 px-3 py-1 text-[11px] font-mono text-amber-400 flex justify-between items-center border-b border-slate-800">
                                <span>{match ? match[1].toUpperCase() : "CODE"}</span>
                                {onOpenEditorWithCode && (
                                  <button
                                    onClick={() => onOpenEditorWithCode(codeString, match ? match[1] : "python")}
                                    className="hover:underline text-indigo-300 flex items-center gap-1"
                                  >
                                    <Code className="w-3 h-3" /> Mở trong Soạn Code
                                  </button>
                                )}
                              </div>
                              <pre className="p-3 text-xs font-mono overflow-x-auto text-emerald-300">
                                <code>{children}</code>
                              </pre>
                            </div>
                          );
                        }
                        return (
                          <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
                  <span>{msg.timestamp}</span>
                  {msg.role === "assistant" && (
                    <span className="text-amber-400/90 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gợi mở Socratic
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 animate-pulse">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-amber-300 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Thầy Socrates đang suy nghĩ câu hỏi gợi mở phù hợp nhất cho em...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Bar above input */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Trả lời nhanh:
        </span>
        {[
          "Thầy cho em gợi ý bước 1",
          "Em đã hiểu đề bài, làm sao viết logic?",
          "Chỉ giúp em dòng code bị lỗi",
          "Cho em ví dụ chạy thử bằng tay",
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(item)}
            className="whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-all text-[11px]"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Input Form Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
        {/* Attachment preview tags */}
        {(selectedImage || codeSnippetToAttach) && (
          <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-2 rounded-xl border border-slate-800">
            {selectedImage && (
              <div className="relative flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg text-xs text-amber-300">
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">Ảnh đề bài</span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="hover:text-red-400 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {codeSnippetToAttach && (
              <div className="relative flex items-center gap-2 bg-indigo-950 text-indigo-200 border border-indigo-800 px-2.5 py-1 rounded-lg text-xs">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đoạn code ({codeSnippetToAttach.language})</span>
                <button
                  type="button"
                  onClick={onClearAttachedCode}
                  className="hover:text-red-400 text-indigo-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* File Upload Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-all"
            title="Đính kèm ảnh đề bài hoặc ảnh chụp màn hình code"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Textarea Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Hỏi Thầy Socrates về thuật toán, bài tập hay lỗi code..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage && !codeSnippetToAttach) || isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all text-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
