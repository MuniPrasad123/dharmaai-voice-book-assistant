const fs=require('node:fs');const path=require('node:path');
const target='D:/Workspace/portfolio/muni-prasad-portfolio';
for(const file of ['DharmaArchitecture.tsx','DharmaArchitecture.module.css','dharma-flow.json','DharmaTechStack.tsx','DharmaTechStack.module.css'])fs.copyFileSync(path.join(__dirname,file),path.join(target,'src/components/site',file));
for(const root of [path.join(target,'src/components/site'),__dirname]){
 const p=path.join(root,'DharmaShowcase.tsx');let s=fs.readFileSync(p,'utf8');
 if(!s.includes("import { DharmaArchitecture }"))s=s.replace("import Image from 'next/image'","import Image from 'next/image'\nimport { DharmaArchitecture } from './DharmaArchitecture'");
 if(!s.includes('<DharmaArchitecture/>'))s=s.replace('    <h3>What the session demonstrates</h3>','    <DharmaArchitecture/>\n    <h3>What the session demonstrates</h3>');
 if(!s.includes("import { DharmaTechStack }"))s=s.replace("import Image from 'next/image'","import Image from 'next/image'\nimport { DharmaTechStack } from './DharmaTechStack'");
 if(!s.includes('<DharmaTechStack/>'))s=s.replace('    <DharmaArchitecture/>','    <DharmaTechStack/>\n    <DharmaArchitecture/>');
 fs.writeFileSync(p,s);
}
fs.copyFileSync(path.join(__dirname,'../../public/demo/dharmaai-architecture.gif'),path.join(target,'public/demo/dharmaai/dharmaai-architecture.gif'));
console.log('Installed the interactive architecture and animated GIF.');
