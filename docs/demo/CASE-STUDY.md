# DharmaAI: explore a book through grounded answers

Reading a long PDF to answer one question interrupts learning. DharmaAI lets a reader upload a book, ask a question, and inspect the passages used to generate the answer. Browser speech recognition and speech synthesis add voice interaction.

## What I built

A Next.js and TypeScript application with a custom retrieval-augmented generation pipeline. PDF.js extracts text, overlapping chunks preserve nearby context, and Ollama's nomic-embed-text model turns chunks into vectors. A local JSON store keeps these vectors on disk. For each question, cosine similarity retrieves up to five chunks; llama3.2:3b generates an answer using that context. Queries scoring below 0.40 return a no-relevant-information response without calling the generation model.

## Demonstration

The edited browser capture uses an original, synthetic one-page Mahabharata summary created for the demonstration. It is not a complete or authoritative edition. The capture shows actual PDF indexing, a generated answer, retrieved sources, unrelated-question rejection, and voice controls. Waiting periods are shortened. Narration is explanatory audio, not a recording of the app's speech output.

The project owner confirmed that microphone input and spoken playback both worked in their browser. The automated browser captured the controls but did not independently verify audible output or spoken transcription.

## Evidence from 17 November 2026

| Check | Observed result |
| --- | --- |
| PDF upload and extraction | Passed; sample indexed into three chunks |
| Grounded question | Correctly named Yudhishthira, Bhima, Arjuna, Nakula, and Sahadeva |
| Sources | Retrieved passages expanded in the browser |
| Unrelated question | Cake recipe question returned no relevant information; highest similarity 0.3666 |
| Local processing | Upload request took about 16.3 seconds; first question about 54 seconds on this PC |
| Rejection | About 239 milliseconds for this single request |
| Voice | Input and playback confirmed by the owner; controls captured |

These are individual demonstration observations, not performance benchmarks or production guarantees. A similarity threshold is a heuristic and does not guarantee that every unsupported question is rejected.

## Hosting without an always-on AI server

The case study, MP4, captions, and screenshots are static assets suitable for the existing portfolio deployment. They remain viewable without Ollama. Keep the interactive app optional; its local server and model must be running for live access. Do not link visitors to localhost or expose the Ollama service directly.

The document pipeline uses local inference. Browser speech recognition may use a browser vendor's online service; do not claim that every voice feature is fully offline.

## Assets

The case study also includes a repository-based interactive architecture with indexing, question-answering, and low-score rejection flows. Each step explains its payload and links to the implementation. Play, pause, previous, next, reset, site-wide pause, and reduced-motion support keep the explanation accessible. A 15-frame GIF export is available for sharing.

- `public/demo/dharmaai-demo.mp4`: captioned, edited browser capture.
- `public/demo/dharmaai-demo.vtt`: accessible captions.
- `public/demo/dharmaai-upload.jpg`: opening view.
- `public/demo/dharmaai-answer.jpg`: grounded answer.
- `public/demo/dharmaai-sources.jpg`: retrieved passages.
- `public/demo/dharmaai-architecture.gif`: animated technical infographic.
- `docs/demo/dharmaai-demo-knowledge.pdf`: original demo document.

Repository: https://github.com/MuniPrasad123/dharmaai-voice-book-assistant

Suggested portfolio route: `/portfolio/dharmaai`, matching the portfolio's existing case-study routes. `/projects/dharmaai` can be an alias later. No paid hosting service is needed for these static assets.
