// src/components/ActorsView.tsx
"use client";

import { Plus, MoreVertical, ShieldCheck } from "lucide-react";
import { useState } from "react";

// 1. 定义 Actor 的数据结构类型
export interface Actor {
  id: string;
  name: string;
  desc: string;
  systemPrompt: string;
  color: string;
}

// 2. 将传入函数的参数类型也从 any 改为 Actor
export default function ActorsView({ onSelectActor }: { onSelectActor: (actor: Actor) => void }) {
  
  // 3. 告诉 useState 这是一个装满 Actor 的数组
  const [actors, setActors] = useState<Actor[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('psc_actors') : null;
    return saved ? JSON.parse(saved) : [
      { id: 'devil',      name: "Devil",      desc: "Focuses on efficiency.", systemPrompt: "You are the Devil...", color: "bg-purple-500" },
      { id: 'angel',      name: "Angel",      desc: "Refines logic and ensures ethical alignment.", systemPrompt: "You are the Angel...", color: "bg-blue-500" },
      { id: 'researcher', name: "Researcher", desc: "Deep factual checking and academic sourcing.", systemPrompt: "You are the Researcher...", color: "bg-emerald-500" },
      { id: 'coder',      name: "Coder",      desc: "Specializes in Next.js and Rust systems.", systemPrompt: "You are the Coder...", color: "bg-orange-500" },
      { id: 'strategist', name: "Strategist", desc: "Market analysis and PaaS positioning.", systemPrompt: "You are the Strategist...", color: "bg-pink-500" },
      { id: 'translator', name: "Translator", desc: "Cross-lingual semantic mapping.", systemPrompt: "You are the Translator...", color: "bg-cyan-500" },
    ];
  });

  const createNewActor = () => {
    const name = prompt("Enter Actor Name:");
    if (!name) return;
    
    // 确保新创建的对象也符合 Actor 接口
    const newActor: Actor = {
      id: Date.now().toString(),
      name,
      desc: "Custom personalized agent.",
      systemPrompt: "You are a helpful assistant.",
      color: "bg-zinc-500"
    };
    const updated = [newActor, ...actors];
    setActors(updated);
    localStorage.setItem('psc_actors', JSON.stringify(updated));
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 md:p-12 scrollbar-hide bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Actors</h1>
          <p className="text-zinc-500 mt-2 text-sm">Personalize your orchestration experience with custom agents.</p>
        </header>
        
        {/* 3列网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 创建按钮卡片 */}
          <div onClick={createNewActor} className="group relative h-52 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 cursor-pointer">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-3 translate-y-2 group-hover:translate-y-0">
              <div className="w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xl">
                <Plus size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Create Actor</span>
            </div>
          </div>

          {/* 渲染卡片 */}
          {actors.map(actor => (
            <div 
              key={actor.id} 
              onClick={() => onSelectActor(actor)}
              className="h-52 rounded-[32px] bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-7 flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${actor.color} bg-opacity-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100`}>
                  <ShieldCheck size={24} className="opacity-40" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-opacity">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{actor.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{actor.desc}</p>
              </div>

              {/* 卡片装饰：轻微渐变背景 */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${actor.color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}