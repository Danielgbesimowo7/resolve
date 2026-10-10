import { useState } from 'react'
import { Stage, useInView } from './stage'
import { AiPerf } from './shots'
import { KnowFlow, Intel, Handoff, Context } from './cards'

const FEATS = [
  { t: 'AI performance', d: 'Track how your AI performs across every conversation' },
  { t: 'Knowledge improvement', d: 'Turn recurring problems into better answers.' },
  { t: 'Conversation intelligence', d: 'Understand what happened, and why' },
  { t: 'Human handoff', d: 'Step in when AI reaches its limits' },
  { t: 'Customer context', d: 'See the customer behind every conversation' },
]
export default function Features() {
  const [i, setI] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [ref, on] = useInView<HTMLDivElement>(0.3)
  const pick = (n: number) => { setI(n); setCycle(c => c + 1) }


  return (
    <section className="sec feat" id="features">
      <div className="pillb"><i className="dot"></i>Powerful by Design</div>
      <h2 className="tw" data-t="*Everything* your team needs to|operate AI support"></h2>
      <p className="lead reveal">From monitoring conversations to improving the knowledge, Resolve brings the entire AI support operation into one workspace.</p>
      <div className="vfeat" ref={ref}>
        <ul className="vlist" role="tablist" aria-orientation="vertical">
          {FEATS.map((f, n) => (
            <li key={f.t} className={n === i ? 'on' : ''}>
              <button role="tab" aria-selected={n === i} onClick={e => { pick(n); e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }) }}>
                <strong><i />{f.t}</strong>
                <span>{f.d}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="vshow">
          <div className="vfr">
            <Stage w={746} h={555} minK={0.6} box={[0, 0, 746, 555]}>
              <div className="vslide" key={`${i}-${cycle}`}>
                {i === 0 && <div className="vpos" style={{ left: 10, top: 46 }}><AiPerf play={on} /></div>}
                {i === 1 && <KnowFlow play={on} />}
                {i === 2 && <Intel play={on} />}
                {i === 3 && <Handoff play={on} />}
                {i === 4 && <Context play={on} />}
              </div>
            </Stage>
          </div>
          <div className="vcap" aria-live="polite"><b>{FEATS[i].t}</b><p>{FEATS[i].d}</p></div>
        </div>
      </div>
    </section>
  )
}
