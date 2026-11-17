'use client'

import { useEffect, useState } from 'react'
import { FileUp, FileText, Scissors, Cpu, Database, Mic, Search, ShieldCheck, Layers, MessageSquare, Volume2, ArrowRight, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import flows from './dharma-flow.json'
import styles from './DharmaArchitecture.module.css'

const icons = [[FileUp, FileText, Scissors, Cpu, Database], [Mic, Cpu, Search, Layers, MessageSquare, Volume2], [MessageSquare, Search, ShieldCheck, FileText]]
const repo = 'https://github.com/MuniPrasad123/dharmaai-voice-book-assistant/blob/main/'

export function DharmaArchitecture() {
  const [scenario, setScenario] = useState(0)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [sitePaused, setSitePaused] = useState(false)
  const flow = flows[scenario]
  const active = flow.steps[step]
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduced(query.matches); if (query.matches) setPlaying(false) }
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const update = () => { const paused=document.documentElement.classList.contains('studio-motion-paused'); setSitePaused(paused); if(paused)setPlaying(false) }
    update()
    const observer=new MutationObserver(update)
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!playing || reduced || sitePaused) return
    const timer = window.setInterval(() => setStep(value => (value + 1) % flow.steps.length), 3200)
    return () => window.clearInterval(timer)
  }, [playing, reduced, sitePaused, flow.steps.length])
  const move = (delta: number) => { setPlaying(false); setStep(value => (value + delta + flow.steps.length) % flow.steps.length) }
  return <section className={styles.shell} id="dharma-architecture" aria-labelledby="dharma-architecture-title" data-playing={playing && !reduced}>
    <div className={styles.top}><div><span className={styles.kicker}>Inside the implementation</span><h3 id="dharma-architecture-title">How a book becomes a grounded answer</h3></div><span className={styles.badge}>Explanatory replay · no live requests</span></div>
    <p className={styles.intro}>Retrieval-augmented generation first finds passages from the book, then supplies them to the language model. Follow the actual code paths below.</p>
    <div className={styles.tabs} role="group" aria-label="Choose architecture flow">{flows.map((item,index)=><button key={item.id} type="button" aria-pressed={scenario===index} onClick={()=>{setScenario(index);setStep(0);setPlaying(false)}}>{item.label}</button>)}</div>
    <div className={styles.toolbar}><code>{flow.endpoint}</code><div className={styles.controls}>
      <button type="button" disabled={reduced || sitePaused} onClick={()=>setPlaying(value=>!value)} aria-label={playing?'Pause architecture animation':'Play architecture animation'}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pause':'Play'}</button>
      <button type="button" aria-label="Previous architecture step" onClick={()=>move(-1)}><ChevronLeft size={17}/></button>
      <button type="button" aria-label="Next architecture step" onClick={()=>move(1)}><ChevronRight size={17}/></button>
      <button type="button" aria-label="Reset architecture flow" onClick={()=>{setStep(0);setPlaying(false)}}><RotateCcw size={15}/></button>
    </div></div>
    {reduced&&<p className={styles.note}>Reduced motion is enabled. Use the step controls to explore.</p>}
    {sitePaused&&!reduced&&<p className={styles.note}>Site animations are paused. Step controls remain available.</p>}
    <div className={styles.layout}>
      <div className={styles.diagram} aria-label="Architecture steps">{flow.steps.map((item,index)=>{
        const Icon=icons[scenario][index]
        return <div className={styles.nodeWrap} key={item.title}><button type="button" className={styles.node} data-active={step===index} data-done={index<step} aria-current={step===index?'step':undefined} onClick={()=>{setStep(index);setPlaying(false)}}><span className={styles.icon}><Icon size={22}/></span><span><small>0{index+1}</small><strong>{item.title}</strong><em>{item.tag}</em></span>{step===index&&<span className={styles.signal} aria-hidden="true"/>}</button>{index<flow.steps.length-1&&<span className={styles.connector} data-active={step===index} aria-hidden="true"><ArrowRight size={16}/><i/></span>}</div>
      })}</div>
      <div className={styles.explanation} aria-live={playing?'off':'polite'}>
        <span className={styles.kicker}>Step {step+1} of {flow.steps.length}</span><h4>{active.title}</h4><p>{active.detail}</p><div className={styles.payload}><span>Data at this step</span><code>{active.payload}</code></div><a href={repo+active.source} target="_blank" rel="noreferrer">Read the implementation ↗<small>{active.source}</small></a>
        <div className={styles.progress} aria-label={`Step ${step+1} of ${flow.steps.length}`}>{flow.steps.map((s,i)=><span key={s.title} data-filled={i<=step}/>)}</div>
      </div>
    </div>
    <div className={styles.facts}><span><strong>800 / 150</strong>characters / overlap</span><span><strong>nomic-embed-text</strong>local embedding model</span><span><strong>Top 5 · 0.40</strong>retrieval cap / threshold</span><span><strong>llama3.2:3b</strong>local answer model</span></div>
    <p className={styles.note}>Model names are configurable. The current prototype uses JSON storage, non-streaming answers, and no server-side conversation history. Authentication, OCR, a vector database, and streaming are not implemented here.</p>
    <div className={styles.links}><a href="/demo/dharmaai/dharmaai-architecture.gif" download>Download animated infographic (GIF) ↓</a><a href={repo+'README.md'} target="_blank" rel="noreferrer">README & architecture ↗</a></div>
  </section>
}
