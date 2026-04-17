import { pipeline } from "@huggingface/transformers";
import type { ProgressCallback } from "@huggingface/transformers";

type PipelineInstance = Awaited<ReturnType<typeof pipeline>>;

let cachedPipeline: PipelineInstance | null = null;

self.addEventListener(
    "message",
    async (event: MessageEvent<{ text: string }>) => {
        const { text } = event.data;

        try {
            if (!cachedPipeline) {
                const progressCallback: ProgressCallback = (info) => {
                    if (info.status === "progress" && info.progress != null) {
                        self.postMessage({
                            type: "progress",
                            pct: Math.round(info.progress),
                        });
                    }
                };

                const device = "ml" in navigator ? "webnn" : "wasm";

                cachedPipeline = await pipeline(
                    "text2text-generation",
                    "Xenova/t5-small",
                    {
                        device,
                        dtype: "fp32",
                        progress_callback: progressCallback,
                    },
                );
            }

            const CHUNK_SIZE = 1000;
            const MAX_CHUNKS = Math.ceil(text.length / CHUNK_SIZE);
            const chunks: string[] = [];
            for (
                let i = 0;
                i < text.length && chunks.length < MAX_CHUNKS;
                i += CHUNK_SIZE
            ) {
                chunks.push(text.slice(i, i + CHUNK_SIZE));
            }

            const parts: string[] = [];
            for (let i = 0; i < chunks.length; i++) {
                self.postMessage({
                    type: "progress",
                    pct: Math.round(((i + 1) / chunks.length) * 100),
                });
                const result = await cachedPipeline(
                    "summarize: " + chunks[i],
                    { max_new_tokens: 150 },
                );
                const output = Array.isArray(result) ? result[0] : result;
                const generated = (output as { generated_text: string })
                    .generated_text;
                if (generated) parts.push(generated);
            }

            self.postMessage({ type: "result", summary: parts.join(" ") });
        } catch (err) {
            self.postMessage({ type: "error", error: String(err) });
        }
    },
);
