// Focused update of the owner's existing portfolio; preserves unrelated content.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.argv[2] || '');
if(root !== path.resolve('D:/Workspace/portfolio/muni-prasad-portfolio')) throw new Error('Unexpected portfolio target');
const changes=[];
function replace(file, before, after) {
  const p=path.join(root,file); const pending=changes.find(([name])=>name===p); const content=pending?.[1] || fs.readFileSync(p,'utf8');
  if(content.includes(after)) return;
  if(!content.includes(before)) throw new Error('Expected content missing: '+file);
  if(pending) pending[1]=content.replace(before,after);
  else changes.push([p,content.replace(before,after)]);
}
replace('src/data/site.ts',
  "Built a voice-based book assistant using OpenAI file retrieval and speech-to-text / text-to-speech. A custom RAG pipeline and agent-based features are roadmap items.",
  "Built a PDF knowledge assistant with a custom RAG pipeline, local Ollama embeddings and inference, source inspection, and browser voice interaction.");
replace('src/data/profile.ts',
  'DharmaAI combines OpenAI file-based retrieval with speech-to-text and text-to-speech for a voice-based book assistant.',
  'DharmaAI combines a custom local RAG pipeline, Ollama models, and browser voice features for a book knowledge assistant.');
replace('src/data/profile.ts',
  "{ title: 'DharmaAI', category: 'Independent application', problemStatement: 'Make knowledge from uploaded books easier to explore through voice.', role: 'Designed and built a voice-based book knowledge assistant using OpenAI file-based retrieval, speech-to-text, and text-to-speech. Custom retrieval and agent-based capabilities are future roadmap work.', outcome: 'Grounded answers use uploaded book content through OpenAI retrieval.', techStack: ['OpenAI APIs', 'File retrieval', 'Speech-to-text', 'Text-to-speech'], image: '/assets/project-admin.svg' }",
  "{ title: 'DharmaAI', category: 'Independent application', problemStatement: 'Explore an uploaded book through grounded answers, visible sources, and voice interaction.', role: 'Designed and built the Next.js interface, PDF extraction, overlapping text chunking, local embeddings, cosine-similarity retrieval, and Ollama answer generation, with browser voice input and playback.', outcome: 'Demonstrated PDF indexing, a correct document-grounded answer, source inspection, and rejection of an unrelated question. Voice features were verified by the project owner.', techStack: ['Next.js', 'TypeScript', 'Ollama', 'Custom RAG', 'PDF.js', 'Web Speech API'], image: '/assets/project-admin.svg' }");
replace('src/data/engineering.ts',
  "dharmaai: { decisions: ['Use OpenAI file-based retrieval to ground answers in uploaded book content.', 'Connect speech-to-text and text-to-speech around the question-and-answer workflow.'], lesson: 'Custom RAG infrastructure and agent-based features are roadmap work. The current description covers file retrieval and voice interaction.', evidence: 'Independent application documented in the supplied resume. No production usage figures are claimed.' }",
  "dharmaai: { decisions: ['Extract PDF text, split overlapping chunks, and generate local embeddings with nomic-embed-text.', 'Retrieve up to five passages using cosine similarity and generate answers with llama3.2:3b through Ollama.', 'Store vectors as local JSON files and reject questions below a 0.40 similarity threshold.'], validation: 'A real local session on 17 November 2026 verified PDF upload, three-chunk indexing, a correct answer naming the five Pandavas, source display, and unrelated-question rejection. The owner confirmed voice input and playback. These observations are not production benchmarks.', lesson: 'Local inference keeps the document pipeline independent of a hosted model API. A static recorded demonstration lets visitors inspect the project when the optional live app is offline.', evidence: 'Reviewed implementation and recorded browser session from the public DharmaAI repository. The sample PDF is an original educational summary. No production usage figures are claimed.' }");
replace('src/components/site/ProjectDetails.tsx',
  "voice: { title: 'Simplified voice and retrieval workflow', steps: ['Spoken question', 'Speech-to-text', 'OpenAI file retrieval', 'Text-to-speech answer'] }",
  "voice: { title: 'Local retrieval and voice workflow', steps: ['PDF text and chunks', 'Ollama embeddings', 'Cosine-similarity retrieval', 'Ollama answer and sources', 'Browser voice input and playback'] }");
replace('src/app/(frontend)/portfolio/[slug]/page.tsx',
  "import { ProjectDetails } from '@/components/site/ProjectDetails'",
  "import { ProjectDetails } from '@/components/site/ProjectDetails'\nimport { DharmaShowcase } from '@/components/site/DharmaShowcase'");
// This file has two changes; compose them in memory before applying.
const page=path.join(root,'src/app/(frontend)/portfolio/[slug]/page.tsx');
let content=changes.find(([p])=>p===page)?.[1] || fs.readFileSync(page,'utf8');
if(!content.includes("{slug==='dharmaai'&&<DharmaShowcase/>}")) {
  content=content.replace('<div className="article-body case-study">', '<div className="article-body case-study">\n      {slug===\'dharmaai\'&&<DharmaShowcase/>}');
  content=content.replace("<p>A public repository or demo link has not been provided for this project.</p>", "slug==='dharmaai'?<p><a href=\"https://github.com/MuniPrasad123/dharmaai-voice-book-assistant\">Public source code and recorded demonstration</a> are available above.</p>:<p>A public repository or demo link has not been provided for this project.</p>");
}
// Apply only after every expected source replacement has been checked.
for(const [p,c] of changes) if(p!==page) fs.writeFileSync(p,c);
fs.writeFileSync(page,content);
fs.copyFileSync(path.join(__dirname,'DharmaShowcase.tsx'),path.join(root,'src/components/site/DharmaShowcase.tsx'));
const dest=path.join(root,'public/demo/dharmaai'); fs.mkdirSync(dest,{recursive:true});
for(const name of ['dharmaai-demo.mp4','dharmaai-demo.vtt','dharmaai-narration.vtt','dharmaai-upload.jpg','dharmaai-answer.jpg','dharmaai-sources.jpg']) fs.copyFileSync(path.join(__dirname,'../../public/demo',name),path.join(dest,name));
fs.copyFileSync(path.join(__dirname,'dharmaai-demo-knowledge.pdf'),path.join(dest,'dharmaai-demo-knowledge.pdf'));
console.log('Updated /portfolio/dharmaai with reviewed content and static demonstration assets.');
