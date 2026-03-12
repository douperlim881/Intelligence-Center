# Intelligence Center™ (IC)

A local, open-source AI orchestration hub built with Tauri and Rust, implementing a "Port-as-a-Service" architecture to replace traditional static monolithic frontends with dynamically generated UIs.

## 🏗 Architecture Overview

![Architecture Diagram Placeholder: Insert a Mermaid.js or Excalidraw diagram here showing the flow from Local LLM -> Rust Backend -> Generative UI]

Intelligence Center operates without a traditional Node.js backend. It leverages a cross-process architecture:
* **Core Engine**: Rust (Tauri Commands) handles all network requests, SSE stream parsing, and local I/O, ensuring UI rendering is fully decoupled from backend communication.
* **Inference Layer**: Designed for high-speed local or BYOK (Bring Your Own Key) APIs (defaulting to Groq Llama 3).
* **State Management**: By utilizing Generative UI (GenUI), application state is internalized within the agent's memory graph rather than relying on heavy frontend state libraries like Redux.

## ✨ Key Engineering Implementations

### 1. Asynchronous Dual-Model Pipeline (Multi-Agent Debate)
Instead of relying on a single model's zero-shot output, IC implements an asynchronous orchestration logic to mitigate hallucinations:
* **Node A (Critique)**: A high-speed, lower-parameter model (e.g., Llama-3.1-8b) generates the initial analytical thought chain.
* **Node B (Synthesis)**: A larger-parameter model (e.g., Llama-3.3-70b) ingests Node A's thought chain, resolves logical inconsistencies, and renders the final output.
* **Thought Folding**: The analytical reasoning steps are rendered as strictly localized Markdown blocks (`<ThoughtBlock />`) that can be collapsed to maintain UI cleanliness.

### 2. Zero-Tracking BYOK (Bring Your Own Key)
We prioritize absolute data sovereignty. 
* No hardcoded telemetry.
* Keys are encrypted and stored entirely in local `localStorage` (migrating to `tauri-plugin-sql` in v2.0).
* All data flows directly from the user's local machine to the inference API, bypassing any proprietary middle-tier servers.

### 3. Dynamic Document Mapping
The sidebar is not a static HTML element. It actively listens to SSE chat streams and automatically extracts semantic anchors from the conversation logic in real-time, generating a dynamic navigation tree for long-context sessions.

## 💻 Configuration Example (Port Definition)

Actors (Ports) are configured via simple JSON schemas. Here is an example of defining a specific professional role:

```json
{
  "actor_id": "auditor_01",
  "name": "Compliance Auditor",
  "model": "llama3-70b-8192",
  "temperature": 0.1,
  "system_prompt": "You are a highly analytical compliance engine. Your output must strictly follow the provided JSON schema for risk assessment.",
  "debate_mode": true
}
```

🚀 Getting Started
Prerequisites:
    - [Node.js (v18+)](https://nodejs.org/)
    - [Rust Toolchain](https://rustup.rs/) (Required for Tauri compilation)

### Build Instructions
```Bash
git clone [https://github.com/douperlim881/Intelligence-Center.git](https://github.com/douperlim881/Intelligence-Center.git)
cd Intelligence-Center
npm install
# Compile and build the native executable
build-exe.bat
```

The standalone binary will be located in `src-tauri/target/release/bundle/`.

🗺️ Roadmap
Native Rust Migration: Move all SSE stream parsing from frontend JS to Rust Tauri commands for native-level throughput.

Local RAG Integration: Embed a local vector DB for offline PDF/codebase Q&A without data exfiltration.

SQLite Persistence: Transition from localStorage to tauri-plugin-sql for robust, unlimited local session storage.


