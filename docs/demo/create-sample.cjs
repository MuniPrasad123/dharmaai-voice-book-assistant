// Original, synthetic knowledge base for repeatable public demonstrations.
const fs = require('node:fs');
const path = require('node:path');
const lines = [
  'DharmaAI - Mahabharata Demo Knowledge Base',
  'Original educational summary prepared for this demonstration.',
  '',
  'The Pandavas',
  'The five Pandava brothers are Yudhishthira, Bhima, Arjuna, Nakula,',
  'and Sahadeva. Yudhishthira is the eldest and is associated with',
  'truth and justice. Bhima is known for strength. Arjuna is a skilled',
  'archer. Nakula and Sahadeva are the youngest brothers.',
  '',
  'Krishna and Arjuna',
  'Before the battle at Kurukshetra, Arjuna hesitates to fight his',
  'relatives and teachers. Krishna serves as his charioteer and guide.',
  'Krishna teaches Arjuna to act with responsibility and discipline,',
  'without becoming attached to the rewards of his actions. These',
  'teachings form the dialogue known as the Bhagavad Gita.',
  '',
  'Karna',
  'Karna is a gifted warrior and the son of Kunti. Raised by a',
  'charioteer family, he faces rejection because of his social status.',
  'Duryodhana offers him friendship and recognition. Karna remains',
  'loyal to Duryodhana despite learning his connection to the Pandavas.',
  'His conflict between loyalty, identity, and duty makes him tragic.',
  '',
  'The conflict and its lessons',
  'The war follows a struggle over the kingdom between the Pandavas',
  'and the Kauravas. The dice game, the humiliation of Draupadi, exile,',
  'and failed negotiations deepen the conflict. Draupadi challenges',
  'injustice and asks difficult questions about power and dignity.',
  'The epic explores duty, justice, loyalty, and the cost of ambition.',
  'It shows that moral choices can be difficult and have consequences.',
  '',
  'Scope of this knowledge base',
  'This short document covers only the characters and themes above.',
  'It contains no recipes, stock prices, or software installation advice.',
];
const escape = s => s.replace(/([\\()])/g, '\\$1');
const stream = 'BT /F1 12 Tf 50 790 Td 19 TL\n' + lines.map((s,i) => (i?'T* ':'')+'('+escape(s)+') Tj').join('\n') + '\nET';
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
];
let pdf = '%PDF-1.4\n'; const offsets = [0];
objects.forEach((o,i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i+1} 0 obj\n${o}\nendobj\n`; });
const start = Buffer.byteLength(pdf);
pdf += `xref\n0 6\n0000000000 65535 f \n` + offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('');
pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
const out = path.join(__dirname,'dharmaai-demo-knowledge.pdf');
fs.writeFileSync(out,pdf); console.log(out);
