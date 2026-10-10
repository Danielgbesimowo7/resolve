import { FACES } from '../faces'
import { Ic, Count, d } from './stage'

const Gem = ({ s }: { s: number }) => <i className="gx-logo" style={{ width: s, height: s, borderRadius: s * 0.24 }}><Ic id="h-gem" s={s * 0.62} c="#fff" /></i>
const Cursor = ({ x, y, s = 23 }: { x: number; y: number; s?: number }) => (
  <svg className="gx-cur" style={{ left: x, top: y, width: s, height: s }} viewBox="0 0 24 24"><path d="M5 3l14 8-6 2-2 6z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
)

const Agent = ({ s = 1, play, style }: { s?: number; play: boolean; style: React.CSSProperties }) => (
  <div className="gx-card a" style={{ padding: 18.84 * s, gap: 14.13 * s, borderRadius: 18.84 * s, ...style }}>
    <div className="gx-row" style={{ gap: 5.4 * s }}><Gem s={24.2 * s} /><span style={{ fontSize: 16.15 * s, color: '#222', fontWeight: 500 }}>AI agent</span></div>
    <p className="gx-p" style={{ fontSize: 18.84 * s, lineHeight: `${28.26 * s}px` }}>Your refund request has been received.<br />It typically takes 5-7 business days for<br />processing.</p>
    <div className="gx-conf" style={{ width: 360.32 * s, padding: `${18.84 * s}px ${9.42 * s}px`, gap: 9.42 * s, borderRadius: 18.84 * s }}>
      <i className="gx-ring" style={{ width: 42.6 * s, height: 42.6 * s }}><Ic id="h-gem" s={25.5 * s} c="#222" /></i>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 5.6 * s }}><b style={{ fontSize: 12.43 * s, color: '#222', fontWeight: 500 }}>AI confidence</b><b style={{ fontSize: 19.9 * s, color: '#a7a5a5', fontWeight: 500 }}><Count from={87} to={42} suf="%" run={play} delay={900} dur={1100} /></b></span>
    </div>
    <span className="gx-st" style={{ fontSize: 15.74 * s, padding: `${5.9 * s}px ${11.8 * s}px` }}>Needs attention</span>
  </div>
)
const Human = ({ s = 1, style }: { s?: number; style: React.CSSProperties }) => (
  <div className="gx-card a" style={{ padding: 18.93 * s, gap: 14.2 * s, borderRadius: 18.93 * s, ...style }}>
    <div className="gx-row" style={{ gap: 5.4 * s }}>
      <img src={FACES.daniel} width={42.6 * s} height={42.6 * s} alt="" style={{ borderRadius: '50%' }} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4.6 * s, width: 215 * s }}><b style={{ fontSize: 16.2 * s, color: '#222', fontWeight: 500 }}>Daniel Gbesimowo</b><span style={{ fontSize: 13.7 * s, color: '#7a7a7a' }}>Support agent</span></span>
    </div>
    <p className="gx-p" style={{ fontSize: 18.93 * s, lineHeight: `${28 * s}px` }}>Hi Maya, I can help with your refund request.<br />I have reviewed your account and I will take it from<br />here</p>
    <span className="gx-btn" style={{ width: 245 * s, height: 52 * s, fontSize: 16 * s }}>Take over conversation</span>
  </div>
)

/** How it works · Card 2 — exact Figma geometry (inner frame 1166 × 553) */
export function Intervene({ play }: { play: boolean }) {
  return (
    <div className={'gx' + (play ? ' play' : '')}>
      <svg className="gx-wire" viewBox="0 0 1166 553">
        <path d="M480 265 H613" stroke="#e4e4e4" strokeWidth="2" fill="none" />
        {[533, 538, 543].map(x => <path key={x} d={`M${x + 1} 259 L${x + 8} 265 L${x + 1} 271`} stroke="#01c88a" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      </svg>
      <Agent play={play} style={{ left: 80, top: 113, ...d(0.1) }} />
      <Human style={{ left: 611, top: 143, ...d(0.7) }} />
      <Cursor x={773} y={352} />
    </div>
  )
}

/** Features 4 — Human handoff (same two cards, smaller) */
export function Handoff({ play }: { play: boolean }) {
  return (
    <div className={'gx' + (play ? ' play' : '')}>
      <Agent s={0.7286} play={play} style={{ left: 358, top: 37, translate: '-50% 0', ...d(0.1) }} />
      <Human s={0.754} style={{ left: 355.3, top: 318, translate: '-50% 0', ...d(0.6) }} />
      <Cursor x={329} y={480} />
    </div>
  )
}

/** Features 2 — Knowledge improvement */
export function KnowFlow({ play }: { play: boolean }) {
  const qs: [string, string][] = [['riley', 'Can I cancel my annual subscription?'], ['jordan', 'What is the refund policy?'], ['maya', 'Can I get a refund on my annual plan?']]
  return (
    <div className={'gx' + (play ? ' play' : '')}>
      <svg className="gx-wire" viewBox="0 0 750 559">
        <g stroke="#e4e4e4" strokeWidth="1.6" fill="none"><path d="M192 258 V412 Q192 421 200 424 L279 453" /><path d="M588 246 V410 Q588 418 580 421 L499 453" /></g>
      </svg>
      <div className="gx-card a" style={{ left: 40, top: 42, width: 309.2, padding: 20.4, gap: 10.2, borderRadius: 9.7, ...d(0.1) }}>
        {qs.map(([f, q], i) => (
          <div key={q} className="gx-q" style={{ width: i === 2 ? 268.4 : '100%', padding: 9.7, gap: 11, borderRadius: 9.7, fontSize: 10.2 }}>
            <img src={FACES[f]} width={24.3} height={24.3} alt="" style={{ borderRadius: '50%' }} /><span>{q}</span><i style={{ width: 10.2, height: 10.2 }} />
          </div>
        ))}
        <span style={{ fontSize: 8.5, fontWeight: 500, color: '#7a7a7a' }}>+181 more conversations.</span>
      </div>
      <div className="gx-card a" style={{ left: 433, top: 42, padding: 16, gap: 16, borderRadius: 16, filter: 'none', ...d(0.5) }}>
        <div className="gx-row" style={{ gap: 4.6 }}><Gem s={15} /><span style={{ fontSize: 13.7, color: '#222', fontWeight: 500 }}>Suggested improvement</span></div>
        <div style={{ border: '.75px solid #eaeaea', borderRadius: 11.4, padding: 11.4 }}><p className="gx-p" style={{ fontSize: 12, width: 210, lineHeight: 'normal', whiteSpace: 'normal' }}>Add a clear section on refund policy for annual plans, with common examples</p></div>
        <span className="gx-btn" style={{ width: 237, height: 52, fontSize: 16 }}>Review improvement</span>
      </div>
      <Cursor x={619} y={206} />
      <div className="gx-card a" style={{ left: 278, top: 309, width: 220, padding: 20.1, gap: 13.4, borderRadius: 9.56, alignItems: 'center', ...d(0.9) }}>
        <b style={{ fontSize: 13.4, fontWeight: 500, color: '#000', textAlign: 'center', whiteSpace: 'normal' }}>Refund policy for annual plans</b>
        <div style={{ position: 'relative', width: 88.75, height: 88.75 }}>
          <svg viewBox="0 0 106 106" width="88.75" height="88.75"><circle cx="53" cy="53" r="45" fill="none" stroke="#e2e2e2" strokeWidth="16" /><circle className="gx-arc" cx="53" cy="53" r="45" fill="none" stroke="#01c88a" strokeWidth="16" strokeLinecap="round" pathLength="100" strokeDasharray="61 100" transform="rotate(-90 53 53)" /></svg>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3.4 }}><b style={{ fontSize: 13.65, fontWeight: 500, color: '#000' }}><Count to={61} suf="%" run={play} delay={900} dur={1100} /></b><span style={{ fontSize: 6.8, color: '#222', fontWeight: 500 }}>Resolution rate</span></span>
        </div>
        <span className="gx-st" style={{ fontSize: 13.19, padding: '4.9px 9.9px' }}>Recurring knowledge gap</span>
      </div>
    </div>
  )
}

/** Features 3 — Conversation intelligence */
export function Intel({ play }: { play: boolean }) {
  const rows: [string, string, string, string, string, string][] = [['riley', 'Anabel Higgfi', 'Refund request', 'Billing', 'red', '42%'], ['jordan', 'John Leroy', 'Password reset', 'Account', 'green', '96%'], ['maya', 'Maya chen', 'Plan upgrade', 'Billing', 'green', '91%']]
  return (
    <div className={'gx' + (play ? ' play' : '')}>
      <div className="gx-card gx-center a" style={{ width: 544.4, padding: 24, gap: 16, borderRadius: 24, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,.04))', ...d(0.1) }}>
        <div className="gx-row" style={{ justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>Conversations</span>
          <span className="gx-row" style={{ gap: 10 }}>{['All intents', 'Newest'].map(t => <span key={t} className="gx-sel">{t}<svg viewBox="0 0 24 24" width="15.6" height="15.6" fill="none" stroke="#7a7a7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></span>)}</span>
        </div>
        {rows.map(([f, n, a, b, k, pc], i) => (
          <div key={n} className="gx-conv a" style={d(0.3 + i * 0.2)}>
            <div className="gx-row" style={{ alignItems: 'flex-start', gap: 8 }}>
              <img src={FACES[f]} width={28.5} height={28.5} alt="" style={{ borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: 128 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12 }}><b style={{ fontWeight: 500, color: '#000' }}>{n}</b><span style={{ color: '#7a7a7a', whiteSpace: 'pre' }}>{a}  {b}</span></div>
                <span className={'gx-pill ' + k}>{k === 'red' ? 'Needs attention' : 'Resolved'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 20, color: '#000', fontWeight: 500 }}>{i === 0 ? <Count from={87} to={42} suf="%" run={play} delay={900} dur={1000} /> : pc}</span><span style={{ fontSize: 12, color: '#7a7a7a' }}>AI confidence</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Features 5 — Customer context */
export function Context({ play }: { play: boolean }) {
  const rows: [string, string, string][] = [['Refund Request', 'Today', 'red'], ['Billing question', 'Yesterday', 'green'], ['Cancel subscription', 'Sept 25', 'green']]
  return (
    <div className={'gx' + (play ? ' play' : '')}>
      <div className="gx-card gx-center a" style={{ width: 481, padding: 19.7, gap: 45.5, borderRadius: 27, filter: 'drop-shadow(0 35px 23px rgba(0,0,0,.04))', ...d(0.1) }}>
        <div className="gx-row" style={{ gap: 14.8 }}>
          <img src={FACES.maya} width={56.3} height={56.3} alt="" style={{ borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4.9, fontSize: 19.7 }}><span style={{ color: '#222', fontWeight: 500 }}>Maya Chen</span><span style={{ color: '#7a7a7a' }}>Maya@acme.com</span></div>
        </div>
        <div style={{ width: '100%', border: '.98px solid #eaeaea', borderRadius: 7.84, display: 'flex', flexDirection: 'column', gap: 15.7, boxSizing: 'border-box' }}>
          <div style={{ background: '#f7f7f7', padding: 15.7, borderRadius: 7.84, fontSize: 17.64, fontWeight: 500, color: '#222' }}>Recent conversations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 23.5, padding: '0 15.7px 15.7px' }}>
            {rows.map(([t, w, k], i) => (
              <div key={t} className="gx-row a" style={{ justifyContent: 'space-between', alignItems: 'flex-start', ...d(0.4 + i * 0.2) }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7.84, fontSize: 15.68 }}><span style={{ color: '#222', fontWeight: 500 }}>{t}</span><span style={{ color: '#7a7a7a' }}>{w}</span></div>
                <span className={'gx-pill big ' + k}>{k === 'red' ? 'Needs attention' : 'Resolved'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** How it works · Card 3 */
export function Improve({ play }: { play: boolean }) {
  const qs: [string, string, number][] = [['maya', 'Can I cancel my annual subscription?', 363 - 48], ['jordan', 'What is the refund policy?', 363 - 48], ['riley', 'Can I get a refund on my annual plan?', 315]]
  return (
    <div className={'gx' + (play ? ' play' : '')}>
      <svg className="gx-wire" viewBox="0 0 1166 553">
        <g stroke="#e8e8e8" strokeWidth="1.6" fill="none">
          <path d="M395 194 C455 194 455 257 513 257" /><path d="M395 319 C455 319 455 257 513 257" /><path d="M395 257 H513" /><path d="M777 257 H858" />
        </g>
      </svg>
      <div className="gx-card a" style={{ left: 34, top: 143, width: 363, padding: 24, gap: 12, borderRadius: 11.4, ...d(0.1) }}>
        {qs.map(([f, q, w], i) => (
          <div key={q} className="gx-q" style={{ width: i === 2 ? 315 : '100%' }}>
            <img src={FACES[f]} width={28.5} height={28.5} alt="" style={{ borderRadius: '50%' }} /><span>{q}</span><i />
          </div>
        ))}
        <span style={{ fontSize: 10, fontWeight: 500, color: '#7a7a7a' }}>+181 more conversations.</span>
      </div>
      <div className="gx-card a" style={{ left: 515, top: 140, width: 264, padding: 24, gap: 16, borderRadius: 11.4, alignItems: 'center', ...d(0.5) }}>
        <b style={{ fontSize: 16, fontWeight: 500, color: '#000', textAlign: 'center' }}>Refund policy for annual plans</b>
        <div style={{ position: 'relative', width: 105.9, height: 105.9 }}>
          <svg viewBox="0 0 106 106" width="106" height="106"><circle cx="53" cy="53" r="45" fill="none" stroke="#e2e2e2" strokeWidth="16" />
            <circle className="gx-arc" cx="53" cy="53" r="45" fill="none" stroke="#01c88a" strokeWidth="16" strokeLinecap="round" pathLength="100" strokeDasharray="61 100" transform="rotate(-90 53 53)" /></svg>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}><b style={{ fontSize: 16.3, fontWeight: 500, color: '#000' }}><Count to={61} suf="%" run={play} delay={700} dur={1100} /></b><span style={{ fontSize: 8.1, color: '#222', fontWeight: 500 }}>Resolution rate</span></span>
        </div>
        <span className="gx-st" style={{ fontSize: 15.74, padding: '5.9px 11.8px' }}>Recurring knowledge gap</span>
      </div>
      <div className="gx-card a" style={{ left: 860, top: 159, width: 281.9, height: 212, padding: 16.77, gap: 16.77, borderRadius: 16.77, boxShadow: 'none', filter: 'none', ...d(1) }}>
        <div className="gx-row" style={{ gap: 4.8 }}><Gem s={15.7} /><span style={{ fontSize: 14.37, color: '#222', fontWeight: 500 }}>Suggested improvement</span></div>
        <div style={{ border: '.78px solid #eaeaea', borderRadius: 11.95, padding: 11.95 }}><p className="gx-p" style={{ fontSize: 12.6, width: 220, lineHeight: 'normal' }}>Add a clear section on refund policy for annual plans, with common examples</p></div>
        <span className="gx-btn" style={{ width: 248.4, height: 54.5, fontSize: 16.77 }}>Review improvement</span>
      </div>
      <Cursor x={1054.9} y={330.9} s={24} />
    </div>
  )
}
