import React from "react";
import { GraduationCap, Code2, BookOpen, Award, Sparkles, HelpCircle, Flame } from "lucide-react";
import { GradeLevel, SubjectCategory, StudentStats } from "../types";

interface NavbarProps {
  activeTab: "chat" | "editor" | "library" | "guide";
  setActiveTab: (tab: "chat" | "editor" | "library" | "guide") => void;
  selectedGrade: GradeLevel | "Tất cả";
  setSelectedGrade: (grade: GradeLevel | "Tất cả") => void;
  selectedCategory: SubjectCategory | "all";
  setSelectedCategory: (category: SubjectCategory | "all") => void;
  stats: StudentStats;
  onOpenStats: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedGrade,
  setSelectedGrade,
  selectedCategory,
  setSelectedCategory,
  stats,
  onOpenStats,
  onOpenGuide,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("chat")}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-sky-400 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent tracking-tight">
                  Socrates Tin Học
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI THPT
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Học sâu - Hiểu bản chất - Tự lập trình
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              id="nav-tab-chat"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Hỏi Thầy AI</span>
            </button>

            <button
              id="nav-tab-editor"
              onClick={() => setActiveTab("editor")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "editor"
                  ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Soạn & Phân Tích Code</span>
            </button>

            <button
              id="nav-tab-library"
              onClick={() => setActiveTab("library")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "library"
                  ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kho Bài Tập THPT</span>
            </button>
          </nav>

          {/* Student Stats & Guide Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-streak-stats"
              onClick={onOpenStats}
              className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all"
              title="Thành tích học tập Socratic"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span className="hidden md:inline text-slate-300">Chuỗi:</span>
              <span className="font-bold text-amber-400">{stats.streakDays} ngày</span>
            </button>

            <button
              id="btn-open-badges"
              onClick={onOpenStats}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all relative"
              title="Danh hiệu & Huy hiệu"
            >
              <Award className="w-4.5 h-4.5" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {stats.badges.filter((b) => b.unlocked).length}
              </span>
            </button>

            <button
              id="btn-socratic-guide"
              onClick={onOpenGuide}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
              title="Phương pháp Socratic là gì?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Grade & Subject Quick Filter Sub-bar */}
        <div className="py-2.5 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-xs">
          <div className="flex items-center space-x-1.5 min-w-max">
            <span className="text-slate-400 font-medium mr-1 text-[11px]">Khối Lớp:</span>
            {(["Tất cả", "Lớp 10", "Lớp 11", "Lớp 12", "Thi HSG THPT"] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedGrade === grade
                    ? "bg-indigo-600 text-white font-semibold shadow"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 min-w-max">
            <span className="text-slate-400 font-medium mr-1 text-[11px]">Chủ Đề:</span>
            {[
              { id: "all", label: "Tất cả" },
              { id: "python", label: "🐍 Python" },
              { id: "cpp", label: "⚡ C++" },
              { id: "algo", label: "🧮 Thuật Toán" },
              { id: "sql", label: "🗄️ CSDL SQL" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as SubjectCategory | "all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
