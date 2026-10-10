import { useMemo, useState } from 'react'
import { Clock01Icon, GoogleGeminiIcon, Message02Icon, UserMultipleIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { buckets, intentStats, smooth, summary } from './metrics'
import { Icon, StatCards, useNarrow, useWidth, ChartScroll } from './ui'
import { Donut, RangePicker, fmtK } from './Dashboard'
import { IntentCard } from './AiPerformance'

const niceTop = (v: number) => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 4)))); for (const m of [1, 2, 4, 5, 8, 10]) if (m * p >= v) return m * p; return 10 * p }

function Stacked({ data }: { data: ReturnType<typeof buckets> }) {
  const narrow = useNarrow()
  const [hover, setHover] = useState<number | null>(null)
  const W = 730, X0 = narrow ? 10 : 52, H = 200, Y0 = 6
  const rows = data.map(b => { const ai = b.list.filter(c => c.status === 'resolved' && !c.human).length, hu = b.list.filter(c => c.human).length, un = b.list.length - ai - hu; return { label: b.label, ai, hu, un, total: b.list.length } })
  const max = niceTop(Math.max(...rows.map(r => r.total))), slot = (W - X0) / rows.length, bw = Math.min(44, slot * 0.5)
  const y = (v: number) => (v / max) * H
  const [wref, cw] = useWidth<HTMLDivElement>()
  return (
    <ChartScroll><div ref={wref} className="rs-chartw" style={{ height: 250 }} onMouseLeave={() => setHover(null)}>
      {[0, 1, 2, 3, 4].map(i => <span key={i} className="rs-yl" style={{ top: Y0 + H - (H * i) / 4 }}>{i === 0 ? '0' : fmtK((max * i) / 4)}</span>)}
      <svg viewBox={`0 0 ${W} 250`} preserveAspectRatio="none">
        {[0, 1, 2, 3, 4].map(i => <line key={i} x1={X0} x2={W} y1={Y0 + (H * i) / 4} y2={Y0 + (H * i) / 4} stroke="#eef0f0" />)}
        {rows.map((r, i) => { const x = X0 + slot * i + (slot - bw) / 2, base = Y0 + H, h1 = y(r.ai), h2 = y(r.hu), h3 = y(r.un)
          const top = (yy: number, hh: number, c: string, round: boolean) => hh > 0 && <path d={round ? `M${x} ${yy + hh}V${yy + 8}Q${x} ${yy} ${x + 8} ${yy}H${x + bw - 8}Q${x + bw} ${yy} ${x + bw} ${yy + 8}V${yy + hh}Z` : `M${x} ${yy}H${x + bw}V${yy + hh}H${x}Z`} fill={c} />
          return <g key={i} opacity={hover === null || hover === i ? 1 : 0.55} onMouseEnter={() => setHover(i)}><rect x={x - 12} y={Y0} width={bw + 24} height={H} fill="transparent" />{top(base - h1, h1, '#01c88a', !h2 && !h3)}{top(base - h1 - h2, h2, '#398ef9', !h3)}{top(base - h1 - h2 - h3, h3, '#f4c117', true)}</g> })}
      </svg>
      {rows.map((r, i) => <span key={i} className="rs-xl" style={{ left: `${((X0 + slot * i + slot / 2) / W) * 100}%` }}>{r.label}</span>)}
      {hover !== null && <div className="rs-tip" style={{ left: `calc(${((X0 + slot * hover + slot / 2) / W) * 100}% ${(((X0 + slot * hover + slot / 2) / W) * cw + 30 + 160 > cw - 4) ? '- 190px' : '+ 30px'})`, top: 40 }}><span>{rows[hover].label}</span><b>{rows[hover].ai} AI · {rows[hover].hu} human · {rows[hover].un} unresolved</b></div>}
    </div></ChartScroll>
  )
}

function Trend({ data }: { data: ReturnType<typeof buckets> }) {
  const narrow = useNarrow()
  const [hover, setHover] = useState<number | null>(null)
  const W = 739, X0 = narrow ? 10 : 52, PW = W - X0, H = 202, Y0 = 6
  const pts = data.map((d, i) => [X0 + (i * PW) / (data.length - 1), Y0 + H - (d.rate / 100) * H] as const)
  const d = smooth(pts), a = hover ?? data.length - 2, [ax, ay] = pts[a]
  const [wref2, cw2] = useWidth<HTMLDivElement>(), flip = cw2 > 0 && (ax / W) * cw2 + 22 + 100 > cw2 - 4
  return (
    <ChartScroll><div ref={wref2} className="rs-chartw" style={{ height: 250 }} onMouseLeave={() => setHover(null)} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W; setHover(pts.reduce((b, p, i) => (Math.abs(p[0] - x) < Math.abs(pts[b][0] - x) ? i : b), 0)) }}>
      {[0, 25, 50, 75, 100].map(t => <span key={t} className="rs-yl" style={{ top: Y0 + H - (t / 100) * H }}>{t === 0 ? '0' : `${t}%`}</span>)}
      <svg viewBox={`0 0 ${W} 250`} preserveAspectRatio="none">
        <defs><linearGradient id="rtg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#01c88a" stopOpacity=".2" /><stop offset="1" stopColor="#01c88a" stopOpacity="0" /></linearGradient></defs>
        {[0, 25, 50, 75, 100].map(t => <line key={t} x1={X0} x2={W} y1={Y0 + H - (t / 100) * H} y2={Y0 + H - (t / 100) * H} stroke="#eef0f0" />)}
        <path d={`${d}L${pts[pts.length - 1][0]} ${Y0 + H}L${pts[0][0]} ${Y0 + H}Z`} fill="url(#rtg)" /><path d={d} fill="none" stroke="#01c88a" strokeWidth="2.2" />
        <line x1={ax} x2={ax} y1={Y0} y2={Y0 + H} stroke="#555" strokeDasharray="3 3" />{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === a ? 7 : 6} fill="#01c88a" />)}
      </svg>
      {pts.map((p, i) => <span key={i} className="rs-xl" style={{ left: `${(p[0] / W) * 100}%` }}>{data[i].label}</span>)}
      <div className="rs-tip" style={{ width: 'auto', minWidth: 90, left: `calc(${(ax / W) * 100}% ${flip ? '- 112px' : '+ 22px'})`, top: Math.max(0, ay - 36) }}><span>{data[a].label}</span><b>{data[a].rate.toFixed(1)}%</b><i className={flip ? 'r' : 'l'} /></div>
    </div></ChartScroll>
  )
}

export default function Analytics() {
  const { conversations, state } = useStore(), days = state.range
  const cur = useMemo(() => summary(conversations, days), [conversations, days]), prev = useMemo(() => summary(conversations, days, 1), [conversations, days])
  const data = useMemo(() => buckets(conversations, days), [conversations, days]), intents = useMemo(() => intentStats(conversations, days), [conversations, days])
  const channels = useMemo(() => { const m = new Map<string, number>(); for (const c of conversations.filter(c => c.createdAt > Date.now() - days * 86_400_000)) m.set(c.channel, (m.get(c.channel) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]) }, [conversations, days])
  const rel = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0), COLORS = ['#01c88a', '#398ef9', '#f4c117', '#6155f5', '#fb2239']
  return (
    <div className="rs-page">
      <div className="rs-head sub"><p>Track key metrics, measure performance, and gain insights into your support operation</p><div className="rs-head-r"><RangePicker /></div></div>
      <StatCards range={days} items={[
        { icon: <Icon icon={Message02Icon} size={24} />, label: 'Total conversations', value: cur.total.toLocaleString(), delta: rel(cur.total, prev.total) },
        { icon: <Icon icon={GoogleGeminiIcon} size={24} />, label: 'AI resolution rate', value: `${cur.aiRate.toFixed(1)}%`, delta: rel(cur.aiRate, prev.aiRate) },
        { icon: <Icon icon={UserMultipleIcon} size={24} />, label: 'Human takeover rate', value: `${cur.escRate.toFixed(1)}%`, delta: rel(cur.escRate, prev.escRate), invert: true },
        { icon: <Icon icon={Clock01Icon} size={24} />, label: 'Avg. response time', value: `${Math.round(cur.resp)}s`, delta: rel(cur.resp, prev.resp), invert: true },
      ]} />
      <div className="rs-an">
        <div className="rs-anL">
          <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="rs-between" style={{ alignItems: 'center' }}><div className="rs-ttl">Conversation by resolution</div><div className="rs-key">{([['AI resolved', '#01c88a'], ['Human resolved', '#398ef9'], ['Unresolved', '#f4c117']] as const).map(([l, c]) => <span key={l}><i style={{ background: c }} />{l}</span>)}</div></div>
            <Stacked data={data} />
          </div>
          <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}><div className="rs-ttl">Resolution rate trend</div><Trend data={data} /></div>
          <IntentCard intents={intents} compact />
        </div>
        <div className="rs-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="rs-ttl">Top channels</div>
          <div className="rs-donut-w" style={{ marginTop: 0 }}>
            <div className="rs-donut"><Donut segs={channels.map(([, n], i) => ({ v: n, c: COLORS[i % 5] }))} /><div className="rs-donut-c"><b>{cur.total.toLocaleString()}</b><span>conversations</span></div></div>
            <ul className="rs-legend" style={{ gap: 28 }}>{channels.slice(0, 4).map(([n, v], i) => <li key={n}><div><i style={{ background: COLORS[i % 5] }} />{n}</div><span>{cur.total ? ((v / cur.total) * 100).toFixed(1) : '0.0'}% <small>({v.toLocaleString()})</small></span></li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  )
}
