import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowDown01Icon, ArrowLeft02Icon, FilterHorizontalIcon, Happy01Icon, MoreHorizontalIcon, MoreVerticalIcon, Sad01Icon, Search01Icon, SmileIcon, UserMultipleIcon, Message02Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { useAuth } from '../state/auth'
import { PLANS, STATUS_LABEL, timeAgo } from '../data/mock'
import { Avatar, Icon, StatCards, StatusPill } from './ui'
import { RangePicker } from './Dashboard'
import { buildCustomers, type Customer } from './customerData'
import { inWindow } from './metrics'

const PAGE = 10
export const planClass = (p: string) => `rs-plan ${p.toLowerCase()}`
const SAT = (n: number) => (n >= 4 ? { icon: Happy01Icon, c: '#01c88a' } : n === 3 ? { icon: SmileIcon, c: '#fbc014' } : { icon: Sad01Icon, c: '#fb2239' })
export const Face = ({ n }: { n: number }) => { const s = SAT(n); return <span className="rs-face" style={{ color: s.c }}><Icon icon={s.icon} size={24} />{n}/5</span> }

function Pick({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<[string, string]> }) {
  const cur = options.find(o => o[0] === value)
  return <label className="rs-dd"><span>{value === options[0][0] ? label : cur?.[1]}</span><Icon icon={ArrowDown01Icon} size={24} /><select value={value} onChange={e => onChange(e.target.value)} aria-label={label}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
}

function Panel({ c, onClose }: { c: Customer; onClose: () => void }) {
  const { state, dispatch } = useStore(), { user } = useAuth()
  const [tab, setTab] = useState<'Overview' | 'Conversations' | 'Details' | 'Notes'>('Overview'), [note, setNote] = useState('')
  const notes = state.cnotes[c.email] ?? []
  const info: Array<[string, React.ReactNode]> = [['Name', c.name], ['Email', c.email], ['Plan', <i key="p" className={planClass(c.plan)}>{c.plan}</i>], ['Customer since', c.since], ['Total conversations', c.conversations], ['Last interaction', timeAgo(c.last)]]
  const recent = c.convos.slice(0, 5)
  return (<>
    <div className="rs-blur" onClick={onClose} />
    <aside className="rs-panel" role="dialog" aria-label={`${c.name} profile`}>
      <button className="rs-back" onClick={onClose}><Icon icon={ArrowLeft02Icon} size={24} />Back to Customers</button><hr className="rs-hr" />
      <div className="rs-pcard">
        <div className="rs-cu" style={{ gap: 16 }}><Avatar c={c} size={64} /><span><b style={{ fontSize: 20 }}>{c.name}</b><small>{c.email}</small></span></div>
        <div className="rs-mini3"><div><Icon icon={Message02Icon} size={20} /><span>Conversations</span><b>{c.conversations}</b></div><div><Icon icon={Clock01Icon} size={20} /><span>Last interaction</span><b>{timeAgo(c.last).replace('min ago', 'm ago')}</b></div><div><Icon icon={UserMultipleIcon} size={20} /><span>Satisfaction</span><b>{c.satisfaction}/5</b></div></div>
        <div className="rs-tabs">{(['Overview', 'Conversations', 'Details', 'Notes'] as const).map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
        {(tab === 'Overview' || tab === 'Details') && <div className="rs-kvl"><b>Customer information</b>{info.map(([k, v]) => <div key={k}><span>{k}</span><em>{v}</em></div>)}{tab === 'Details' && <><div><span>Channel</span><em>{c.convos[0].channel}</em></div><div><span>Sentiment</span><em>{c.convos[0].sentiment}</em></div></>}</div>}
        {(tab === 'Overview' || tab === 'Conversations') && <div className="rs-kvl"><b>{tab === 'Overview' ? 'Recent conversations' : `All conversations (${c.convos.length})`}</b>{(tab === 'Overview' ? recent : c.convos.slice(0, 30)).map(x => <Link key={x.id} className="rs-rcv" to={`/app/conversations/${x.id}`}><span><b>{x.issue}</b><small>{new Date(x.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {timeAgo(x.createdAt)}</small></span><StatusPill s={x.status} /></Link>)}</div>}
        {tab === 'Notes' && <div className="rs-kvl"><b>Notes</b>{notes.length === 0 && <p className="rs-plain">No notes yet. Notes are only visible to your team.</p>}{notes.map(n => <div key={n.id} className="rs-note"><b>{n.by}<small>{timeAgo(n.at)}</small></b><p>{n.text}</p></div>)}<textarea className="rs-ta" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Write a note about this customer…" aria-label="Customer note" /><button className="rs-green" disabled={!note.trim()} onClick={() => { dispatch({ type: 'cnote', email: c.email, text: note.trim(), by: user?.name ?? 'Support agent' }); setNote('') }}>Add note</button></div>}
      </div>
    </aside></>)
}

export default function Customers() {
  const { conversations, state } = useStore()
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? ''), [plan, setPlan] = useState('all'), [seg, setSeg] = useState('all'), [sort, setSort] = useState('recent'), [page, setPage] = useState(0), [sat, setSat] = useState('any'), [fo, setFo] = useState(false), [sel, setSel] = useState<Set<string>>(new Set())
  const all = useMemo(() => buildCustomers(conversations), [conversations])
  const active = useMemo(() => new Set(inWindow(conversations, state.range).map(c => c.email)), [conversations, state.range])
  const prevActive = useMemo(() => new Set(inWindow(conversations, state.range, 1).map(c => c.email)), [conversations, state.range])
  const list = useMemo(() => {
    let l = all.filter(c => (!q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase())) && (plan === 'all' || c.plan === plan) && (seg === 'all' || (seg === 'attention' ? c.status === 'Needs attention' : seg === 'active' ? active.has(c.email) : !active.has(c.email))) && (sat === 'any' || (sat === 'low' ? c.satisfaction <= 2 : c.satisfaction >= 4)))
    if (sort === 'oldest') l = [...l].reverse(); if (sort === 'most') l = [...l].sort((a, b) => b.conversations - a.conversations)
    return l
  }, [all, q, plan, seg, sort, sat, active])
  const pages = Math.max(1, Math.ceil(list.length / PAGE)), p = Math.min(page, pages - 1), rows = list.slice(p * PAGE, p * PAGE + PAGE)
  const open = all.find(c => c.email === sp.get('c'))
  const avgSat = all.length ? (all.reduce((a, c) => a + c.satisfaction, 0) / all.length) * 20 : 0
  const avgConv = all.length ? all.reduce((a, c) => a + c.conversations, 0) / all.length : 0
  const toggle = (e: string) => setSel(s => { const n = new Set(s); if (n.has(e)) n.delete(e); else n.add(e); return n })
  const allOn = rows.length > 0 && rows.every(c => sel.has(c.email))
  const setOpen = (e: string | null) => { const n = new URLSearchParams(sp); if (e) n.set('c', e); else n.delete('c'); setSp(n) }
  const del = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0)
  return (
    <div className="rs-page">
      <div className="rs-head sub"><p>View and manage your customer profiles, conversations, and support history.</p><div className="rs-head-r"><RangePicker /></div></div>
      <StatCards range={state.range} items={[
        { icon: <Icon icon={UserMultipleIcon} size={24} />, label: 'Total customers', value: all.length.toLocaleString(), delta: 6.1 },
        { icon: <Icon icon={Message02Icon} size={24} />, label: 'Active this week', value: active.size.toLocaleString(), delta: del(active.size, prevActive.size) },
        { icon: <Icon icon={Happy01Icon} size={24} />, label: 'Average satisfaction', value: `${Math.round(avgSat)}%`, delta: 4.2 },
        { icon: <Icon icon={Clock01Icon} size={24} />, label: 'Average conversation', value: avgConv.toFixed(1), delta: 2.8 },
      ]} />
      <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div className="rs-between rs-wrap" style={{ alignItems: 'center' }}>
          <label className="rs-search flat"><Icon icon={Search01Icon} size={24} /><input value={q} onChange={e => { setQ(e.target.value); setPage(0) }} placeholder="Search by name, email..." aria-label="Search customers" /></label>
          <div className="rs-filters">
            <Pick label="All plans" value={plan} onChange={v => { setPlan(v); setPage(0) }} options={[['all', 'All plans'], ...PLANS.map(x => [x, x] as [string, string])]} />
            <Pick label="All segments" value={seg} onChange={v => { setSeg(v); setPage(0) }} options={[['all', 'All segments'], ['active', 'Active this week'], ['inactive', 'Inactive'], ['attention', 'Needs attention']]} />
            <Pick label="Last interaction" value={sort} onChange={setSort} options={[['recent', 'Last interaction'], ['oldest', 'Oldest first'], ['most', 'Most conversations']]} />
            <div className="rs-rel"><button className="rs-filter" onClick={() => setFo(o => !o)}><Icon icon={FilterHorizontalIcon} size={24} />Filter{sat !== 'any' && <em>1</em>}</button>
              {fo && <div className="rs-pop"><b>Satisfaction</b>{([['any', 'Any'], ['low', '1–2 out of 5'], ['high', '4–5 out of 5']] as const).map(([k, l]) => <button key={k} onClick={() => { setSat(k); setPage(0); setFo(false) }}>{sat === k ? '✓ ' : ''}{l}</button>)}</div>}</div>
          </div>
        </div>
        <div className="rs-tbl rs-scroll">
          <div className="rs-tr rs-th rs-cC"><span>Customer</span><span>Plan</span><span>Conversations</span><span>Last interaction</span><span>Satisfaction</span><span>Status</span><span className="rs-end"><Icon icon={MoreVerticalIcon} size={24} /></span></div>
          {rows.map(c => (
            <div key={c.email} className={`rs-tr rs-cC tall ${sel.has(c.email) ? 'sel' : ''}`} onClick={() => setOpen(c.email)}>
              <span className="rs-cu" onClick={e => e.target instanceof HTMLInputElement && e.stopPropagation()}><Avatar c={c} size={40} /><span><b>{c.name}</b><small>{c.email}</small></span></span>
              <span><i className={planClass(c.plan)}>{c.plan}</i></span><span className="rs-plain">{c.conversations}</span><span className="rs-plain">{timeAgo(c.last)}</span><span><Face n={c.satisfaction} /></span>
              <span><i className={`rs-pill ${c.status === 'Active' ? 'rs-resolved' : 'rs-needs_attention'}`}>{c.status === 'Active' ? 'Active' : STATUS_LABEL.needs_attention}</i></span>
              <span className="rs-end"><button className="rs-dots" aria-label="Open profile" onClick={e => { e.stopPropagation(); setOpen(c.email) }}><Icon icon={MoreHorizontalIcon} size={24} /></button></span>
            </div>))}
          {rows.length === 0 && <p className="rs-empty">No customers match your filters.</p>}
        </div>
        <div className="rs-pager"><span className="rs-plain">{list.length ? `${p * PAGE + 1}–${Math.min(list.length, p * PAGE + PAGE)} of ${list.length.toLocaleString()}` : '0 results'}{sel.size > 0 && ` · ${sel.size} selected`}</span><span><button disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</button><button disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</button></span></div>
      </div>
      {open && <Panel c={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
