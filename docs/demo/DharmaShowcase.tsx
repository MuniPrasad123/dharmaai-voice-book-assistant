import Image from 'next/image'
import { DharmaTechStack } from './DharmaTechStack'
import { DharmaArchitecture } from './DharmaArchitecture'

export function DharmaShowcase() {
  return <section className="detail-block" aria-labelledby="dharma-demo-title">
    <div className="eyebrow">Applied AI · Working demonstration</div>
    <h2 id="dharma-demo-title">From a PDF to an answer you can inspect</h2>
    <p>Watch a real local session: upload a book, ask a question, inspect its sources, and see how the assistant handles a question outside the document.</p>
    <video controls playsInline preload="metadata" poster="/demo/dharmaai/dharmaai-upload.jpg" style={{width:'100%',borderRadius:14,background:'#030712'}} aria-label="DharmaAI narrated demonstration">
      <source src="/demo/dharmaai/dharmaai-demo.mp4" type="video/mp4" />
      <track kind="captions" src="/demo/dharmaai/dharmaai-narration.vtt" srcLang="en" label="English narration" />
      Your browser does not support video. <a href="/demo/dharmaai/dharmaai-demo.mp4">Download the demonstration</a>.
    </video>
    <p style={{fontSize:14}}>One-minute edited browser capture with Indian English male narration. Processing waits are shortened. The sample PDF is an original educational summary, not a complete edition of the Mahabharata. Narration is separate from the app’s speech output.</p>
    <p><a className="text-link" href="https://github.com/MuniPrasad123/dharmaai-voice-book-assistant" target="_blank" rel="noreferrer">Explore the source code ↗</a>{' · '}<a className="text-link" href="/demo/dharmaai/dharmaai-demo-knowledge.pdf">Read the sample PDF ↗</a></p>
    <DharmaTechStack/>
    <DharmaArchitecture/>
    <h3>What the session demonstrates</h3>
    <ul className="case-decisions">
      <li>PDF extraction and local embedding generation produced three searchable chunks.</li>
      <li>The generated answer correctly identified all five Pandava brothers; the source passages are visible.</li>
      <li>An unrelated recipe question returned a no-relevant-information response.</li>
      <li>Voice input and spoken playback were tested successfully by the project owner. The capture shows their controls.</li>
    </ul>
    <figure style={{margin:'24px 0'}}>
      <Image src="/demo/dharmaai/dharmaai-sources.jpg" alt="DharmaAI showing the retrieved book passages used to answer the question" width={1265} height={712} style={{width:'100%',height:'auto',borderRadius:14}} />
      <figcaption>Retrieved passages make the answer easier to check against the book.</figcaption>
    </figure>
    <h3>Design choices and boundaries</h3>
    <p>Ollama runs both the embedding and answer models locally. Overlapping text chunks and cosine similarity keep retrieval understandable; JSON files keep the prototype’s storage simple. A similarity threshold rejects low-scoring questions, but it is a heuristic rather than a guarantee of correctness.</p>
    <p>The recorded demonstration is available independently of the local app. Live demonstrations can be arranged through the contact page. Browser voice recognition may depend on a browser vendor’s online service.</p>
  </section>
}
