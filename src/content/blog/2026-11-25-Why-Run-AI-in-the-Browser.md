---
title: Why Run AI in the Browser?
pubDate: 2026/11/25 9:20
author: "Valerio Como"
tags:
  - webai
  - ai
  - browser
  - javascript
imgUrl: '../../assets/blog/2026-11-25-why-run-ai-in-the-browser/cover.png'
description: Benefits, limits and the tech stack behind running AI models directly in the browser. The map for the Web AI series.
---

Most AI features on the web work the same way: the page sends your text to a server, a model runs in a data center, and the answer comes back. The model can also run on the user's device, inside the browser tab. This post explains why you would want that, what it costs, and which technologies make it possible.

*This post is part 0 of the series "Web AI – LLMs in the Browser".*

### A real example: this blog

If you open a post on this blog, you can ask for an AI summary. No server is involved. The page first tries Chrome's built-in Summarizer API. If the browser doesn't have it, a Web Worker loads a small summarization model with Transformers.js and picks the best backend available:

```js
const device =
  "ml" in navigator ? "webnn" :
  "gpu" in navigator ? "webgpu" :
  "wasm";
```

That fallback chain covers most of this series: a browser API, a library and three runtimes.

### Why bother

- **Privacy**: The text never leaves the device. That matters for drafts, notes, health or legal data, and for apps with end-to-end encryption.
- **Latency**: No network round trip. Once the model is loaded, short tasks feel instant.
- **Cost**: Inference runs on the user's hardware, so you don't pay per request.
- **Offline**: After the first download, the feature keeps working without a connection.

### The catch

Running models on the client moves the cost from your servers to your users' devices.

- **Model size**: A model has to be downloaded and cached before the first use. That takes bandwidth, time and disk space. Chrome, for example, asks for at least 22 GB of free space before downloading its built-in model.
- **Hardware variety**: Your users don't share one GPU. Chrome's built-in model needs more than 4 GB of VRAM, or 16 GB of RAM and 4 CPU cores. Many phones and older laptops don't qualify.
- **Browser support**: Capabilities differ between browsers, so you still need a fallback, often a server.
- **Small models**: What fits on a laptop is good at focused tasks (summaries, classification, translation, embeddings), less so at long reasoning or long contexts.
- **Eviction**: The browser or the OS can delete an on-device model at any time. Your app has to handle that.

### The stack, layer by layer

Think of Web AI as four layers. Each part of the series zooms into one of them.

- **Browser APIs**: The browser ships the model. Chrome's built-in AI APIs (Prompt, Summarizer, Writer, Translator and others) use Gemini Nano or smaller expert models. You call a JavaScript API and nothing else.
- **Libraries**: You bring the model. Transformers.js runs Hugging Face models in the ONNX format. WebLLM runs chat LLMs and exposes an OpenAI-style API.
- **Runtimes**: This is where the math happens. WebAssembly runs on the CPU and works everywhere. WebGPU uses the GPU and has been supported in Chrome, Edge, Firefox and Safari since late 2025. WebNN targets CPUs, GPUs and NPUs through the operating system's ML APIs. It is still experimental: Chrome and Edge started an origin trial in version 146.
- **Hardware**: CPU, GPU and, on newer machines, NPU, a chip designed for neural network workloads.

### A minimal glossary

- **Inference**: Running a trained model on new input to get an output. This series only covers inference.
- **Token**: The unit of text a language model reads and writes, usually a word or part of a word.
- **Quantization**: Storing weights with fewer bits (for example 8 or 4 instead of 32). Models get smaller and faster at a small cost in quality.
- **ONNX**: An open format for models. You can export from PyTorch or TensorFlow and run the result in the browser with ONNX Runtime Web.

### What's next

- Part 1: Built-in AI APIs
- Part 2: Transformers.js
- Part 3: WebLLM
- Part 4: WebGPU
- Part 5: WebAssembly
- Part 6: WebNN
- Part 7: choosing a stack and shipping to production

Client-side AI trades server cost for download size and hardware uncertainty. It is a good fit for focused, frequent, privacy-sensitive tasks, as long as you plan a fallback.

### Sources

- [The client-side AI stack – web.dev](https://web.dev/learn/ai/client-side)
- [Get started with built-in AI – Chrome for Developers](https://developer.chrome.com/docs/ai/get-started)
- [Understand built-in model management in Chrome](https://developer.chrome.com/docs/ai/understand-built-in-model-management)
- [WebGPU is now supported in major browsers – web.dev](https://web.dev/blog/webgpu-supported-major-browsers)
- [Chrome 146 beta – WebNN origin trial](https://developer.chrome.com/blog/chrome-146-beta)
- [Transformers.js documentation](https://huggingface.co/docs/transformers.js)
- [WebLLM: A High-Performance In-Browser LLM Inference Engine](https://arxiv.org/abs/2412.15803)
