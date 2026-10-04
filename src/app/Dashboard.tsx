import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown01Icon, ArrowRight02Icon, ArrowUp02Icon, Calendar05Icon, Clock01Icon, GoogleGeminiIcon, Message02Icon, UserMultipleIcon } from '@hugeicons/core-free-icons'
import { useStore, type Range } from '../state/store'
import { computeStats, timeAgo, type Status } from '../data/mock'
import { Avatar, Icon, StatusPill } from './ui'
import { useAuth } from '../state/auth'

export function RangePicker() {
  const { state, dispatch } = useStore()
  return (
    <label className="rs-range"><Icon icon={Calendar05Icon} size={18} />
      <select value={state.range} onChange={e => dispatch({ type: 'range', range: Number(e.target.value) as Range })} aria-label="Date range">
        <option value={7}>Last 7 days</option><option value={14}>Last 14 days</option><option value={30}>Last 30 days</option>
      </select><Icon icon={ArrowDown01Icon} size={18} /></label>
  )
}

function Delta({ cur, prev, invert }: { cur: number; prev: number; invert?: boolean }) {
  const pct = prev ? ((cur - prev) / prev) * 100 : 0
  const good = invert ? pct <= 0 : pct >= 0
  return <span className={`rs-delta ${good ? 'good' : 'bad'}`}><Icon icon={ArrowUp02Icon} size={18} className={pct < 0 ? 'flip' : ''} />{Math.abs(pct).toFixed(1)}%</span>
}

function LineChart({ series }: { series: Array<{ label: string; count: number }> }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600, H = 200, pad = 28, max = Math.max(4, ...series.map(s => s.count)) * 1.15
  const pts = series.map((s, i) => [pad + (i * (W - pad * 2)) / Math.max(1, series.length - 1), H - 34 - (s.count / max) * (H - 54)] as const)
  const d = pts.reduce((a, p, i) => { if (!i) return `M${p[0]} ${p[1]}`; const q = pts[i - 1], cx = (q[0] + p[0]) / 2; return `${a}C${cx} ${q[1]} ${cx} ${p[1]} ${p[0]} ${p[1]}` }, '')
  return (
    <svg className="rs-chart" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setHover(null)} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W; setHover(pts.reduce((b, p, i) => (Math.abs(p[0] - x) < Math.abs(pts[b][0] - x) ? i : b), 0)) }}>
      <defs><linearGradient id="rsg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#01c88a" stopOpacity=".2" /><stop offset="1" stopColor="#01c88a" stopOpacity="0" /></linearGradient></defs>
      {[0, 1, 2, 3].map(i => <line key={i} x1={pad} x2={W - pad} y1={20 + i * ((H - 54) / 3)} y2={20 + i * ((H - 54) / 3)} stroke="#f0f0f0" />)}
      <path d={`${d}L${pts[pts.length - 1][0]} ${H - 34}L${pts[0][0]} ${H - 34}Z`} fill="url(#rsg)" /><path d={d} fill="none" stroke="#01c88a" strokeWidth="2" />
      {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r={hover === i ? 5 : 3} fill="#01c88a" />{(series.length <= 8 || i % 2 === 0) && <text x={p[0]} y={H - 10} fontSize="11" fill="#7a7a7a" textAnchor="middle">{series[i].label}</text>}</g>)}
      {hover !== null && <g><line x1={pts[hover][0]} x2={pts[hover][0]} y1="14" y2={H - 34} stroke="#01c88a" strokeDasharray="3 3" /><rect x={Math.min(W - 118, Math.max(4, pts[hover][0] - 56))} y="2" width="112" height="22" rx="6" fill="#222" /><text x={Math.min(W - 62, Math.max(60, pts[hover][0]))} y="17" fontSize="11" fill="#fff" textAnchor="middle">{series[hover].label}: {series[hover].count} conv.</text></g>}
    </svg>
  )
}

const FILTERS: Array<{ k: 'all' | Status; l: string; c?: string }> = [{ k: 'all', l: 'All' }, { k: 'resolved', l: 'AI resolved', c: '#01c88a' }, { k: 'needs_attention', l: 'Needs attention', c: '#fb2239' }, { k: 'human', l: 'Human', c: '#398ef9' }, { k: 'unresolved', l: 'Unresolved', c: '#fbc014' }]

export default function Dashboard() {
  const { conversations, state } = useStore()
  const { user } = useAuth()
  const [f, setF] = useState<'all' | Status>('all')
  const cur = useMemo(() => computeStats(conversations, state.range), [conversations, state.range])
  const prev = useMemo(() => computeStats(conversations, state.range, Date.now(), 1), [conversations, state.range])
  const h = new Date().getHours(), hello = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  const rows = conversations.filter(c => f === 'all' || c.status === f).slice(0, 5)
  const pct = (n: number) => (cur.total ? (n / cur.total) * 100 : 0)
  const stats = [
    { icon: Message02Icon, label: 'Total conversations', val: cur.total.toLocaleString(), p: prev.total, c: cur.total },
    { icon: GoogleGeminiIcon, label: 'AI resolution rate', val: `${cur.aiRate.toFixed(1)}%`, p: prev.aiRate, c: cur.aiRate },
    { icon: Clock01Icon, label: 'Average response time', val: `${Math.round(cur.avgResp)}s`, p: prev.avgResp, c: cur.avgResp, invert: true },
    { icon: UserMultipleIcon, label: 'Escalations to human', val: cur.escalations.toLocaleString(), p: prev.escalations, c: cur.escalations, invert: true },
  ]
  const circ = 2 * Math.PI * 15.9155
  const segs = [{ v: pct(cur.ai), c: '#01c88a' }, { v: pct(cur.human), c: '#398ef9' }, { v: pct(cur.unresolved), c: '#fbc014' }]
  let acc = 0
  return (
    <div className="rs-page">
      <div className="rs-head"><div><h2>{hello}, <span>{user?.name.split(' ')[0]} 👋</span></h2><p>Here is what is happening with your customer support {state.range === 7 ? 'this week' : `over the last ${state.range} days`}</p></div><RangePicker /></div>
      <div className="rs-stats">{stats.map(s => <div className="rs-card rs-stat" key={s.label}><div className="rs-stat-h"><span className="rs-ib"><Icon icon={s.icon} /></span>{s.label}</div><div className="rs-stat-b"><div className="rs-num">{s.val}</div><div><Delta cur={s.c} prev={s.p} invert={s.invert} /> <span className="rs-mut">vs. previous {state.range} days</span></div></div></div>)}</div>
      <div className="rs-two">
        <div className="rs-card rs-pad"><div className="rs-ttl">Conversation volume</div><LineChart series={cur.series} /></div>
        <div className="rs-card rs-pad"><div className="rs-ttl">Resolution performance</div>
          <div className="rs-donut-w"><div className="rs-donut"><svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>{segs.map((s, i) => { const len = (s.v / 100) * circ, off = -acc; acc += len; return <circle key={i} cx="18" cy="18" r="15.9155" fill="none" stroke={s.c} strokeWidth="4" strokeDasharray={`${len} ${circ}`} strokeDashoffset={off} /> })}</svg><span><b>{cur.aiRate.toFixed(1)}%</b>AI resolved</span></div>
            <ul className="rs-legend"><li><i style={{ background: '#01c88a' }} />AI resolved<small>{pct(cur.ai).toFixed(1)}% ({cur.ai.toLocaleString()})</small></li><li><i style={{ background: '#398ef9' }} />Human<small>{pct(cur.human).toFixed(1)}% ({cur.human.toLocaleString()})</small></li><li><i style={{ background: '#fbc014' }} />Unresolved<small>{pct(cur.unresolved).toFixed(1)}% ({cur.unresolved.toLocaleString()})</small></li></ul></div></div>
      </div>
      <div className="rs-card rs-pad"><div className="rs-between"><div className="rs-ttl">Recent conversations</div><Link className="rs-link" to="/app/conversations">View all conversations <Icon icon={ArrowRight02Icon} size={18} /></Link></div>
        <div className="rs-chips">{FILTERS.map(x => <button key={x.k} className={`rs-chip ${f === x.k ? 'on' : ''}`} onClick={() => setF(x.k)}>{x.c && <i style={{ background: x.c }} />}{x.l}</button>)}</div>
        <div className="rs-tbl"><div className="rs-tr rs-th rs-cols5"><span>Customer</span><span>Issue</span><span>Status</span><span>Agent</span><span>Time</span></div>
          {rows.map(c => <Link key={c.id} to={`/app/conversations?c=${c.id}`} className="rs-tr rs-cols5"><span className="rs-cu"><Avatar c={c} /><span><b>{c.name}</b><small>{c.email}</small></span></span><span>{c.issue}</span><span><StatusPill s={c.status} /></span><span>{c.agent}</span><span className="rs-mut">{timeAgo(c.createdAt)}</span></Link>)}
          {rows.length === 0 && <p className="rs-empty">No conversations match this filter.</p>}</div></div>
    </div>
  )
}
