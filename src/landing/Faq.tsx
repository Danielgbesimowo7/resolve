import { useState } from 'react'

const QA = [
  ['What is Resolve?', 'Resolve is an AI customer support operations platform that helps monitor AI conversations, intervene when necessary and continous improve their support system.'],
  ['How does resolve improve AI support?', 'Resolve surfaces recurring issues and knowledge gaps from real conversations, then helps your team turn them into better answers and a stronger knowledge base.'],
  ['Does Resolve replace human support agents?', 'No. Resolve helps teams understand where AI can handle conversations independently and where human judgment is needed.'],
  ['Can teams see individual conversations?', 'Yes. Every conversation is available with its full context, status and the agent that handled it, so teams can review or step in at any time.'],
  ['Who is resolve for?', 'Support, CX and AI operations teams that use AI to handle customer conversations and want visibility and control over them.'],
]

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="sec" id="faq" style={{ textAlign: 'left' }}>
      <div className="fq">
        <div className="fl">
          <div className="pillb"><i className="dot"></i>FAQS</div>
          <h2 className="tw" data-t="Frequently asked|*questions*" style={{ textAlign: 'left', margin: '24px 0 0' }}></h2>
          <p className="lead reveal" style={{ margin: '24px 0 32px', maxWidth: 521, textAlign: 'left' }}>Here’s everything you need to know to get started.</p>
          <div className="help reveal">
            <p>Can’t find the question you are looking for?</p>
            <a className="btn dark" href="mailto:hello@resolve.app">Send us a mail</a>
          </div>
        </div>
        <div className="fr">
          {QA.map(([q, a], i) => (
            <div key={q} className={'fi' + (open === i ? ' open' : '')}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span>
                <i className="fchev"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></i>
              </button>
              <div className="fa"><div><p>{a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
