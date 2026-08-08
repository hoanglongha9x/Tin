import React, { useState } from "react";
import {
  BookOpen,
  Filter,
  Sparkles,
  ChevronRight,
  Code2,
  MessageSquare,
  Search,
  CheckCircle2,
  HelpCircle,
  Plus,
  Loader2,
  Tag,
  GraduationCap
} from "lucide-react";
import { Problem, GradeLevel, SubjectCategory, DifficultyLevel } from "../types";
import { CURATED_PROBLEMS } from "../data/curatedProblems";

interface ProblemLibraryProps {
  selectedGradeFilter: GradeLevel | "Tất cả";
  selectedCategoryFilter: SubjectCategory | "all";
  onSelectProblemForChat: (problem: Problem) => void;
  onOpenCodeInEditor: (code: string, language: string) => void;
}

export const ProblemLibrary: React.FC<ProblemLibraryProps> = ({
  selectedGradeFilter,
  selectedCategoryFilter,
  onSelectProblemForChat,
  onOpenCodeInEditor,
}) => {
  const [problems, setProblems] = useState<Problem[]>(CURATED_PROBLEMS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProblemModal, setActiveProblemModal] = useState<Problem | null>(null);

  // AI Generator state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genGrade, setGenGrade] = useState<GradeLevel>("Lớp 10");
  const [genTopic, setGenTopic] = useState<string>("Lập trình Python");
  const [genDifficulty, setGenDifficulty] = useState<DifficultyLevel>("Trung bình");
  const [showGenModal, setShowGenModal] = useState<boolean>(false);

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchGrade =
      selectedGradeFilter === "Tất cả" || p.grade === selectedGradeFilter;
    const matchCategory =
      selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchCategory && matchSearch;
  });

  const handleGenerateProblem = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: genGrade,
          topic: genTopic,
          difficulty: genDifficulty,
        }),
      });

      const data = await response.json();
      if (data.title) {
        const newProblem: Problem = {
          id: "generated-" + Date.now(),
          title: data.title,
          grade: (data.grade as GradeLevel) || genGrade,
          category:
            genTopic.toLowerCase().includes("python")
              ? "python"
              : genTopic.toLowerCase().includes("c++")
              ? "cpp"
              : genTopic.toLowerCase().includes("sql")
              ? "sql"
              : "algo",
          difficulty: (data.difficulty as DifficultyLevel) || genDifficulty,
          description: data.description,
          inputFormat: data.inputFormat,
          outputFormat: data.outputFormat,
          sampleInput: data.sampleInput,
          sampleOutput: data.sampleOutput,
          socraticQuestion: data.socraticQuestion,
          hintSteps: data.hintSteps || [],
          starterCode: {
            python: `# ${data.title}\n# Yêu cầu: ${data.description.slice(0, 80)}...\n`,
          },
        };

        setProblems([newProblem, ...problems]);
        setActiveProblemModal(newProblem);
        setShowGenModal(false);
      } else {
        alert("Không thể tạo bài tập mới. Vui lòng thử lại!");
      }
    } catch (e: any) {
      alert("Lỗi khi kết nối AI: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyBadgeColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case "Dễ":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Trung bình":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Khó":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "HSG":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài tập Tin học THPT theo tên, từ khóa..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center space-x-1.5 transition-all hover:scale-102"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tạo Bài Tập AI Mới</span>
        </button>
      </div>

      {/* Grid of Problems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProblems.map((prob) => (
          <div
            key={prob.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {prob.grade}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadgeColor(
                    prob.difficulty
                  )}`}
                >
                  {prob.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                {prob.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {prob.description}
              </p>

              {/* Socratic Preview */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs text-amber-300/90 space-y-1">
                <span className="font-semibold text-[11px] text-amber-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Gợi ý Socratic:
                </span>
                <p className="line-clamp-2 text-[11px] text-slate-300">
                  "{prob.socraticQuestion}"
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 uppercase font-mono">
                {prob.category.toUpperCase()}
              </span>

              <button
                onClick={() => setActiveProblemModal(prob)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 group-hover:translate-x-1 transition-all"
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Problem Detail Modal */}
      {activeProblemModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeProblemModal.grade}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadgeColor(
                      activeProblemModal.difficulty
                    )}`}
                  >
                    {activeProblemModal.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-amber-300 mt-2">
                  {activeProblemModal.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveProblemModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-200">
              <h4 className="font-semibold text-slate-400 text-xs uppercase">
                Mô tả bài tập
              </h4>
              <p className="whitespace-pre-line leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {activeProblemModal.description}
              </p>
            </div>

            {/* Sample Input/Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block text-[11px]">
                  VÍ DỤ INPUT
                </span>
                <pre className="text-emerald-300">{activeProblemModal.sampleInput}</pre>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block text-[11px]">
                  VÍ DỤ OUTPUT
                </span>
                <pre className="text-emerald-300">{activeProblemModal.sampleOutput}</pre>
              </div>
            </div>

            {/* Socratic Question */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <HelpCircle className="w-4 h-4" /> Câu hỏi gợi mở của Thầy Socrates:
              </span>
              <p className="text-slate-200 font-medium italic">
                "{activeProblemModal.socraticQuestion}"
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
              {activeProblemModal.starterCode?.python && (
                <button
                  onClick={() => {
                    onOpenCodeInEditor(
                      activeProblemModal.starterCode?.python || "",
                      "python"
                    );
                    setActiveProblemModal(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700"
                >
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Mở Code Mẫu (Python)</span>
                </button>
              )}

              <button
                onClick={() => {
                  onSelectProblemForChat(activeProblemModal);
                  setActiveProblemModal(null);
                }}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Thảo Luận Cùng Thầy Socrates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate AI Problem Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Tạo Bài Tập Mới Bằng AI
              </h3>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Khối Lớp:
                </label>
                <select
                  value={genGrade}
                  onChange={(e) => setGenGrade(e.target.value as GradeLevel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Lớp 10">Lớp 10 (Lập trình cơ bản, Python)</option>
                  <option value="Lớp 11">Lớp 11 (C++, Mảng, Thuật toán)</option>
                  <option value="Lớp 12">Lớp 12 (Cơ sở dữ liệu SQL)</option>
                  <option value="Thi HSG THPT">Đề thi HSG THPT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Chủ đề mong muốn:
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="VD: Cấu trúc lặp, Mảng 1 chiều, Truy vấn SQL..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Độ khó:
                </label>
                <select
                  value={genDifficulty}
                  onChange={(e) =>
                    setGenDifficulty(e.target.value as DifficultyLevel)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Dễ">Dễ (Nhận biết & Thông hiểu)</option>
                  <option value="Trung bình">Trung bình (Vận dụng)</option>
                  <option value="Khó">Khó (Vận dụng cao)</option>
                  <option value="HSG">HSG Tỉnh / THPT Quốc gia</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateProblem}
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thầy Socrates đang soạn đề...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Đề Bài Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
