import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FilterHorizontalIcon, MoreHorizontalIcon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { useAuth } from '../state/auth'
import { timeAgo, type Conversation, type Status } from '../data/mock'
import { Avatar, Icon, Popover, StatusPill } from './ui'
import { AgentCell, RangePicker } from './Dashboard'
import FilterPanel, { NO_FILTERS, type Filters } from './FilterPanel'

const TABS: Array<{ k: 'all' | Status; l: string; c?: string }> = [{ k: 'all', l: 'All' }, { k: 'resolved', l: 'AI resolved', c: '#01c88a' }, { k: 'needs_attention', l: 'Needs attention', c: '#fb2239' }, { k: 'human', l: 'Human', c: '#398ef9' }, { k: 'unresolved', l: 'Unresolved', c: '#fbc014' }]
const PAGE = 10

function RowMenu({ c, open, setOpen, onTake, onResolve, onReopen }: { c: Conversation; open: boolean; setOpen: (o: boolean) => void; onTake: () => void; onResolve: () => void; onReopen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  return (<>
    <button ref={ref} className="rs-dots" aria-label="Row actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon icon={MoreHorizontalIcon} size={24} /></button>
    <Popover anchor={ref} open={open} onClose={() => setOpen(false)} align="right" className="rs-rowm" minWidth={170}>
      <Link to={`/app/conversations/${c.id}`}>Open</Link>
      {!c.human && <button onClick={onTake}>Take over</button>}
      {c.status !== 'resolved' ? <button onClick={onResolve}>Mark resolved</button> : <button onClick={onReopen}>Reopen</button>}
    </Popover>
  </>)
}

export default function Conversations() {
  const { conversations, state, dispatch } = useStore()
  const { user } = useAuth()
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const [tab, setTab] = useState<'all' | Status>('all'), [page, setPage] = useState(0), [sel, setSel] = useState<Set<string>>(new Set()), [menu, setMenu] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(NO_FILTERS), [panel, setPanel] = useState(false)
  const q = (sp.get('q') ?? '').toLowerCase()
  const inRange = useMemo(() => conversations.filter(c => c.createdAt > Date.now() - state.range * 86_400_000), [conversations, state.range])
  const counts = useMemo(() => { const m: Record<string, number> = { all: inRange.length }; for (const c of inRange) m[c.status] = (m[c.status] ?? 0) + 1; return m }, [inRange])
  const list = useMemo(() => {
    const l = inRange.filter(c => (tab === 'all' || c.status === tab) && (!filters.channels.length || filters.channels.includes(c.channel)) && (filters.intent === 'all' || c.intent === filters.intent) && (filters.plan === 'all' || c.plan === filters.plan) && (filters.sentiment === 'all' || c.sentiment === filters.sentiment) && (!q || `${c.name} ${c.email} ${c.issue} ${c.preview}`.toLowerCase().includes(q)))
    return l
  }, [inRange, tab, q, filters])
  const chanCounts = useMemo(() => { const m: Record<string, number> = {}; for (const c of inRange) m[c.channel] = (m[c.channel] ?? 0) + 1; return m }, [inRange])
  const active = filters.channels.length + (filters.intent !== 'all' ? 1 : 0) + (filters.plan !== 'all' ? 1 : 0) + (filters.sentiment !== 'all' ? 1 : 0)
  const pages = Math.max(1, Math.ceil(list.length / PAGE)), p = Math.min(page, pages - 1), rows = list.slice(p * PAGE, p * PAGE + PAGE)
  const eligible = (sel.size ? list.filter(c => sel.has(c.id)) : list.filter(c => c.status === 'needs_attention').slice(0, 1)).filter(c => !c.human)
  const me = user?.name ?? 'Support agent'
  const toggle = (id: string) => setSel(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const allOn = rows.length > 0 && rows.every(c => sel.has(c.id))

  return (
    <div className="rs-page">
      <div className="rs-head sub"><p>Monitor and manage conversation. Take over when the AI needs help</p>
        <div className="rs-head-r"><RangePicker /><button className="rs-green" disabled={!eligible.length} onClick={() => { dispatch({ type: 'takeover', ids: eligible.map(c => c.id), agent: me }); setSel(new Set()) }}>Take over conversation{eligible.length > 1 ? ` (${eligible.length})` : ''}</button></div></div>
      <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="rs-ttl">Conversations</div>
        <div className="rs-between rs-wrap" style={{ alignItems: 'center' }}>
          <div className="rs-chip-row">{TABS.map(t => <button key={t.k} className={`rs-chip ${tab === t.k ? 'on' : ''}`} onClick={() => { setTab(t.k); setPage(0) }}>{t.c && <i style={{ background: t.c }} />}{t.l}<em>{(counts[t.k] ?? 0).toLocaleString()}</em></button>)}</div>
          <button className="rs-filter" onClick={() => setPanel(true)}><Icon icon={FilterHorizontalIcon} size={24} />Filter{active > 0 && <em>{active}</em>}</button>
        </div>
        {q && <p className="rs-qnote">Showing results for “{sp.get('q')}” <button onClick={() => { const n = new URLSearchParams(sp); n.delete('q'); setSp(n) }}>Clear</button></p>}
        <div className="rs-tbl rs-scroll">
          <div className="rs-tr rs-th rs-c7"><span><input className="rs-cb" type="checkbox" aria-label="Select all" checked={allOn} onChange={() => setSel(s => { const n = new Set(s); rows.forEach(c => (allOn ? n.delete(c.id) : n.add(c.id))); return n })} /></span><span>Customer</span><span>Issue</span><span>Status</span><span>Agent</span><span>Time</span><span className="rs-end"><Icon icon={MoreVerticalIcon} size={24} /></span></div>
          {rows.map(c => (
            <div key={c.id} className={`rs-tr rs-c7 tall ${sel.has(c.id) ? 'sel' : ''}`} onClick={() => nav(`/app/conversations/${c.id}`)}>
              <span onClick={e => e.stopPropagation()}><input className="rs-cb" type="checkbox" aria-label={`Select ${c.name}`} checked={sel.has(c.id)} onChange={() => toggle(c.id)} /></span>
              <span className="rs-cu"><Avatar c={c} size={40} /><span><b>{c.name}</b><small>{c.email}</small></span></span>
              <span className="rs-is"><span>{c.issue}</span><small>{c.preview}</small></span>
              <span><StatusPill s={c.status} /></span><span><AgentCell c={c} /></span><span className="rs-plain">{timeAgo(c.createdAt)}</span>
              <span className="rs-rel rs-end" onClick={e => e.stopPropagation()}><RowMenu c={c} open={menu === c.id} setOpen={o => setMenu(o ? c.id : null)} onTake={() => { dispatch({ type: 'takeover', ids: [c.id], agent: me }); setMenu(null) }} onResolve={() => { dispatch({ type: 'resolve', id: c.id }); setMenu(null) }} onReopen={() => { dispatch({ type: 'reopen', id: c.id }); setMenu(null) }} /></span>
            </div>))}
          {rows.length === 0 && <p className="rs-empty">No conversations match your filters.</p>}
        </div>
        <div className="rs-pager"><span className="rs-plain">{list.length ? `${p * PAGE + 1}–${Math.min(list.length, p * PAGE + PAGE)} of ${list.length.toLocaleString()}` : '0 results'}{sel.size > 0 && ` · ${sel.size} selected`}</span><span><button disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</button><button disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</button></span></div>
      </div>
      {panel && <FilterPanel value={filters} counts={chanCounts} onClose={() => setPanel(false)} onApply={f => { setFilters(f); setPage(0) }} />}
    </div>
  )
}
