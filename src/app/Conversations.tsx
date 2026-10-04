import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MoreHorizontalIcon, SlidersHorizontalIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { useAuth } from '../state/auth'
import { timeAgo, type Status } from '../data/mock'
import { Avatar, Icon, StatusPill } from './ui'
import { RangePicker } from './Dashboard'
import Drawer from './Drawer'

const TABS: Array<{ k: 'all' | Status; l: string; c?: string }> = [{ k: 'all', l: 'All' }, { k: 'resolved', l: 'AI resolved', c: '#01c88a' }, { k: 'needs_attention', l: 'Needs attention', c: '#fb2239' }, { k: 'human', l: 'Human', c: '#398ef9' }, { k: 'unresolved', l: 'Unresolved', c: '#fbc014' }]
const PAGE = 10

export default function Conversations() {
  const { conversations, state, dispatch } = useStore()
  const { user } = useAuth()
  const [sp, setSp] = useSearchParams()
  const [tab, setTab] = useState<'all' | Status>('all'), [page, setPage] = useState(0), [sel, setSel] = useState<Set<string>>(new Set()), [menu, setMenu] = useState<string | null>(null), [newest, setNewest] = useState(true)
  const q = (sp.get('q') ?? '').toLowerCase(), open = sp.get('c')
  const inRange = useMemo(() => conversations.filter(c => c.createdAt > Date.now() - state.range * 86_400_000), [conversations, state.range])
  const counts = useMemo(() => { const m: Record<string, number> = { all: inRange.length }; for (const c of inRange) m[c.status] = (m[c.status] ?? 0) + 1; return m }, [inRange])
  const list = useMemo(() => { const l = inRange.filter(c => (tab === 'all' || c.status === tab) && (!q || `${c.name} ${c.email} ${c.issue} ${c.preview}`.toLowerCase().includes(q))); return newest ? l : [...l].reverse() }, [inRange, tab, q, newest])
  const pages = Math.max(1, Math.ceil(list.length / PAGE)), p = Math.min(page, pages - 1), rows = list.slice(p * PAGE, p * PAGE + PAGE)
  const eligible = (sel.size ? list.filter(c => sel.has(c.id)) : list.filter(c => c.status === 'needs_attention').slice(0, 1)).filter(c => !c.human)
  const me = user?.name ?? 'Support agent'
  const toggle = (id: string) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const allOn = rows.length > 0 && rows.every(c => sel.has(c.id))
  const openRow = (id: string) => { const n = new URLSearchParams(sp); n.set('c', id); setSp(n) }

  return (
    <div className="rs-page">
      <div className="rs-head"><p>Monitor and manage conversation. Take over when the AI needs help</p>
        <div className="rs-head-r"><RangePicker /><button className="rs-green" disabled={!eligible.length} onClick={() => { dispatch({ type: 'takeover', ids: eligible.map(c => c.id), agent: me }); setSel(new Set()) }}>Take over conversation{eligible.length > 1 ? ` (${eligible.length})` : ''}</button></div></div>
      <div className="rs-card rs-pad"><div className="rs-ttl">Conversations</div>
        <div className="rs-between rs-wrap"><div className="rs-chips">{TABS.map(t => <button key={t.k} className={`rs-chip ${tab === t.k ? 'on' : ''}`} onClick={() => { setTab(t.k); setPage(0) }}>{t.c && <i style={{ background: t.c }} />}{t.l}<em>{(counts[t.k] ?? 0).toLocaleString()}</em></button>)}</div>
          <button className="rs-sq" aria-label={newest ? 'Newest first' : 'Oldest first'} title={newest ? 'Newest first' : 'Oldest first'} onClick={() => setNewest(n => !n)}><Icon icon={SlidersHorizontalIcon} /></button></div>
        {q && <p className="rs-qnote">Showing results for “{sp.get('q')}” <button onClick={() => { const n = new URLSearchParams(sp); n.delete('q'); setSp(n) }}>Clear</button></p>}
        <div className="rs-tbl rs-scroll"><div className="rs-tr rs-th rs-cols7"><span><input type="checkbox" aria-label="Select all" checked={allOn} onChange={() => setSel(s => { const n = new Set(s); rows.forEach(c => (allOn ? n.delete(c.id) : n.add(c.id))); return n })} /></span><span>Customer</span><span>Issue</span><span>Status</span><span>Agent</span><span>Time</span><span /></div>
          {rows.map(c => (
            <div key={c.id} className={`rs-tr rs-cols7 ${open === c.id ? 'active' : ''}`} onClick={() => openRow(c.id)}>
              <span onClick={e => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${c.name}`} checked={sel.has(c.id)} onChange={() => toggle(c.id)} /></span>
              <span className="rs-cu"><Avatar c={c} /><span><b>{c.name}</b><small>{c.email}</small></span></span>
              <span className="rs-is"><span>{c.issue}</span><small>{c.preview}</small></span>
              <span><StatusPill s={c.status} /></span><span className="rs-mut">{c.agent}</span><span className="rs-mut">{timeAgo(c.createdAt)}</span>
              <span className="rs-rel" onClick={e => e.stopPropagation()}><button className="rs-dots" aria-label="Row actions" onClick={() => setMenu(menu === c.id ? null : c.id)}><Icon icon={MoreHorizontalIcon} /></button>
                {menu === c.id && <div className="rs-pop rs-rowm"><button onClick={() => { openRow(c.id); setMenu(null) }}>Open</button>{!c.human && <button onClick={() => { dispatch({ type: 'takeover', ids: [c.id], agent: me }); setMenu(null) }}>Take over</button>}{c.status !== 'resolved' ? <button onClick={() => { dispatch({ type: 'resolve', id: c.id }); setMenu(null) }}>Mark resolved</button> : <button onClick={() => { dispatch({ type: 'reopen', id: c.id }); setMenu(null) }}>Reopen</button>}</div>}</span>
            </div>))}
          {rows.length === 0 && <p className="rs-empty">No conversations match your filters.</p>}</div>
        <div className="rs-pager"><span className="rs-mut">{list.length ? `${p * PAGE + 1}–${Math.min(list.length, p * PAGE + PAGE)} of ${list.length.toLocaleString()}` : '0 results'}{sel.size > 0 && ` · ${sel.size} selected`}</span><span><button disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</button><button disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</button></span></div>
      </div>
      {open && <Drawer id={open} onClose={() => { const n = new URLSearchParams(sp); n.delete('c'); setSp(n) }} />}
    </div>
  )
}
