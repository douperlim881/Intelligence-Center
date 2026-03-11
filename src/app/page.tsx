"use client";
import ComingSoonView from "@/components/ComingSoonView";
import { Send, Paperclip, Loader2, Brain, ChevronDown, List, MessageSquare, Hash, Trash2, Pin, Star, Settings, Compass } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// 1. 引入我们在 ActorsView 中定义好的 Actor 类型
import ActorsView, { Actor } from "@/components/ActorsView";

// 2. 定义每一条聊天消息的结构
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 3. 定义每一个历史会话的结构
export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isFavorite: boolean;
  actorId?: string; // 可选属性，因为普通对话没有 actorId
}

// 在 Home 函数上方定义
function ThoughtBlock({ thought }: { thought: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      {/* 展开/关闭按钮 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
      >
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        <span>{isOpen ? 'Hide thinking' : 'Show thinking'}</span>
      </button>

      {/* 思维内容区：点击此处任何位置即可收起 */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="mt-2 p-4 bg-zinc-50/80 dark:bg-zinc-900/50 border-l-2 border-purple-500/30 rounded-r-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group/thought"
        >
          <div className="prose prose-sm dark:prose-invert italic text-zinc-500 dark:text-zinc-400 select-none">
            <ReactMarkdown>{thought}</ReactMarkdown>
          </div>
          <div className="mt-2 text-[9px] text-zinc-400 opacity-0 group-hover/thought:opacity-100 transition-opacity text-right uppercase tracking-tighter">
            Click to collapse
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  // 2. 在这里添加 API Key 与 设置弹窗 的状态
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // 3. 在应用初始化时，读取本地保存的 Key
  useEffect(() => {
    const savedKey = localStorage.getItem('psc_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);
  
  // 将 view 状态的类型扩展，加入 'roadmap'
  const [view, setView] = useState<'chat' | 'actors' | 'roadmap'>('chat');

  // 更新视图切换函数
  const handleViewChange = (newView: 'chat' | 'actors' | 'roadmap') => {
    if (currentSessionId && messages.length === 0) {
      setSessions(prev => prev.filter(s => s.id !== currentSessionId));
      setCurrentSessionId(null);
    }
    setView(newView);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  // --- Session Persistence Logic ---
  const [sessions, setSessions] = useState<Session[]>([]); // 存储所有历史会话
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);  

  // A. 初始化：从本地加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('psc_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      // 如果有历史记录，默认加载最近的一条
      if (parsed.length > 0) {
        const last = parsed[0];
        setCurrentSessionId(last.id);
        setMessages(last.messages);
      }
    }
  }, []);

  // B. 自动同步：当 messages 变化时，实时保存到当前会话并同步 localStorage
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      const updatedSessions = sessions.map(s => {
        if (s.id === currentSessionId) {
          // 如果是新会话的第一条，自动生成标题
          const title = s.title === "New Chat" ? messages[0].content.slice(0, 20) : s.title;
          return { ...s, messages, title, updatedAt: Date.now() };
        }
        return s;
      });

      // 按时间倒序排列，确保最近的在最上面
      const sorted = updatedSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      setSessions(sorted);
      localStorage.setItem('psc_sessions', JSON.stringify(sorted));
    }
  }, [messages]);

  // C. 创建新会话逻辑
  const createNewChat = () => {
  if (currentSessionId && messages.length === 0) {
    setSessions(prev => prev.filter(s => s.id !== currentSessionId));
  }
  
  const newId = Date.now().toString();
  const newSession: Session = {
    id: newId, // 或者 newId
    title: input ? input.slice(0, 25) : "New Chat",
    messages: [],
    createdAt: Date.now(), // 👈 补上这个
    updatedAt: Date.now(),
    isPinned: false,
    isFavorite: false      // 👈 补上这个
  };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    setView('chat');
  };

  // D. 切换会话
  const loadSession = (id: string) => {
  // 核心逻辑：如果当前会话为空，切换时将其删除
    if (currentSessionId && messages.length === 0) {
      setSessions(prev => prev.filter(s => s.id !== currentSessionId));
    }

    const target = sessions.find(s => s.id === id);
    if (target) {
      setCurrentSessionId(id);
      setMessages(target.messages);
      setView('chat'); // 切换到对话视图
    }
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      // 优先级 1：置顶 (Pinned) 始终在最上方
      if (!!a.isPinned !== !!b.isPinned) return a.isPinned ? -1 : 1;
      // 优先级 2：最近改动 (updatedAt)
      if (a.updatedAt !== b.updatedAt) return b.updatedAt - a.updatedAt;
      // 优先级 3：最新创建 (createdAt)
      return b.createdAt - a.createdAt;
    });
  }, [sessions]);

  // 3. 管理功能函数
  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('psc_sessions', JSON.stringify(updated));
    if (currentSessionId === id) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s);
    setSessions(updated);
    localStorage.setItem('psc_sessions', JSON.stringify(updated));
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s);
    setSessions(updated);
    localStorage.setItem('psc_sessions', JSON.stringify(updated));
  };

  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. 逻辑保持不变：解析与索引抓取
  const parseContent = (content: string) => {
    const thoughtMatch = content.match(/__THOUGHT_START__([\s\S]*?)__THOUGHT_END__/);
    const thought = thoughtMatch ? thoughtMatch[1] : null;
    const mainContent = content.replace(/__THOUGHT_START__[\s\S]*?__THOUGHT_END__/, "");
    return { thought, mainContent };
  };

  const tableOfContents = useMemo(() => {
    if (messages.length === 0) return [];
    const map: { id: string; text: string; type: 'user' | 'header' }[] = [];
    messages.forEach((m) => {
      if (m.role === 'user' && m.content.length > 5) {
        map.push({ id: `msg-${m.id}`, text: m.content, type: 'user' });
      } else if (m.role === 'assistant') {
        const { mainContent } = parseContent(m.content);
        const lines = mainContent.split('\n');
        lines.forEach((line) => {
          const match = line.match(/^(#{1,3})\s+(.*)/);
          if (match) map.push({ id: `msg-${m.id}`, text: match[2], type: 'header' });
        });
      }
    });
    return map;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    // 🚀 核心改变：不再读取 process.env，而是读取本地存储
    const storedKey = localStorage.getItem('psc_api_key');
    if (!storedKey) {
      throw new Error("API Key is missing. Please configure your GROQ_API_KEY in the Settings.");
    }

    
    let activeSessionId = currentSessionId;
    let currentMessages = [...messages];

    // --- 自动创建会话逻辑 ---
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      const newSession : Session = {
        id: activeSessionId,
        title: input.slice(0, 25), // 使用第一条消息的前 25 个字符作为标题
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: false,
        isFavorite: false
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(activeSessionId);
    }

    const userMsg : Message = { id: Date.now().toString(), role: 'user', content: input };
    currentMessages = [...currentMessages, userMsg];
    setMessages(currentMessages);
    setInput("");
    setIsProcessing(true);
    try {
      const storedKey = localStorage.getItem('psc_api_key');
      if (!storedKey) {
        throw new Error("API Key is missing. Please configure your GROQ_API_KEY in the Settings.");
      }

      // 🌟 数据清洗：只提取 role 和 content，防止 API 报错
      const cleanMessages = [...currentMessages, userMsg].map(({ role, content }) => ({ role, content }));

      // ==========================================
      // 引擎一：Devil (快速生成思维链，非流式)
      // ==========================================
      const devilRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${storedKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: "As 'The Devil', provide a direct, critical, and high-speed analytical thought process." },
            ...cleanMessages // 传入历史记录
          ],
          temperature: 0.7
        })
      });
      
      if (!devilRes.ok) throw new Error("Devil Engine Failed");
      const devilData = await devilRes.json();
      const devilThought = devilData.choices[0].message.content;

      // ==========================================
      // 引擎二：Angel (基于思维链生成最终答案，流式)
      // ==========================================
      const angelRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${storedKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            ...cleanMessages,
            { role: 'assistant', content: `[Devil's Proposal]: ${devilThought}` },
            { role: 'system', content: "You are 'The Angel'. Summarize the final answer based on the Devil's proposal. Do not mention 'The Devil' or 'The Angel' titles." }
          ],
          stream: true // 开启流式输出
        })
      });

      if (!angelRes.ok) throw new Error("Angel Engine Failed");

      // 🌟 核心拼装：手动把 Devil 的思考注入到特定的标签中，唤醒 UI
      // 如果你之前定义的 parseContent 靠的是 <think> 标签，请改成 <think>\n${devilThought}\n</think>\n\n
      const thoughtTag = `__THOUGHT_START__\n${devilThought}\n__THOUGHT_END__\n\n`;
      let streamContent = thoughtTag; 
      const assistantId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: streamContent } as Message]);

      // --- 流式解码器 (我们刚才写好的最稳健版本) ---
      const reader = angelRes.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ""; 
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const parsedData = JSON.parse(line.slice(6));
                const delta = parsedData.choices[0]?.delta?.content || "";
                streamContent += delta;
                
                setMessages(prev => prev.map(m => 
                  m.id === assistantId ? { ...m, content: streamContent } : m
                ));
              } catch (e) {
                // 忽略碎片数据报错
              }
            }
          }
        }
      }
    } catch (e: unknown) {
      console.error(e);

      // 🚀 安全提取错误信息
      // 检查 e 是否是标准的 Error 对象
      const errorMessage = e instanceof Error ? e.message : String(e);

      const errorId = Date.now().toString();
      const errorMsg: Message = { 
        id: errorId, 
        role: 'assistant', 
        content: `🚨 System Alert: ${errorMessage}` 
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  {/** Actors */}
  const startChatWithActor = (actor: Actor) => {
    const newId = Date.now().toString();
    
    const newSession : Session = {
      id: newId,
      title: `Chat with ${actor.name}`,
      messages: [
        { id: 'sys', role: 'system', content: actor.systemPrompt } // 注入人设
      ],
      updatedAt: Date.now(),
      createdAt: Date.now(),
      isFavorite: false,
      isPinned: false,
      actorId: actor.id // 标记此对话由哪个角色驱动
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages(newSession.messages);
    setView('chat');
  };

  return (
    <main className="flex h-screen w-screen bg-white dark:bg-zinc-950 overflow-hidden">
      {/* --- Left Sidebar: Chat History --- */}
      {/* --- 左侧动态感应历史侧边栏 --- */}
      <div 
        onMouseEnter={() => setLeftHover(true)}
        onMouseLeave={() => setLeftHover(false)}
        className="fixed left-0 top-0 w-10 h-full z-50 bg-transparent" // 极窄感应带
      />
      <aside 
      onMouseEnter={() => setLeftHover(true)}
      onMouseLeave={() => setLeftHover(false)}
      className={`
        h-full flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-100 dark:border-zinc-800
        transition-all duration-300 ease-in-out overflow-hidden shrink-0
        ${leftHover ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'}
      `}
    >
      <div className="w-64 h-full flex flex-col">
        <div className="px-3 mt-6 mb-4 space-y-1">
          <button 
            onClick={() => handleViewChange('chat')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
              ${view === 'chat' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
            `}
          >
            <MessageSquare size={18} />
            <span className="font-medium">Chat</span>
          </button>
            
          <button 
            onClick={() => handleViewChange('actors')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
              ${view === 'actors' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
            `}
          >
            {/* 这里可以使用 Lucide 的 UserSquare2 或 Brain */}
            <Brain size={18} />
            <span className="font-medium">Actors</span>
          </button>
          {/* 🚀 新增：Roadmap 导航按钮 */}
          <button 
            onClick={() => handleViewChange('roadmap')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
              ${view === 'roadmap' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
            `}
          >
            <Compass size={18} />
            <span className="font-medium">Roadmap</span>
          </button>
        </div>
        <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 mx-4 my-2" /> {/* 分割线 */}
        <div className="fixed left-0 top-0 h-full w-10 z-50 group/left-sidebar flex items-center bg-transparent">
          {/* 物理感应带 */}
          <div className="h-full w-full cursor-pointer pointer-events-auto" />
          
          {/* 悬浮历史面板 */}
          {/* <aside className="
            absolute left-2
            h-[85vh] w-64 
            bg-white/98 dark:bg-zinc-900/98 backdrop-blur-3xl 
            border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            flex flex-col overflow-hidden
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            -translate-x-[110%] opacity-0 pointer-events-none 
            group-hover/left-sidebar:translate-x-0 group-hover/left-sidebar:opacity-100 group-hover/left-sidebar:pointer-events-auto
          ">
            <div className="p-5 pb-2">
              
            </div>
          </aside> */}
        </div>
        <div className="p-4 font-bold text-xs tracking-widest opacity-50 mt-4">SESSIONS</div>
        <button 
                onClick={createNewChat}
                className="w-full py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                + New Session
          </button>
        <br />
        <nav className="flex-1 overflow-y-auto">
           {sortedSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => loadSession(s.id)}
                  className={`group/item relative w-full p-4 rounded-2xl text-xs transition-all cursor-pointer flex flex-col gap-2
                    ${currentSessionId === s.id 
                      ? 'bg-zinc-100 dark:bg-zinc-800 shadow-inner' 
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`truncate pr-4 font-medium ${currentSessionId === s.id ? 'text-zinc-900 dark:text-zinc-100' : ''}`}>
                      {s.title}
                    </span>
                    {s.isPinned && <Pin size={10} className="text-purple-500 fill-purple-500" />}
                  </div>
                    
                  {/* 悬浮操作按钮组 */}
                  <div className="flex items-center gap-3 mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button onClick={(e) => togglePin(s.id, e)} className={`hover:text-purple-500 ${s.isPinned ? 'text-purple-500' : ''}`}>
                      <Pin size={12} />
                    </button>
                    <button onClick={(e) => toggleFavorite(s.id, e)} className={`hover:text-yellow-500 ${s.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`}>
                      <Star size={12} />
                    </button>
                    <button onClick={(e) => deleteSession(s.id, e)} className="hover:text-red-500 ml-auto">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
        </nav>
      </div>
      </aside>
      {/* 🚀 新增：底部的设置按钮 */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
      {/* 核心主聊天区 */}
      {/* 核心主聊天区 */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {view === 'chat' && (
          /* --- 对话视图模式 --- */
          <>
            <div className="flex-1 overflow-y-auto py-8 px-4 md:px-24 scrollbar-hide space-y-12">
              {messages.map((m) => {
                const { thought, mainContent } = parseContent(m.content);
                const isAssistant = m.role === 'assistant';

                return (
                  <div 
                    key={m.id} // 必须：解决 React 报错的关键
                    id={`msg-${m.id}`} // 必须：确保右侧 Document Map 的跳转锚点依然有效
                    className={`flex gap-4 w-full group/msg scroll-mt-10 ${!isAssistant ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* 1. Assistant 的 Logo (仅在是 Assistant 时显示) */}
                    {isAssistant && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                    
                          {/* 设计点：外围旋转光环 (Halo) */}
                          {/* 增加 inset-[-2px] 让光环向外扩张，不与图标贴合 */}
                          {isProcessing && m.id === messages[messages.length - 1].id && (
                            <div className="absolute inset-[-2px] rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                          )}

                          {/* 设计点：核心图标 (Logo) */}
                          {/* 移除容器边框线，仅保留阴影和动态颜色 */}
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                            ${isProcessing && m.id === messages[messages.length - 1].id 
                              ? 'bg-purple-50/50 dark:bg-purple-900/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                              : 'bg-transparent'}
                          `}>
                            <Brain 
                              size={18} 
                              className={`
                                transition-colors duration-500
                                ${isProcessing && m.id === messages[messages.length - 1].id 
                                  ? 'text-purple-500' 
                                  : 'text-zinc-400'}
                              `} 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. 消息内容区 */}
                    <div className={`max-w-[85%] ${isAssistant ? 'flex-1 min-w-0' : ''}`}>
                      {isAssistant ? (
                        <>
                          {thought && <ThoughtBlock thought={thought} />}
                          <div className="prose dark:prose-invert prose-zinc max-w-none text-zinc-800 dark:text-zinc-200">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainContent}</ReactMarkdown>
                          </div>
                        </>
                      ) : (
                        <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-6 py-3 rounded-2xl shadow-lg ml-auto inline-block">
                          <div className="prose dark:prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainContent}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          <div ref={messagesEndRef} />
            </div>
        
            {/* 底部输入框 */}
            <div className="p-6 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent">
              <form onSubmit={handleDispatch} className="flex items-center w-full max-w-3xl mx-auto border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-3.5 bg-white dark:bg-zinc-900 shadow-2xl">
                <input value={input} onChange={(e)=>setInput(e.target.value)} disabled={isProcessing} className="flex-1 bg-transparent outline-none px-4 text-sm" placeholder="Ask anything..."/>
                <button type="submit" disabled={isProcessing || !input.trim()} className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full">
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        )}
        {view === 'actors' && (
        <ActorsView onSelectActor={startChatWithActor} />
        )}
  
        {/* 🚀 新增：展示 Roadmap 视图 */}
        {view === 'roadmap' && (
          <ComingSoonView />
        )}

      </div>

      {/* --- 右侧边栏容器与感应区 (严格限制仅在 chat 视图显示) --- */}
      {view === 'chat' && (
        <>
          <aside 
            onMouseEnter={() => setRightHover(true)}
            onMouseLeave={() => setRightHover(false)}
            className={`
              h-full flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 border-l border-zinc-100 dark:border-zinc-800
              transition-all duration-300 ease-in-out overflow-hidden shrink-0
              ${rightHover && messages.length > 0 ? 'w-72 opacity-100' : 'w-0 opacity-0'}
            `}
          >
            <div className="w-72 h-full flex flex-col">
              <div className="fixed right-0 top-0 h-full w-10 z-50 group/sidebar flex items-center justify-end bg-transparent">
                <div className="h-full w-full cursor-pointer pointer-events-auto" />
              </div>

              {/* 只有在有消息时才显示内容 */}
              {messages.length > 0 && (
                <div className="w-72 h-full flex flex-col">
                  <div className="p-4 font-bold text-xs tracking-widest opacity-50 mt-4">DOCUMENT MAP</div>
                  <nav className="flex-1 overflow-y-auto">
                    {tableOfContents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center mt-20 opacity-20">
                        <Hash size={24} />
                        <p className="text-[10px] mt-2 italic text-center">Empty session...</p>
                      </div>
                    ) : (
                      tableOfContents.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => scrollToAnchor(item.id)}
                          className={`
                            text-left w-full text-xs py-2.5 px-3 rounded-xl transition-all 
                            hover:bg-zinc-100 dark:hover:bg-zinc-800 
                            flex items-start gap-2 group/item 
                            ${item.type === 'user' ? 'text-zinc-700 dark:text-zinc-200 font-medium' : 'text-zinc-500 pl-6 text-[11px]'}
                          `}
                        >
                          <span className="shrink-0 opacity-20 group-hover/item:opacity-100 transition-opacity">
                            {item.type === 'user' ? <MessageSquare size={12} className="mt-0.5" /> : <Hash size={12} className="mt-0.5" />}
                          </span>
                          <span className="truncate">{item.text}</span>
                        </button>
                      ))
                    )}
                  </nav>
                </div>
              )}
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest text-center py-4">PaaS Engine v1.0</span>
            </div>
          </aside>
          
          {/* 只有在对话页面且有内容时，感应带才生效 */}
          {messages.length > 0 && (
            <div onMouseEnter={() => setRightHover(true)} onMouseLeave={() => setRightHover(false)} className="fixed right-0 top-0 w-2 h-full z-50 bg-transparent" />
          )}
        </>
      )}
      {/* --- 🚀 新增：全局设置弹窗 (Settings Modal) --- */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 transform transition-all scale-100">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Settings size={24} className="text-purple-500" />
              Engine Configuration
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Groq API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-5 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono text-sm"
              />
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
                Your API key is stored locally in your device`&rsquo;`s secure storage. It is never sent to any intermediary servers. This ensures absolute data privacy.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)} 
                className="px-6 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('psc_api_key', apiKey);
                  setShowSettings(false);
                }}
                className="px-6 py-2.5 text-sm font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}