import { FACES } from '../faces'
import { Ic, Count, Type, d } from './stage'

const Av = ({ k, s = 22 }: { k: string; s?: number }) => <img className="vav" src={FACES[k]} width={s} height={s} alt="" />
const Tag = ({ t, kind = 'red' }: { t: string; kind?: 'red' | 'green' | 'blue' }) => <span className={'vtag ' + kind}>{t}</span>

const SPARK = [
  'M0 22 C10 20 14 12 24 14 S38 8 48 10 S62 4 72 2',
  'M0 24 C8 18 16 20 26 14 S42 12 52 8 S64 6 72 2',
  'M0 6 C10 8 16 14 26 12 S40 20 50 18 S64 26 72 24',
  'M0 24 C10 22 16 16 26 18 S42 8 52 12 S64 4 72 3',
  'M0 26 C10 20 18 22 28 16 S44 14 54 10 S66 8 72 4',
]
const ROWS: [string, string, string, string, string, boolean][] = [
  ['maya', 'Billing', '2,842', '184', '6.2%', true],
  ['alex', 'Account', '3,124', '182', '4.8%', true],
  ['jordan', 'Refund', '1,284', '97', '8.2%', false],
  ['taylor', 'Technicals', '2,482', '86', '3.1%', true],
  ['casey', 'General', '1,068', '73', '5.7%', true],
]

/** The AI performance dashboard window, 868px wide (design pixels). */
export function AiPerf({ play, sidebar = false, wide }: { play: boolean; sidebar?: boolean; wide?: number }) {
  const kpis: [string, string, number, number, string, string, string][] = [
    ['h-gem', 'AI resolution rate', 84.6, 1, '%', '6.3%', 'up'],
    ['h-scale', 'Escalations rate', 15.4, 1, '%', '6.3%', 'up'],
    ['h-check', 'Average confidence', 87, 0, '%', '4.2%', 'up'],
    ['h-clock', 'Average response time', 42, 0, 's', '28%', 'up'],
  ]
  return (
    <div className={'vwin' + (play ? ' play' : '')} style={{ width: sidebar ? (wide ?? 868) : 700, height: sidebar ? 574 : undefined }}>
      {sidebar && (
        <aside className="vside">
          <b>Resolve</b>
          {['Dashboard', 'Conversations', 'AI performance', 'Knowledge', 'Customers', 'Analytics', 'Settings'].map(n => <span key={n} className={n === 'AI performance' ? 'on' : ''}>{n}</span>)}
        </aside>
      )}
      <div className="vmain">
        <div className="vtop">
          <b>AI perfomance</b>
          <span className="vsearch"><Ic id="h-search" s={10} /> Search anything<i><Ic id="h-cmd" s={9} /></i><i>K</i></span>
          <span className="vbell"><Ic id="h-bell" s={12} /><u /></span>
          <span className="vuser"><Av k="daniel" s={18} /><span>Daniel Gbesimowo<small>Support manager</small></span><Ic id="h-down" s={9} /></span>
        </div>
        <div className="vsub"><span>Monitor and manage conversation. Take over when the AI needs help</span><span className="vdate"><Ic id="h-cal" s={10} /> Last 7 days <Ic id="h-down" s={9} /></span></div>
        <div className="vkpis">
          {kpis.map(([ic, l, n, dec, suf, dl], i) => (
            <div key={l} className="vkpi a" style={d(0.15 + i * 0.12)}>
              <div className="vkh"><Ic id={ic} s={11} />{l}</div>
              <div className="vkb"><strong><Count to={n} dec={dec} suf={suf} run={play} delay={300 + i * 120} /></strong><span><em>↑ {dl}</em> vs. previous 7 days</span></div>
            </div>
          ))}
        </div>
        <div className="vgrid">
          <div className="vcard">
            <b className="vct">Performance by intent</b>
            <div className="vtbl">
              <div className="vth"><span>Intent</span><span>Conversations</span><span>Resolution rate</span><span>Trend</span></div>
              <div className="vscroll">
                {ROWS.concat(ROWS).map(([f, n, c, r, t, up], i) => (
                  <div key={i} className={'vtr a' + (n === 'Refund' ? ' hot' : '')} style={d(0.5 + (i % 5) * 0.1)}>
                    <span><Av k={f} s={20} />{n}</span><span>{c}</span><span>{r}</span>
                    <span className={up ? 'up' : 'dn'}>{up ? '↑' : '↓'} {t}</span>
                    <svg viewBox="0 0 72 30" className="vspark"><path className={'ln ' + (up ? '' : 'red')} d={SPARK[up ? i % 2 + (i % 5 === 3 ? 2 : 0) : 2]} /></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="vside2">
            <div className="vcard">
              <b className="vct">Conversation outcomes</b>
              <div className="vout">
                <svg viewBox="0 0 120 120" width="104" height="104">
                  <circle className="dn0" cx="60" cy="60" r="48" pathLength="100" strokeDasharray="84.6 100" transform="rotate(-90 60 60)" />
                  <circle className="dn1" cx="60" cy="60" r="48" pathLength="100" strokeDasharray="11.9 100" strokeDashoffset="-84.6" transform="rotate(-90 60 60)" />
                  <circle className="dn2" cx="60" cy="60" r="48" pathLength="100" strokeDasharray="3.5 100" strokeDashoffset="-96.5" transform="rotate(-90 60 60)" />
                  <text x="60" y="60" textAnchor="middle" fontSize="17" fontWeight="500">12,482</text>
                  <text x="60" y="74" textAnchor="middle" fontSize="7.5">Total conv.</text>
                </svg>
                <ul><li><i style={{ background: '#01c88a' }} />AI resolved<small>84.6% (10,551)</small></li><li><i style={{ background: '#3b82f6' }} />Human<small>11.9% (1,446)</small></li><li><i style={{ background: '#f5b800' }} />Unresolved<small>3.5% (445)</small></li></ul>
              </div>
              <div className="vins a" style={d(1.2)}><b>AI resolution rate increased by 6.3%</b><small>Your AI is performing better than last week</small></div>
            </div>
            <div className="vcard">
              <b className="vct">Underperforming intents</b>
              <div className="vup"><span>Refund requests</span><em className="dn">↓ 8.2%</em><small>72% resolution rates</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Step 2 — Intervene */
export function Intervene({ play }: { play: boolean }) {
  return (
    <div className={'vint' + (play ? ' play' : '')}>
      <svg className="vwire" viewBox="0 0 1152 548">
        <path className="ln a" style={d(0.1)} d="M250 76 V344 H278" />
        <path className="ln a g" style={d(4.3)} d="M508 344 H534" />
      </svg>
      <div className="vagent a" style={d(0.1)}><i className="vlogo"><Ic id="h-gem" s={12} c="#fff" /></i> AI agent</div>
      <div className="vbub big a" style={d(0.4)}><span><Type text="Your refund request has been received…" run={play} delay={800} speed={34} /></span><i className="sk" /><i className="sk s" /></div>
      <div className="vconf a" style={d(2.4)}>
        <div className="vch"><i className="vcirc"><Ic id="h-gem" s={22} /></i><span>AI confidence<strong className="red"><Count from={87} to={42} suf="%" run={play} delay={2600} dur={1000} /></strong></span></div>
        <Tag t="Needs attention" />
      </div>
      <div className="vwho a" style={d(4.5)}><Av k="daniel" s={46} /><span>Daniel Gbesimowo<small>Support agent</small></span></div>
      <div className="vbub small a" style={d(5)}><span><Type text="…I’ll take over from here" run={play} delay={5300} speed={42} /></span></div>
    </div>
  )
}

/** Step 3 — Improve */
export function Improve({ play }: { play: boolean }) {
  const qs: [string, string][] = [['maya', 'Can I get a refund on my annual plan?'], ['alex', 'What is the refund policy?'], ['jordan', 'Can I cancel my annual subscription?']]
  return (
    <div className={'vimp' + (play ? ' play' : '')}>
      <svg className="vwire" viewBox="0 0 1152 548">
        {[170, 250, 330].map((y, i) => <path key={y} className="ln dash a" style={d(0.9 + i * 0.15)} d={`M520 ${y} H560 Q580 ${y} 580 ${y + (274 - y) * 0.25} V274 H640`} />)}
        <path className="ln dash a g" style={d(2.4)} d="M820 378 V416" />
      </svg>
      <div className="vqs">
        {qs.map(([f, q], i) => <div key={q} className="vq a" style={d(0.2 + i * 0.18)}><Av k={f} s={36} /><span>{q}</span></div>)}
        <small className="a" style={d(0.8)}>+181 more</small>
      </div>
      <div className="vkb2 a" style={d(1.6)}>
        <i className="vcirc g"><Ic id="h-lib" s={26} c="#fff" /></i>
        <b>Update knowledge base</b>
        <small><Count to={184} run={play} delay={1700} dur={900} /> conversations share this gap</small>
      </div>
      <div className="vdone a" style={d(3)}><Ic id="h-check" s={16} c="#01c88a" /> Knowledge base updated<em>AI resolution rate <b>↑ <Count from={84.6} to={91.2} dec={1} suf="%" run={play} delay={3300} dur={1400} /></b></em></div>
    </div>
  )
}

/** Features 2 — Knowledge improvement */
export function KnowFlow({ play }: { play: boolean }) {
  const qs: [string, string, boolean][] = [['maya', 'Can I get a refund on my annual plan?', false], ['alex', 'What is the refund policy?', true], ['jordan', 'Can I cancel my annual subscription?', false]]
  return (
    <div className={'vflow' + (play ? ' play' : '')}>
      <svg className="vwire" viewBox="0 0 758 567">
        {[0, 1, 2].map(i => <path key={i} className="ln dash a g" style={d(0.9 + i * 0.12)} d={`M262 ${207 + i * 76} H277 V283 H292`} />)}
        <path className="ln dash a g" style={d(2.1)} d="M452 283 H520 V330" />
        <circle r="4.5" className="dot"><animateMotion dur="2.6s" begin="1s" repeatCount="indefinite" path="M262 283 H292" /></circle>
        <circle r="4.5" className="dot"><animateMotion dur="2.6s" begin="2.4s" repeatCount="indefinite" path="M452 283 H520 V330" /></circle>
      </svg>
      <div className="vpanel a" style={d(0.1)}>
        <b>Conversations</b>
        {qs.map(([f, q, hi], i) => <div key={q} className={'vq sm' + (hi ? ' hi' : '')} style={d(0.3 + i * 0.12)}><Av k={f} s={30} /><span>{q}</span></div>)}
        <small>+181 more</small>
      </div>
      <div className="vgap a" style={d(1.5)}>
        <i className="vcirc g"><Ic id="h-lib" s={22} c="#fff" /></i>
        <b>Refund policy for annual plans</b>
        <small><Count to={184} run={play} delay={1700} dur={900} /> conversations</small>
        <Tag t="Recurring knowledge gap" />
      </div>
      <div className="vsug a" style={d(2.3)}>
        <div className="vagent"><i className="vlogo"><Ic id="h-gem" s={12} c="#fff" /></i> AI agent</div>
        <small>Suggested improvement</small>
        <p><Type text="Add a clear section on refund policy for annual plans, with common examples" run={play} delay={2700} speed={26} /></p>
        <span className="vbtn">Review improvement</span>
      </div>
    </div>
  )
}

/** Features 3 — Conversation intelligence */
export function Intel({ play }: { play: boolean }) {
  const rows: [string, string, string, string, string, 'red' | 'green' | 'blue'][] = [
    ['maya', 'Maya Chen', 'Refund request', 'I was charged twice for my…', 'Needs attention', 'red'],
    ['alex', 'Alex Morgan', 'Password reset', 'I can’t log into my account', 'Resolved', 'green'],
    ['jordan', 'Jordan Lee', 'Account locked', 'My account has been locked', 'Human', 'blue'],
    ['taylor', 'Taylor Kim', 'Refund request', 'I’d like to request a refund of', 'Needs attention', 'red'],
    ['casey', 'Casey Brown', 'App crashing', 'The app keeps crashing on', 'Resolved', 'green'],
  ]
  return (
    <div className={'vintel' + (play ? ' play' : '')}>
      <div className="vconv">
        <b className="vct">Conversations</b>
        <div className="vth"><span>Customer</span><span>Issue</span><span>Status</span></div>
        {rows.map(([f, n, i1, i2, st, k], i) => (
          <div key={n} className={'vtr a r' + i} style={d(0.15 + i * 0.1)}>
            <span><Av k={f} s={22} /><span>{n}<small>{n.split(' ')[0].toLowerCase()}@acme.com</small></span></span>
            <span><b>{i1}</b><small>{i2}</small></span>
            <span><Tag t={st} kind={k} /></span>
          </div>
        ))}
        <i className="vscan" />
      </div>
      <div className="vwhy a" style={d(2)}>
        <b><Ic id="h-gem" s={13} c="#01c88a" /> Why it escalated</b>
        <p><span>Intent</span><Type text="Refund request" run={play} delay={2300} speed={30} /></p>
        <p><span>Sentiment</span><Type text="Frustrated" run={play} delay={2900} speed={30} /></p>
        <p><span>Cause</span><Type text="Charged twice after upgrade" run={play} delay={3400} speed={26} /></p>
      </div>
    </div>
  )
}

/** Features 4 — Human handoff */
export function Handoff({ play }: { play: boolean }) {
  return (
    <div className={'vhand' + (play ? ' play' : '')}>
      <div className="vhc">
        <div className="vhh">
          <i className="vcirc"><Ic id="h-gem" s={30} /></i>
          <span>AI confidence<strong className="red"><Count from={87} to={42} suf="%" run={play} delay={500} dur={1200} /></strong></span>
          <Tag t="Needs attention" />
        </div>
        <div className="vhb">
          <p>Customer needs help with a refund request</p>
          <span className="vbtn lg"><span className="t1">Take over conversation</span><span className="t2"><Ic id="h-check" s={18} c="#fff" /> You’re in this conversation</span></span>
        </div>
      </div>
      <svg className="vcursor" viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" /></svg>
    </div>
  )
}

/** Features 5 — Customer context */
export function Context({ play }: { play: boolean }) {
  const rs: [string, string, string, 'red' | 'green'][] = [['Refund Request', 'Today', 'Needs attention', 'red'], ['Billing question', 'Yesterday', 'Resolved', 'green'], ['Cancel subscription', 'Sept 25', 'Resolved', 'green'], ['Password reset', 'Sept 12', 'Resolved', 'green']]
  return (
    <div className={'vctx' + (play ? ' play' : '')}>
      <div className="vcc">
        <div className="vcp a" style={d(0.1)}><Av k="maya" s={58} /><span>Maya Chen<small>Maya@acme.com</small></span></div>
        <div className="vrc">
          <b className="a" style={d(0.5)}>Recent conversations</b>
          {rs.map(([t, w, s, k], i) => <div key={t} className="vrr a" style={d(0.8 + i * 0.35)}><span>{t}<small>{w}</small></span><Tag t={s} kind={k} /></div>)}
        </div>
      </div>
    </div>
  )
}
