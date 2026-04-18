import { pipeline } from "@huggingface/transformers";
import type {
    ProgressCallback,
    SummarizationPipeline,
} from "@huggingface/transformers";

let cachedPipeline: SummarizationPipeline | null = null;

const summarizeWithNN = async (text: string) => {
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

            const deviceDetection = () => {
                switch (true) {
                    case "ml" in navigator:
                        return 'webnn'
                    case "gpu" in navigator:
                        return 'webgpu'
                    default:
                        return 'wasm'
                }
            }

            const device = deviceDetection();

            cachedPipeline = await pipeline(
                "summarization",
                "Xenova/distilbart-cnn-6-6",
                {
                    device,
                    dtype: "fp32",
                    progress_callback: progressCallback,
                },
            );
        }

        const CHUNK_SIZE = 9280;
        const MAX_CHUNKS = Math.ceil(text.length / CHUNK_SIZE);
        const chunks: string[] = [];
        for (
            let i = 0;
            i < text.length && chunks.length < MAX_CHUNKS;
            i += CHUNK_SIZE
        ) {
            chunks.push(text.slice(i, i + CHUNK_SIZE));
        }

        for (let i = 0; i < chunks.length; i++) {
            self.postMessage({
                type: "progress",
                pct: Math.round(((i + 1) / chunks.length) * 100),
            });
            const result = await cachedPipeline(
                chunks[i],
                // { max_new_tokens: 150 },
            );
            const output = Array.isArray(result) ? result[0] : result;
            const generated = (output as { summary_text: string })
                .summary_text;

            self.postMessage({ type: "chunk", text: generated });
        }
    } catch {
        throw new Error('summarizeWithNN failed')
    }
}

self.addEventListener(
    "message",
    async (event: MessageEvent<{ text: string }>) => {
        const { text } = event.data;

        try {
            await summarizeWithNN(text);
            self.postMessage({ type: "done" });
        } catch (err) {
            self.postMessage({ type: "error", error: String(err) });
        }
    },
);
