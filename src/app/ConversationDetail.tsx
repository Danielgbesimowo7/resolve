import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft02Icon, AttachmentIcon, Clock01Icon, GoogleGeminiIcon, IdeaIcon, Message02Icon, MoreVerticalIcon, SentIcon, UserIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { useAuth } from '../state/auth'
import { timeAgo, type Conversation } from '../data/mock'
import { Avatar, Icon, StatusPill } from './ui'

const clock = (t: number) => new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '')
const confTone = (n: number) => (n < 50 ? 'rs-needs_attention' : n < 80 ? 'rs-unresolved' : 'rs-resolved')
const sentTone = (s: string) => (s === 'Frustrated' ? 'rs-needs_attention' : s === 'Positive' ? 'rs-resolved' : 'rs-neutral')
const AiMark = ({ size = 36 }: { size?: number }) => <span className="rs-aimark" style={{ width: size, height: size }}><Icon icon={GoogleGeminiIcon} size={size * 0.56} /></span>

function Thread({ c }: { c: Conversation }) {
  const { dispatch } = useStore(), { user } = useAuth()
  const [text, setText] = useState(''), end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [c.messages.length])
  const send = () => { const t = text.trim(); if (!t) return; dispatch({ type: 'send', id: c.id, text: t, agent: user?.name ?? 'Support agent' }); setText('') }
  return (
    <div className="rs-thread">
      <div className="rs-msgs">
        {c.messages.map(m => (
          <div className="rs-m" key={m.id}>
            {m.from === 'customer' ? <Avatar c={c} size={36} /> : m.from === 'ai' ? <AiMark /> : <Avatar c={{ name: c.agent, avatar: c.agent.startsWith('Daniel Gbesimowo') ? 'daniel' : null }} size={36} />}
            <div><div className="rs-m-h"><b>{m.from === 'customer' ? c.name : m.from === 'ai' ? 'Support AI' : c.agent}</b><span>{clock(m.at)}</span></div><p className={m.from === 'customer' ? 'cu' : m.from === 'ai' ? 'ai' : 'ag'}>{m.text}</p></div>
          </div>))}
        <div ref={end} />
      </div>
      <div className="rs-compose"><Icon icon={AttachmentIcon} size={24} /><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={c.human ? 'Type a message' : 'Take over to reply'} disabled={!c.human} aria-label="Message" />
        <button className={`rs-send ${text.trim() ? 'on' : ''}`} disabled={!text.trim() || !c.human} onClick={send} aria-label="Send"><Icon icon={SentIcon} size={24} /></button></div>
    </div>
  )
}

export default function ConversationDetail() {
  const { id = '' } = useParams()
  const { get, dispatch } = useStore(), { user } = useAuth(), nav = useNavigate()
  const c = get(id), [tab, setTab] = useState<'Details' | 'Activity' | 'Notes'>('Details'), [note, setNote] = useState('')
  const me = user?.name ?? 'Support agent'
  if (!c) return <div className="rs-page"><Link className="rs-back" to="/app/conversations"><Icon icon={ArrowLeft02Icon} size={24} />Back to Conversations</Link><p className="rs-empty">This conversation does not exist.</p></div>
  const esc = c.status === 'needs_attention' && !c.human
  const events = [{ t: c.createdAt, l: 'Conversation started', d: c.preview }, ...c.messages.slice(1).map(m => ({ t: m.at, l: m.from === 'ai' ? 'Support AI replied' : m.from === 'agent' ? `${c.agent} replied` : 'Customer replied', d: m.text })), ...(esc ? [{ t: c.createdAt + 20_000, l: 'Escalation recommended', d: `AI confidence dropped to ${c.confidence}%` }] : [])].sort((a, b) => a.t - b.t)
  return (
    <div className="rs-page">
      <Link className="rs-back" to="/app/conversations"><Icon icon={ArrowLeft02Icon} size={24} />Back to Conversations</Link>
      <div className="rs-detail">
        <div className="rs-dl">
          <div className="rs-card">
            <div className="rs-dhead"><span className="rs-cu"><Avatar c={c} size={56} /><span><b>{c.name}</b><small>{c.email}</small></span></span>
              <span className="rs-dhead-r"><span className="rs-seen"><i />Last seen <b>{timeAgo(c.createdAt)}</b></span><Icon icon={MoreVerticalIcon} size={24} /></span></div>
            <div className="rs-dbody">
              <div className="rs-dtitle"><h3>{c.issue}</h3><StatusPill s={c.status} /><span className="rs-clock"><Icon icon={Clock01Icon} size={24} />{timeAgo(c.createdAt)}</span></div>
              <p className="rs-sum">{c.summary}</p>
              <div className="rs-infos">
                <div className="rs-info"><span>AI confidence</span><b className={c.confidence < 50 ? 'red' : ''}>{c.confidence}%</b></div>
                {esc ? <div className="rs-info warn"><span>Escalation recommended</span><b>Customer is frustrated and the request needs a human decision</b></div> : <div className="rs-info"><span>Handled by</span><b>{c.agent}</b></div>}
              </div>
              {!c.human ? <button className="rs-green" onClick={() => dispatch({ type: 'takeover', ids: [c.id], agent: me })}>Take over conversation</button> : null}
            </div>
          </div>
          <div className="rs-card"><Thread c={c} /></div>
        </div>
        <aside className="rs-dr">
          <div className="rs-tabs">{(['Details', 'Activity', 'Notes'] as const).map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}<i style={{ left: `${['Details', 'Activity', 'Notes'].indexOf(tab) * 33.3}%` }} /></div>
          {tab === 'Details' && <>
            <div className="rs-rc"><div className="rs-rc-top"><span className="rs-cu"><Avatar c={c} size={56} /><span><b>{c.name}</b><small>{c.email}</small></span></span><button className="rs-btn-o" onClick={() => nav(`/app/customers?q=${encodeURIComponent(c.email)}`)}>View profile</button></div><hr className="rs-hr" />
              <ul className="rs-facts"><li><Icon icon={Message02Icon} size={20} />{c.prior} previous conversations.</li><li><Icon icon={UserIcon} size={20} />Member since {c.since}</li><li><Icon icon={Clock01Icon} size={20} />Last interaction {timeAgo(c.createdAt).replace(' ago', '')} ago</li></ul></div>
            <div className="rs-rc"><div className="rs-rc-t"><Icon icon={GoogleGeminiIcon} size={24} />AI Analysis</div><hr className="rs-hr" />
              <div className="rs-kv"><span>Intent</span><i className="rs-pill rs-neutral">{c.intent}</i></div><div className="rs-kv"><span>Confidence</span><i className={`rs-pill ${confTone(c.confidence)}`}>{c.confidence}%</i></div><div className="rs-kv"><span>Sentiment</span><i className={`rs-pill ${sentTone(c.sentiment)}`}>{c.sentiment}</i></div></div>
            <div className="rs-rc"><div className="rs-rc-t"><Icon icon={IdeaIcon} size={24} />Suggested action</div><hr className="rs-hr" /><div className="rs-sug"><b>{c.suggestion.title}</b><p>{c.suggestion.text}</p></div><button className="rs-btn-o" onClick={() => setTab('Notes')}>{c.suggestion.cta}</button></div>
            <div className="rs-rc"><div className="rs-rc-t"><Icon icon={IdeaIcon} size={24} />Quick actions</div><hr className="rs-hr" />
              <div className="rs-qa">{!c.human && <button className="rs-green wide" onClick={() => dispatch({ type: 'takeover', ids: [c.id], agent: me })}>Take over conversation</button>}<button className="rs-btn-o wide" onClick={() => setTab('Notes')}>Add note</button>{c.status !== 'resolved' ? <button className="rs-btn-o wide" onClick={() => dispatch({ type: 'resolve', id: c.id })}>Mark as resolved</button> : <button className="rs-btn-o wide" onClick={() => dispatch({ type: 'reopen', id: c.id })}>Reopen conversation</button>}</div></div>
          </>}
          {tab === 'Activity' && <div className="rs-rc"><div className="rs-rc-t"><Icon icon={Clock01Icon} size={24} />Activity</div><hr className="rs-hr" /><ol className="rs-tl">{events.map((e, i) => <li key={i}><b>{e.l}</b><small>{clock(e.t)} · {e.d.length > 90 ? e.d.slice(0, 90) + '…' : e.d}</small></li>)}</ol></div>}
          {tab === 'Notes' && <div className="rs-rc"><div className="rs-rc-t"><Icon icon={IdeaIcon} size={24} />Internal notes</div><hr className="rs-hr" />
            {c.notes.length === 0 && <p className="rs-plain">No notes yet. Notes are only visible to your team.</p>}
            {c.notes.map(n => <div key={n.id} className="rs-note"><b>{n.by}<small>{timeAgo(n.at)}</small></b><p>{n.text}</p></div>)}
            <textarea className="rs-ta" value={note} onChange={e => setNote(e.target.value)} placeholder="Write a note for your team…" rows={3} aria-label="Note" />
            <button className="rs-green wide" disabled={!note.trim()} onClick={() => { dispatch({ type: 'note', id: c.id, text: note.trim(), by: me }); setNote('') }}>Add note</button></div>}
        </aside>
      </div>
    </div>
  )
}
