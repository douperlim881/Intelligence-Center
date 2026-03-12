🌌 Intelligence Center™ (IC)
The Next-Generation Localized AI Orchestration Engine.

📖 Background & Vision
In an era of unchecked generative AI expansion, user data privacy and system controllability face unprecedented challenges. Intelligence Center is built on a core philosophy: Port-as-a-Service.

We do not intercept data, train models, or build cloud monopolies. Intelligence Center is a pure, locally deployed "intelligent orchestration hub." Through an ultra-efficient cross-process architecture (Tauri + Rust) and lightning-fast inference APIs (Groq Llama 3), we return the most powerful multi-model collaboration capabilities to you. Here, you have absolute data sovereignty while experiencing an interactive quality that rivals or exceeds top-tier web-based AI products.

✨ Current Features
1. 🎭 Dual-Engine Orchestration
Devil & Angel Architecture: Breaks the limits of single-model generation. The system features an asynchronous orchestration logic: a high-speed model (Llama-3.1-8b) acts as the "Devil," providing rapid, critical analytical thought chains, followed by a large-parameter model (Llama-3.3-70b) acting as the "Angel" to absorb the thought chain and elevate the final response.

Immersive Thought Folding: Faithfully recreates high-end AI UX. Supports click-to-collapse Markdown-rendered thought blocks (ThoughtBlock), keeping the main interface pristine.

2. 🛸 Zero-Gravity UI
Full-Screen Stealth Sidebars: Discards traditional cramped layouts. Left and right sidebars (History & Document Map) physically slide out only when the cursor approaches within 20px of the screen edge, providing ultimate visual breathing room.

Dynamic Document Map: The right sidebar actively monitors chat messages, automatically extracting core logic to generate anchor navigation. You will never get lost in long conversations.

Organic Motion Design: Finely tuned loading states, featuring smooth logo rotation, dynamic Halo Effects, and rock-solid SSE (Server-Sent Events) streaming typewriter rendering.

3. 🛡️ Absolute Privacy Architecture (Zero-Tracking BYOK)
B.Y.O.K (Bring Your Own Key): Zero hardcoded keys in the system. Users configure their own Groq API Key via a global Settings panel. The key is securely encrypted and stored solely in the local machine's localStorage.

Static Decoupling: Completely stripped of Node.js backend dependencies, running as a pure Native desktop application.

4. 🎛️ Actors Center
A built-in, Gems-like role configuration grid. Seamlessly switch between "Global Chat" and "Professional Role" modes, featuring automatic garbage collection for empty sessions.

🚀 Getting Started
This project features a highly automated desktop build pipeline.

Prerequisites
[Node.js (v18+)](https://nodejs.org/)

[Rust Toolchain](https://rustup.rs/) (Required for Tauri engine compilation)

Build Instructions

```Bash
    # 1. Clone the repository
    git clone https://github.com/your-username/intelligence-center.git
    cd intelligence-center

    # 2. Install frontend dependencies
    npm install

    # 3. Compile and build the Windows .exe in one click
    build-exe.bat
```

Once the build is complete, you can find the standalone installer in the `src-tauri/target/release/bundle/` directory.

🗺️ Roadmap & Technical Evolution
While Intelligence Center v1.0 already boasts a high degree of polish, delivering the core experience within a "24-hour extreme MVP" cycle required strategic technical compromises. Below is our blueprint for future development:

⚙️ Native Rust Core (Tauri Commands)
Migrate network requests and SSE stream parsing from frontend JavaScript down to the Rust backend. This completely separates UI rendering from network communication, achieving true native-level performance and secure encryption.

🧠 Local RAG (Retrieval-Augmented Generation)
Integrate a vector database. Allow users to drag and drop PDFs and local codebases into the Port, enabling fully offline, private knowledge base Q&A.

💾 Absolute Persistence via SQLite
Phase out localStorage in favor of tauri-plugin-sql. Write chat sessions and custom Actors to a local database, supporting unlimited storage, data export, and backups.

🗣️ Multimodal & Multi-Agent Debate
Introduce image recognition (Vision) and local voice (Whisper) capabilities. Support waking up multiple Actors simultaneously to autonomously debate and align logic on a single prompt.

🗃️ Deep Actor Editor
Unlock the global role configuration system. Allow users to precisely define System Prompts, assign specific models, and tweak Temperature (creativity) parameters per Actor.

Built with passion, designed for the future. — Intelligence Center Team
