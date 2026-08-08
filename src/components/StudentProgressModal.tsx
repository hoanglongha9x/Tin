import React from "react";
import { StudentStats } from "../types";
import { Award, Flame, MessageSquare, Code2, BookOpen, CheckCircle2 } from "lucide-react";

interface StudentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats;
}

export const StudentProgressModal: React.FC<StudentProgressModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-lg">
              Thành Tích & Huy Hiệu Socratic
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <Flame className="w-5 h-5 text-amber-500 mx-auto" />
            <span className="text-lg font-bold text-amber-400 block">
              {stats.streakDays} ngày
            </span>
            <span className="text-[11px] text-slate-400">Chuỗi học tập</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <MessageSquare className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-lg font-bold text-indigo-300 block">
              {stats.questionsAsked}
            </span>
            <span className="text-[11px] text-slate-400">Câu hỏi đã trao đổi</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <Code2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-lg font-bold text-emerald-400 block">
              {stats.codesAnalyzed}
            </span>
            <span className="text-[11px] text-slate-400">Đoạn code phân tích</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <BookOpen className="w-5 h-5 text-purple-400 mx-auto" />
            <span className="text-lg font-bold text-purple-300 block">
              {stats.problemsAttempted}
            </span>
            <span className="text-[11px] text-slate-400">Bài tập thử sức</span>
          </div>
        </div>

        {/* Badges List */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
            Danh Hiệu Đã Đạt Được
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                  badge.unlocked
                    ? "bg-slate-950 border-amber-500/40 text-slate-200"
                    : "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60"
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-amber-300">
                      {badge.title}
                    </h5>
                    {badge.unlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
