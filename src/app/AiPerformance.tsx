import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight02Icon, ArrowUp02Icon, Clock01Icon, GoogleGeminiIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { buckets, intentStats, smooth, summary } from './metrics'
import { Avatar, CircleCheckBig, Icon, Scale3d, StatCards, useNarrow, useWidth } from './ui'
import { Donut, RangePicker } from './Dashboard'

const FACE: Record<string, string> = { Billing: 'maya', Account: 'alex', Refund: 'jordan', Technicals: 'taylor', General: 'casey' }
const REL: Record<string, string> = { Billing: 'billing', Account: 'account', Refund: 'refund', Technicals: 'technical', General: 'general' }
const QUERY: Record<string, string> = { Refund: 'refund', Technicals: 'technical', General: 'feature' }
const COL = { g: '#01c88a', p: '#6155f5', b: '#338cf6' }

export function Spark({ values, down }: { values: number[]; down?: boolean }) {
  const lo = Math.min(...values), hi = Math.max(...values, lo + 1), w = 139.5, h = 41
  const pts = values.map((v, i) => [(i * w) / (values.length - 1), h - 4 - ((v - lo) / (hi - lo)) * (h - 10)] as const)
  const d = smooth(pts), c = down ? '#fb2239' : '#01c88a', id = `sp${down ? 'd' : 'u'}${Math.round(values[0])}`
  return (
    <svg width={w} height={h + 3} viewBox={`0 0 ${w} ${h + 3}`} aria-hidden="true">
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={c} stopOpacity={down ? 0.35 : 0.22} /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d}L${w} ${h}L0 ${h}Z`} fill={`url(#${id})`} /><path d={d} fill="none" stroke={c} strokeWidth="2" />
    </svg>
  )
}

function Over({ data }: { data: ReturnType<typeof buckets> }) {
  const narrow = useNarrow()
  const W = 770, X0 = narrow ? 10 : 50, PW = W - X0 - 6, Y0 = 6, H = 202
  const x = (i: number) => X0 + (i * PW) / (data.length - 1), y = (v: number) => Y0 + H - (v / 100) * H
  const series = [{ k: 'g', v: data.map(d => d.rate) }, { k: 'p', v: data.map(d => d.esc + 60) }, { k: 'b', v: data.map(d => d.conf * 0.35) }] as const
  const [hover, setHover] = useState<number | null>(null)
  const active = hover ?? Math.round((data.length - 1) * 0.57)
  const [wref, cw] = useWidth<HTMLDivElement>()
  const ax = x(active), tw = 186, px = (ax / W) * cw, flip = cw > 0 && px + 22 + tw > cw - 4
  const tipTop = Math.max(0, Math.min(y(Math.min(100, data[active].rate)), y(Math.min(100, data[active].esc + 60))) - 20)
  return (
    <div ref={wref} className="rs-chartw" style={{ height: 250 }} onPointerLeave={() => setHover(null)} onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W; setHover(data.reduce((b, _, i) => (Math.abs(x(i) - px) < Math.abs(x(b) - px) ? i : b), 0)) }}>
      {[0, 25, 50, 75, 100].map(t => <span key={t} className="rs-yl" style={{ top: y(t) }}>{t}</span>)}
      <svg viewBox={`0 0 ${W} 250`} preserveAspectRatio="none">
        <defs>{(['g', 'p', 'b'] as const).map(k => <linearGradient key={k} id={`ov${k}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={COL[k]} stopOpacity={k === 'g' ? 0.1 : 0.18} /><stop offset="1" stopColor={COL[k]} stopOpacity="0" /></linearGradient>)}</defs>
        {[0, 25, 50, 75, 100].map(t => <line key={t} x1={X0} x2={W} y1={y(t)} y2={y(t)} stroke="#eef0f0" />)}
        {data.map((_, i) => <line key={i} x1={x(i)} x2={x(i)} y1={Y0} y2={Y0 + H} stroke="#f1f3f3" />)}
        <line x1={ax} x2={ax} y1={Y0} y2={Y0 + H} stroke="#555" strokeDasharray="3 3" />
        {series.map(s => { const pts = s.v.map((v, i) => [x(i), y(Math.min(100, Math.max(0, v)))] as const), d = smooth(pts); return <g key={s.k}><path d={`${d}L${x(data.length - 1)} ${Y0 + H}L${x(0)} ${Y0 + H}Z`} fill={`url(#ov${s.k})`} /><path d={d} fill="none" stroke={COL[s.k]} strokeWidth="2" />{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === active ? 7.5 : 6} fill={COL[s.k]} />)}</g> })}
      </svg>
      {data.map((d, i) => <span key={i} className="rs-xl" style={{ left: `${(x(i) / W) * 100}%` }}>{d.label}</span>)}
      <div className="rs-tip multi" style={{ left: `calc(${(ax / W) * 100}% ${flip ? `- ${tw + 22}px` : '+ 22px'})`, top: tipTop }}>
        <span>{data[active].label}</span>
        <b><i className="d" style={{ background: COL.g }} />Resolution <em>{Math.round(data[active].rate)}%</em></b>
        <b><i className="d" style={{ background: COL.p }} />Escalation <em>{Math.round(data[active].esc)}%</em></b>
        <b><i className="d" style={{ background: COL.b }} />Confidence <em>{Math.round(data[active].conf)}%</em></b>
        <i className={flip ? 'r' : 'l'} />
      </div>
    </div>
  )
}

export function IntentCard({ intents, compact }: { intents: ReturnType<typeof intentStats>; compact?: boolean }) {
  return (
    <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div className="rs-ttl">Performance by intent</div>
      <div className="rs-tbl rs-scroll">
        <div className="rs-tr rs-th rs-cI"><span>Intent</span><span>Conversations</span><span>Resolution rate</span><span>Trend</span></div>
        {intents.map(i => (
          <Link key={i.group} className={`rs-tr rs-cI ${compact ? '' : 'tall'}`} to={`/app/conversations?q=${QUERY[i.group] ?? REL[i.group]}`}>
            <span className="rs-cu"><Avatar c={{ name: i.group, avatar: FACE[i.group] }} size={40} /><b>{i.group}</b></span>
            <span className="rs-plain">{i.count.toLocaleString()}</span><span className="rs-plain">{i.rate.toFixed(1)}%</span>
            <span className="rs-trend"><span className={`rs-delta ${i.delta >= 0 ? '' : 'bad'}`}><Icon icon={ArrowUp02Icon} size={24} className={i.delta < 0 ? 'flip' : ''} />{Math.abs(i.delta).toFixed(1)}%</span><Spark values={i.spark} down={i.delta < 0} /></span>
          </Link>))}
      </div>
    </div>
  )
}

export default function AiPerformance() {
  const { conversations, state } = useStore()
  const days = state.range
  const cur = useMemo(() => summary(conversations, days), [conversations, days])
  const prev = useMemo(() => summary(conversations, days, 1), [conversations, days])
  const intents = useMemo(() => intentStats(conversations, days), [conversations, days])
  const data = useMemo(() => buckets(conversations, days), [conversations, days])
  const worst = [...intents].filter(i => i.count > 0).sort((a, b) => a.rate - b.rate).slice(0, 3)
  const d = cur.aiRate - prev.aiRate, rel = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0)
  const pc = (n: number) => (cur.total ? (n / cur.total) * 100 : 0)
  return (
    <div className="rs-page">
      <div className="rs-head sub"><p>Monitor and manage conversation. Take over when the AI needs help</p><div className="rs-head-r"><RangePicker /></div></div>
      <StatCards range={days} items={[
        { icon: <Icon icon={GoogleGeminiIcon} size={24} />, label: 'AI resolution rate', value: `${cur.aiRate.toFixed(1)}%`, delta: rel(cur.aiRate, prev.aiRate) },
        { icon: <Scale3d />, label: 'Escalations rate', value: `${cur.escRate.toFixed(1)}%`, delta: rel(cur.escRate, prev.escRate), invert: true },
        { icon: <CircleCheckBig />, label: 'Average confidence', value: `${Math.round(cur.confidence)}%`, delta: rel(cur.confidence, prev.confidence) },
        { icon: <Icon icon={Clock01Icon} size={24} />, label: 'Average response time', value: `${Math.round(cur.resp)}s`, delta: rel(cur.resp, prev.resp), invert: true },
      ]} />
      <div className="rs-ai">
        <div className="rs-aiL">
          <IntentCard intents={intents} />
          <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="rs-between" style={{ alignItems: 'flex-end' }}><div className="rs-ttl">AI agent performance overtime.</div>
              <div className="rs-key">{([['Resolution rate', COL.g], ['Escalation rate', COL.p], ['Confidence', COL.b]] as const).map(([l, c]) => <span key={l}><i style={{ background: c }} />{l}</span>)}</div></div>
            <Over data={data} />
          </div>
        </div>
        <div className="rs-aiR">
          <div className="rs-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="rs-ttl">Conversation outcomes</div>
            <div className="rs-donut-w" style={{ marginTop: 0 }}>
              <div className="rs-donut"><Donut segs={[{ v: cur.ai, c: '#01c88a' }, { v: cur.human, c: '#338cf6' }, { v: cur.unresolved, c: '#f6bd16' }]} /><div className="rs-donut-c"><b>{cur.total.toLocaleString()}</b><span>Total conv.</span></div></div>
              <ul className="rs-legend" style={{ gap: 36 }}>{[['AI resolved', '#01c88a', cur.ai], ['Human', '#338cf6', cur.human], ['Unresolved', '#f6bd16', cur.unresolved]].map(([l, c, n]) => <li key={l as string}><div><i style={{ background: c as string }} />{l}</div><span>{pc(n as number).toFixed(1)}% <small>({(n as number).toLocaleString()})</small></span></li>)}</ul>
            </div>
            <div className="rs-insight"><b>AI resolution rate {d >= 0 ? 'increased' : 'decreased'} by {Math.abs(d).toFixed(1)}%</b><span>Your AI is performing {d >= 0 ? 'better' : 'worse'} than {days === 7 ? 'last week' : `the previous ${days} days`}</span></div>
          </div>
          <div className="rs-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="rs-ttl">Underperforming intents</div>
            {worst.map(w => (
              <div className="rs-under" key={w.group}>
                <div className="rs-between" style={{ alignItems: 'flex-start' }}><div><b>{w.group === 'Refund' ? 'Refund requests' : w.group === 'Technicals' ? 'Technical issues' : w.group === 'General' ? 'General inquiries' : w.group}</b><span>{Math.round(w.rate)}% resolution rates</span></div>
                  <span className={`rs-delta ${w.delta >= 0 ? '' : 'bad'}`}><Icon icon={ArrowUp02Icon} size={24} className={w.delta < 0 ? 'flip' : ''} />{Math.abs(w.delta).toFixed(1)}%</span></div>
                <Link className="rs-btn-o" to={`/app/conversations?q=${QUERY[w.group] ?? REL[w.group]}`}>View conversations <Icon icon={ArrowRight02Icon} size={24} /></Link>
              </div>))}
            {worst.length === 0 && <p className="rs-empty">Not enough data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
