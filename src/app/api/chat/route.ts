import { createGroq } from '@ai-sdk/groq';
import { generateText, streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const groq = createGroq({ apiKey });
    const { messages } = await req.json();
    const userPrompt = messages[messages.length - 1].content;

    // 1. 内部推理：Devil 模型生成初稿
    const { text: devilResponse } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `User Task: ${userPrompt}\n\nAs 'The Devil', provide a direct, high-speed solution.`,
    });

    // 2. 最终输出：Angel 模型结合 Devil 的内容进行总结
    // 我们手动在流的开头插入带标记的 Devil 内容
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        ...messages,
        { role: 'assistant', content: `[Devil's Proposal]: ${devilResponse}` },
        { role: 'system', content: "You are 'The Angel'. Summarize the final answer. Do not mention 'The Devil' or 'The Angel' titles in your output unless asked." }
      ],
    });

    // 注入特殊的前缀标签，方便前端识别
    const customStream = result.toTextStreamResponse();
    return new Response(
      new ReadableStream({
        async start(controller) {
          // 在流的最开始注入被标记的 Devil 思考过程
          const thoughtPayload = `__THOUGHT_START__${devilResponse}__THOUGHT_END__`;
          controller.enqueue(new TextEncoder().encode(thoughtPayload));
          
          const reader = customStream.body?.getReader();
          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          }
          controller.close();
        }
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}