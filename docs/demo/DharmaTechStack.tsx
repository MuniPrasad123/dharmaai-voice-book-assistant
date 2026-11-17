'use client'

import { useState } from 'react'
import { PanelsTopLeft, Atom, Braces, Palette, Server, Cpu, Network, FileText, Database, Search, Mic, Volume2 } from 'lucide-react'
import styles from './DharmaTechStack.module.css'

const stack = [
  {name:'Next.js 16',layer:'Application framework',icon:PanelsTopLeft,detail:'App Router serves the book interface and two server routes: POST /api/upload-book and POST /api/chat.',code:'app/page.tsx'},
  {name:'React 19',layer:'Interface & state',icon:Atom,detail:'React components manage the selected book, upload progress, visible chat messages, source expansion, and audio controls. Chat history is held in browser component state.',code:'components/ChatWindow.tsx'},
  {name:'TypeScript',layer:'Shared data contracts',icon:Braces,detail:'Shared interfaces describe each chunk, document store, chat message, upload response, and answer with source passages.',code:'lib/types.ts'},
  {name:'Tailwind CSS 4',layer:'Responsive presentation',icon:Palette,detail:'Utility classes style the responsive dark interface, upload state, chat bubbles, and focus states.',code:'app/globals.css'},
  {name:'Next.js API routes',layer:'Server processing',icon:Server,detail:'The upload route validates and indexes a PDF. The chat route loads the book index, ranks chunks, checks relevance, and calls the local model.',code:'app/api/chat/route.ts'},
  {name:'Ollama · llama3.2:3b',layer:'Answer generation',icon:Cpu,detail:'The configured local chat model receives the current question and retrieved context in a non-streaming request. The prompt asks it to stay within the book context.',code:'app/api/chat/route.ts'},
  {name:'nomic-embed-text',layer:'Semantic embeddings',icon:Network,detail:'Ollama converts both book chunks and questions into numerical vectors with the same model. Chunk embeddings are generated as a batch during upload.',code:'app/api/upload-book/route.ts'},
  {name:'PDF.js · pdfjs-dist',layer:'PDF text extraction',icon:FileText,detail:'The implementation directly imports PDF.js to read text from every page. pdf-parse is installed, but the extraction helper uses pdfjs-dist directly. Scanned pages require OCR, which is not implemented.',code:'lib/pdf-extract.ts'},
  {name:'Local JSON files',layer:'Vector storage',icon:Database,detail:'data/books/{bookId}.json stores the original filename, chunk text, and embedding vectors. This prototype does not use an external vector database.',code:'lib/types.ts'},
  {name:'Cosine similarity',layer:'Retrieval & relevance',icon:Search,detail:'Custom TypeScript ranks every chunk against the question vector, selects up to five passages, and skips answer generation if the best score is below 0.40.',code:'app/api/chat/route.ts'},
  {name:'SpeechRecognition',layer:'Voice input',icon:Mic,detail:'The browser transcribes one spoken phrase into the question input. Availability depends on the browser; recognition may use a vendor service. The current recognition language is en-US.',code:'components/VoiceRecorder.tsx'},
  {name:'SpeechSynthesis',layer:'Voice output',icon:Volume2,detail:'The browser reads an answer using an available English voice. The app can start or stop playback. The portfolio video’s Indian English male narration is a separate recording.',code:'components/AudioPlayer.tsx'},
]

export function DharmaTechStack(){
  const [selected,setSelected]=useState(0)
  const item=stack[selected]
  const ActiveIcon=item.icon
  return <section className={styles.section} aria-labelledby="dharma-stack-title">
    <h3 id="dharma-stack-title">Explore the technology stack</h3>
    <p>Choose an icon to see where the technology fits and how this project uses it.</p>
    <div className={styles.grid} role="group" aria-label="DharmaAI technologies">{stack.map((tech,index)=>{const Icon=tech.icon;return <button key={tech.name} type="button" aria-pressed={selected===index} aria-controls="dharma-tech-detail" title={tech.layer} onClick={()=>setSelected(index)}><Icon size={19} aria-hidden="true"/><span>{tech.name}</span></button>})}</div>
    <div className={styles.detail} id="dharma-tech-detail" aria-live="polite"><ActiveIcon size={28} aria-hidden="true"/><div><span>{item.layer}</span><h4>{item.name}</h4><p>{item.detail}</p><a href={'https://github.com/MuniPrasad123/dharmaai-voice-book-assistant/blob/main/'+item.code} target="_blank" rel="noreferrer">See {item.code} ↗</a></div></div>
  </section>
}
