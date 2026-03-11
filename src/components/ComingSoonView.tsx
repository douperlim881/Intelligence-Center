// src/components/ComingSoonView.tsx
"use client";

import { Blocks, CloudSync, Database, Mic, Lock, Sparkles, TerminalSquare } from "lucide-react";

export default function ComingSoonView() {
  // 定义未来计划的功能模块
  const upcomingFeatures = [
    {
      id: "rag",
      title: "Knowledge Base (RAG)",
      desc: "Upload PDFs, TXTs, and codebases. Let the AI orchestrate answers based on your private local data.",
      icon: <Database size={24} />,
      eta: "Q3 2026"
    },
    {
      id: "plugins",
      title: "Plugin Ecosystem",
      desc: "Connect to web search, GitHub, and local terminal execution for automated workflows.",
      icon: <Blocks size={24} />,
      eta: "Q4 2026"
    },
    {
      id: "voice",
      title: "Real-time Voice Engine",
      desc: "Full-duplex voice conversation capabilities powered by localized speech-to-text models.",
      icon: <Mic size={24} />,
      eta: "TBD"
    },
    {
      id: "sync",
      title: "P2P Cloud Sync",
      desc: "Securely sync your sessions and Actors across multiple devices using peer-to-peer encryption.",
      icon: <CloudSync size={24} />,
      eta: "TBD"
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 md:p-12 scrollbar-hide bg-zinc-50/30 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              <Sparkles className="text-purple-500" size={28} />
              Product Roadmap
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Preview the next generation of features currently under development.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest">
            <TerminalSquare size={14} />
            <span>Under Construction</span>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="relative group h-48 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 overflow-hidden"
            >
              {/* 核心内容区 (添加模糊效果暗示不可用) */}
              <div className="relative z-10 opacity-60 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed pr-8">{feature.desc}</p>
              </div>

              {/* 锁定遮罩层 (悬停时显现) */}
              <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xl">
                    <Lock size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 bg-white/80 dark:bg-zinc-900/80 px-3 py-1 rounded-full">
                    Target: {feature.eta}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}