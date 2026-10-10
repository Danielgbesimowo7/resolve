import { useMemo, useState } from 'react'
import { ArrowRight02Icon, GoogleGeminiIcon, Message02Icon, Search01Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { GAPS, type Priority } from '../data/knowledge'
import { useStore } from '../state/store'
import { Icon, StatCards, CircleCheckBig, Scale3d } from './ui'
import { RangePicker } from './Dashboard'

const DOT: Record<Priority, string> = { High: '#fb2239', Medium: '#fbc014', Low: '#01c88a' }
const ago = (ms: number) => { const m = Math.max(1, Math.round(ms / 60_000)); if (m < 60) return `${m}min ago`; const h = Math.round(m / 60); return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago` }

export default function Knowledge() {
  const { state, dispatch } = useStore()
  const [f, setF] = useState<'All' | Priority>('All'), [q, setQ] = useState(''), [edit, setEdit] = useState<string | null>(null), [text, setText] = useState('')
  const now = Date.now()
  const rows = useMemo(() => GAPS.filter(g => (f === 'All' || g.priority === f) && (!q || `${g.topic} ${g.desc} ${g.rec}`.toLowerCase().includes(q.toLowerCase()))), [f, q])
  const done = GAPS.filter(g => state.kb[g.id]).length, open = GAPS.length - done
  const rec = GAPS.filter(g => g.rate < 80 && !state.kb[g.id]).length
  const avgRate = Math.round(GAPS.reduce((a, g) => a + g.rate + (state.kb[g.id] ? 12 : 0), 0) / GAPS.length)
  const count = (p: 'All' | Priority) => GAPS.filter(g => p === 'All' || g.priority === p).length
  const cur = GAPS.find(g => g.id === edit)
  return (
    <div className="rs-page">
      <div className="rs-head sub"><p>Identify knowledge gaps, improve the AI’s responses, and help it resolve more conversations.</p><div className="rs-head-r"><RangePicker /></div></div>
      <StatCards range={state.range} items={[
        { icon: <Icon icon={Message02Icon} size={24} />, label: 'Knowledge gaps', value: String(open), delta: 6.1, invert: true },
        { icon: <Scale3d />, label: 'Recommended updates', value: String(rec), delta: 6.3, invert: true },
        { icon: <CircleCheckBig />, label: 'Improvement rate', value: `${Math.min(99, 76 + done * 2)}%`, delta: 4.2 },
        { icon: <Icon icon={GoogleGeminiIcon} size={24} />, label: 'Avg. resolution rate', value: `${avgRate}%`, delta: 28 },
      ]} />
      <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rs-ttl">Knowledge gaps</div>
          <p className="rs-sub18">AI struggles with these topics. Review and improve to increase resolution rates.</p>
          <div className="rs-between rs-wrap" style={{ alignItems: 'center' }}>
            <div className="rs-chip-row">{(['All', 'High', 'Medium', 'Low'] as const).map(p => <button key={p} className={`rs-chip ${f === p ? 'on' : ''}`} onClick={() => setF(p)}>{p !== 'All' && <i style={{ background: DOT[p] }} />}{p === 'All' ? 'All' : `${p} priority`}<em>{count(p)}</em></button>)}</div>
            <label className="rs-search flat"><Icon icon={Search01Icon} size={24} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search knowledge gaps" aria-label="Search knowledge gaps" /></label>
          </div>
        </div>
        <div className="rs-tbl rs-scroll">
          <div className="rs-tr rs-th rs-cK"><span>Topic</span><span>Conversations</span><span>Resolution rate</span><span>Priority</span><span>Recommendation</span><span>Updated</span></div>
          {rows.map(g => { const u = state.kb[g.id]; return (
            <div key={g.id} className="rs-tr rs-cK tall">
              <span className="rs-gt"><b>{g.topic}</b><small>{g.desc}</small></span>
              <span className="rs-plain">{g.conversations}</span>
              <span className="rs-rt"><span className="rs-plain">{u ? Math.min(99, g.rate + 12) : g.rate}%</span>{!u && <i className="rs-delta bad"><Icon icon={ArrowRight02Icon} size={16} className="dn" />{g.drop.toFixed(1)}%</i>}</span>
              <span><i className={`rs-pill ${g.priority === 'High' ? 'rs-needs_attention' : g.priority === 'Medium' ? 'rs-unresolved' : 'rs-resolved'}`}>{g.priority}</i></span>
              <span className="rs-rec"><span>{u ? 'Update published. The AI will use it from the next conversation.' : g.rec}</span><button className="rs-btn-o" onClick={() => { setEdit(g.id); setText(u?.text ?? g.rec) }}>{u ? 'Edit knowledge' : 'Update knowledge'} <Icon icon={ArrowRight02Icon} size={24} /></button></span>
              <span className="rs-plain">{u ? ago(now - u.at) : ago(g.ago)}</span>
            </div>) })}
          {rows.length === 0 && <p className="rs-empty">No knowledge gaps match your filters.</p>}
        </div>
      </div>
      {cur && (<>
        <div className="rs-blur" onClick={() => setEdit(null)} />
        <div className="rs-modal" role="dialog" aria-label="Update knowledge">
          <div className="rs-ttl">{cur.topic}</div><p className="rs-sub18" style={{ marginTop: 8 }}>{cur.desc}</p>
          <div className="rs-modal-m"><span><Icon icon={Message02Icon} size={20} />{cur.conversations} conversations</span><span><Icon icon={Clock01Icon} size={20} />{cur.rate}% resolution</span></div>
          <label className="rs-fg"><b>Article update</b><textarea className="rs-ta" rows={6} value={text} onChange={e => setText(e.target.value)} /></label>
          <div className="rs-pfoot"><button className="rs-btn-o" onClick={() => setEdit(null)}>Cancel</button><button className="rs-green" disabled={!text.trim()} onClick={() => { dispatch({ type: 'kb', id: cur.id, text: text.trim() }); setEdit(null) }}>Publish update</button></div>
        </div></>)}
    </div>
  )
}
