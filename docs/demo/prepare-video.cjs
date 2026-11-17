const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const frames = JSON.parse(fs.readFileSync(path.join(root,'frames/manifest.json')));
const scenes = [
  [0, 0, 4.710, 'DharmaAI | Local book knowledge assistant'],
  [1, 1, 2.803, '1. Select an original sample PDF'],
  [2, 35, 7.513, '2. Extract text and index with local embeddings | wait shortened'],
  [36, 36, 1.500, '3. Book indexed locally | three searchable chunks'],
  [37, 37, 2.618, '4. Ask a question about the book'],
  [38, 75, 7.237, '5. Retrieve context and call Ollama | inference wait shortened'],
  [76, 181, 4.737, '6. A real generated answer grounded in the uploaded PDF'],
  [182, 227, 4.342, '7. Expand the retrieved source passages'],
  [228, 266, 3.540, '8. Spoken playback | verified by the project owner'],
  [267, 267, 2.500, '9. Try a question outside the book'],
  [268, 353, 4.763, '10. Unrelated question rejected without a generation call'],
  [355, frames.length-1, 7.026, 'Voice input and playback confirmed by the owner | controls shown'],
  [354, 354, 6.811, 'Recorded demo available independently of the optional local app'],
];
const stamp = (s, sep) => {
  const ms=Math.round(s*1000);
  return String(Math.floor(ms/3600000)).padStart(2,'0')+':'+String(Math.floor(ms/60000)%60).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+sep+String(ms%1000).padStart(3,'0');
};
let concat='ffconcat version 1.0\n', srt='', vtt='WEBVTT\n\n', time=0;
scenes.forEach(([start,end,duration,label],i)=>{
  for(let n=start;n<=end;n++) concat+=`file 'frames/${frames[n].filename}'\nduration ${(duration/(end-start+1)).toFixed(6)}\n`;
  srt+=`${i+1}\n${stamp(time,',')} --> ${stamp(time+duration,',')}\n${label}\n\n`;
  vtt+=`${stamp(time,'.')} --> ${stamp(time+duration,'.')}\n${label}\n\n`;
  time+=duration;
});
concat+=`file 'frames/${frames[frames.length-1].filename}'\n`;
fs.writeFileSync(path.join(root,'capture.ffconcat'),concat);
fs.writeFileSync(path.join(root,'captions.srt'),srt);
fs.writeFileSync(path.join(root,'../../public/demo/dharmaai-demo.vtt'),vtt);
fs.copyFileSync(path.join(root,'frames/'+frames[180].filename),path.join(root,'../../public/demo/dharmaai-answer.jpg'));
fs.copyFileSync(path.join(root,'frames/'+frames[227].filename),path.join(root,'../../public/demo/dharmaai-sources.jpg'));
console.log(`Prepared ${time.toFixed(2)}s edited browser capture. Owner confirmed voice; narration is separate.`);
