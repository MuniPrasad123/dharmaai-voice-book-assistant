const fs=require('node:fs'); const path=require('node:path');
const sharp=require('D:/Workspace/portfolio/muni-prasad-portfolio/node_modules/sharp');
const flows=require('./dharma-flow.json');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const wrap=(s,n)=>{const out=[];let line='';for(const word of s.split(' ')){if((line+' '+word).trim().length>n){out.push(line);line=word}else line=(line+' '+word).trim()}if(line)out.push(line);return out};
const text=(x,y,s,size=18,color='#b0c3d2',weight=400)=>`<text x="${x}" y="${y}" fill="${color}" font-family="Arial" font-size="${size}" font-weight="${weight}">${escape(s)}</text>`;
(async()=>{
 const dir=path.join(__dirname,'gif-frames');fs.mkdirSync(dir,{recursive:true});let count=0;
 for(const flow of flows) for(let active=0;active<flow.steps.length;active++) {
  const item=flow.steps[active];let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#102137"/><stop offset="1" stop-color="#0b1729"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/>`;
  svg+=text(42,48,'DHARMA AI / TECHNICAL ARCHITECTURE',15,'#75dfbb',700)+text(42,94,flow.label,34,'#ecf4fa',700)+text(42,128,flow.endpoint,18,'#d8bc7a')+text(850,48,'EXPLANATORY REPLAY',13,'#d8bc7a');
  flow.steps.forEach((s,i)=>{const y=166+i*81;const on=i===active;svg+=`<rect x="42" y="${y}" width="490" height="66" rx="10" fill="${on?'#133d3d':'#0a192a'}" stroke="${on?'#70e2bb':'#28445b'}" stroke-width="${on?2:1}"/>`+text(58,y+25,String(i+1).padStart(2,'0'),14,'#e7c67e',700)+text(98,y+26,s.title,19,'#ecf4fa',700)+text(98,y+48,s.tag,13);if(on)svg+=`<circle cx="512" cy="${y+14}" r="4" fill="#75e5bb"/>`;if(i<flow.steps.length-1)svg+=`<path d="M285 ${y+67} v11 m-4 -4 l4 4 4 -4" fill="none" stroke="#75b5a8"/>`;});
  svg+=`<rect x="564" y="166" width="594" height="480" rx="14" fill="#0a192a" stroke="#28445b"/>`+text(588,202,`STEP ${active+1} OF ${flow.steps.length}`,13,'#75dfbb',700)+text(588,244,item.title,25,'#f0d18f',700);
  wrap(item.detail,56).forEach((line,i)=>svg+=text(588,285+i*29,line,18));
  svg+=text(588,508,'DATA AT THIS STEP',12,'#83a7bc',700);wrap(item.payload,57).forEach((line,i)=>svg+=text(588,539+i*25,line,16,'#a9ebd5'));
  svg+=text(588,612,item.source,13,'#d8bc7a');
  svg+=`<path d="M42 676 H1158" stroke="#28445b"/>`;
  [['800 / 150','characters / overlap'],['nomic-embed-text','embedding model'],['Top 5 / 0.40','retrieval cap / threshold'],['llama3.2:3b','answer model']].forEach(([a,b],i)=>{svg+=text(42+i*290,714,a,20,'#f0d18f',700)+text(42+i*290,741,b,14)});
  svg+=text(42,778,'Source: repository API routes and README. Animation does not issue live model requests.',13)+' </svg>';
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir,`frame-${String(count++).padStart(3,'0')}.png`));
 }
 console.log(`Rendered ${count} architecture frames.`);
})().catch(e=>{console.error(e);process.exitCode=1});
