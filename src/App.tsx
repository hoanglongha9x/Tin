/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { SocraticChat } from "./components/SocraticChat";
import { CodeInspector } from "./components/CodeInspector";
import { ProblemLibrary } from "./components/ProblemLibrary";
import { SocraticGuideModal } from "./components/SocraticGuideModal";
import { StudentProgressModal } from "./components/StudentProgressModal";
import {
  ChatMessage,
  GradeLevel,
  SubjectCategory,
  Problem,
  StudentStats,
  Badge,
} from "./types";

const INITIAL_BADGES: Badge[] = [
  {
    id: "b1",
    title: "Học Sĩ Socratic",
    description: "Đã hỏi & thảo luận 3 câu hỏi gợi mở cùng Thầy Socrates.",
    icon: "🎓",
    unlocked: true,
  },
  {
    id: "b2",
    title: "Thợ Săn Lỗi Bug",
    description: "Sử dụng tính năng Phân tích Socratic để tự sửa code.",
    icon: "🔍",
    unlocked: true,
  },
  {
    id: "b3",
    title: "Cao Thủ Python THPT",
    description: "Hoàn thành bài tập lập trình Python Lớp 10.",
    icon: "🐍",
    unlocked: false,
  },
  {
    id: "b4",
    title: "Thần Đồng C++",
    description: "Giải thuật toán C++ mảng và đệ quy.",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "b5",
    title: "Phù Thủy CSDL SQL",
    description: "Thực hành bài tập CSDL & truy vấn SQL Lớp 12.",
    icon: "🗄️",
    unlocked: false,
  },
  {
    id: "b6",
    title: "Ngọn Lửa Kiên Trì",
    description: "Duy trì chuỗi học tập Socratic liên tục.",
    icon: "🔥",
    unlocked: true,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "editor" | "library" | "guide">(
    "chat"
  );
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | "Tất cả">("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory | "all">(
    "all"
  );

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("socrates_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        content: `**Chào em! Thầy là Socrates Tin Học.** 👋

Thầy rất vui khi được đồng hành cùng em trong môn Tin học THPT! Dù em đang học **Python Lớp 10**, **C++ Thuật toán Lớp 11**, hay **CSDL SQL Lớp 12**, Thầy ở đây để hỗ trợ em.

📌 **Cách Thầy và em sẽ học cùng nhau:**
1. Em có thể gửi câu hỏi, bài tập, hoặc ảnh chụp đề bài.
2. Thầy sẽ **không viết sẵn code đáp án**, mà sẽ **đặt các câu hỏi gợi mở từng bước** để em tự tư duy ra cách làm.
3. Khi code em bị lỗi, Thầy sẽ chỉ ra **chính xác dòng bị lỗi** và lý do, sau đó em hãy tự sửa nhé!

Em muốn Thầy giúp đỡ bài tập nào hôm nay?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Code snippet transferring to chat
  const [attachedCode, setAttachedCode] = useState<{
    code: string;
    language: string;
  } | null>(null);

  // Inspector code state
  const [inspectorCode, setInspectorCode] = useState<string>("");
  const [inspectorLang, setInspectorLang] = useState<string>("python");

  // Stats & Badges
  const [stats, setStats] = useState<StudentStats>(() => {
    const saved = localStorage.getItem("socrates_stats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      streakDays: 3,
      questionsAsked: 12,
      problemsAttempted: 5,
      codesAnalyzed: 4,
      badges: INITIAL_BADGES,
    };
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("socrates_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("socrates_stats", JSON.stringify(stats));
  }, [stats]);

  // Handle Send Message in Chat
  const handleSendMessage = async (text: string, image?: string) => {
    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      image,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Update stats
    setStats((prev) => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
          })),
          topic: selectedCategory !== "all" ? selectedCategory : undefined,
          grade: selectedGrade !== "Tất cả" ? selectedGrade : undefined,
        }),
      });

      const data = await response.json();

      if (data.text) {
        const assistantMsg: ChatMessage = {
          id: "assistant-" + Date.now(),
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: "err-" + Date.now(),
          role: "assistant",
          content:
            "⚠️ " +
            (data.error ||
              "Thầy chưa phản hồi được câu hỏi này. Em hãy thử đặt lại câu hỏi rõ hơn nhé!"),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          "⚠️ Đã xảy ra lỗi kết nối: " +
          error.message +
          ". Em hãy kiểm tra kết nối mạng nhé!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Attach code from Inspector -> Chat
  const handleAttachCodeToChat = (code: string, language: string) => {
    setAttachedCode({ code, language });
    setActiveTab("chat");
  };

  // Open code from Chat or Problem Library -> Code Inspector
  const handleOpenCodeInEditor = (code: string, language: string) => {
    setInspectorCode(code);
    setInspectorLang(language);
    setActiveTab("editor");
  };

  // Select Problem from Library -> Load into Chat
  const handleSelectProblemForChat = (problem: Problem) => {
    const promptText = `Thầy Socrates ơi, em đang muốn giải bài tập này:\n\n**${
      problem.title
    }** (${problem.grade})\n\n**Yêu cầu:**\n${problem.description}\n\n**Input:** \`${
      problem.sampleInput
    }\` | **Output:** \`${
      problem.sampleOutput
    }\`\n\nThầy đặt câu hỏi gợi mở bước 1 giúp em với ạ!`;

    setActiveTab("chat");
    handleSendMessage(promptText);

    setStats((prev) => ({
      ...prev,
      problemsAttempted: prev.problemsAttempted + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        stats={stats}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "chat" && (
          <SocraticChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedGrade={selectedGrade}
            selectedCategory={selectedCategory}
            codeSnippetToAttach={attachedCode}
            onClearAttachedCode={() => setAttachedCode(null)}
            onOpenEditorWithCode={handleOpenCodeInEditor}
          />
        )}

        {activeTab === "editor" && (
          <CodeInspector
            initialCode={inspectorCode}
            initialLanguage={inspectorLang}
            onAttachCodeToChat={handleAttachCodeToChat}
          />
        )}

        {activeTab === "library" && (
          <ProblemLibrary
            selectedGradeFilter={selectedGrade}
            selectedCategoryFilter={selectedCategory}
            onSelectProblemForChat={handleSelectProblemForChat}
            onOpenCodeInEditor={handleOpenCodeInEditor}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 <strong>Socrates Tin Học</strong> — Trợ lý AI phương pháp Socratic dành cho THPT Việt Nam.
          </span>
          <span className="text-slate-400">
            Học lập trình Python • C++ • Thuật toán • CSDL SQL
          </span>
        </div>
      </footer>

      {/* Modals */}
      <SocraticGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <StudentProgressModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />
    </div>
  );
}
