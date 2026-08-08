import React from "react";
import { GraduationCap, CheckCircle2, XCircle, Sparkles, HelpCircle, HeartHandshake } from "lucide-react";

interface SocraticGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocraticGuideModal: React.FC<SocraticGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-lg">
              Phương Pháp Socratic Trong Môn Tin Học
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Chào em! Thầy là <strong>Socrates Tin Học</strong>. Trong học tập Tin học THPT,
            việc tự tư duy là chìa khóa giúp em làm chủ thuật toán và đạt kết quả cao trong các kỳ thi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 space-y-1.5">
              <span className="font-bold text-rose-400 flex items-center gap-1 text-xs">
                <XCircle className="w-4 h-4" /> Cách Học Thụ Động
              </span>
              <p className="text-[11px] text-slate-300">
                Nhìn thấy code mẫu có sẵn -&gt; Copy Paste -&gt; Chạy được nhưng không hiểu tại sao -&gt; Vào phòng thi gặp bài tương tự sẽ không tự viết được.
              </p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 space-y-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-4 h-4" /> Phương Pháp Socratic
              </span>
              <p className="text-[11px] text-slate-300">
                Thầy hỏi gợi mở -&gt; Em tự phát hiện logic -&gt; Thầy chỉ ra dòng bị lỗi -&gt; Em tự sửa được code -&gt; Nhớ lâu, tự tin đi thi!
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-xs space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4" /> Mẹo giao tiếp hiệu quả với Thầy Socrates:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Đừng ngần ngại nói <em>"Em chưa biết bắt đầu từ đâu"</em>.</li>
              <li>Gửi đoạn code em đang viết dở hoặc ảnh đề bài cho Thầy.</li>
              <li>Trả lời các câu hỏi nhỏ của Thầy từng bước một.</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            Đã Hiểu - Bắt Đầu Học Cùng Thầy
          </button>
        </div>
      </div>
    </div>
  );
};
