import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store'
import { useAuth } from '../state/auth'
import { Avatar, StatusPill } from './ui'

export default function Drawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { get, dispatch } = useStore()
  const { user } = useAuth()
  const c = get(id), [text, setText] = useState(''), end = useRef<HTMLDivElement>(null)
  const me = user?.name ?? 'Support agent'
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [c?.messages.length, id])
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  if (!c) return null
  const send = () => { const t = text.trim(); if (!t) return; dispatch({ type: 'send', id, text: t, agent: me }); setText('') }
  return (
    <>
      <div className="rs-scrim light" onClick={onClose} />
      <aside className="rs-drawer" role="dialog" aria-label={`Conversation with ${c.name}`}>
        <div className="rs-dh"><span className="rs-cu"><Avatar c={c} size={40} /><span><b>{c.name}</b><small>{c.email}</small></span></span><button className="rs-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="rs-dm"><StatusPill s={c.status} /><span className="rs-mut">{c.issue} · {c.agent}</span><span className="rs-conf" title="AI confidence">AI confidence <b className={c.confidence < 50 ? 'low' : ''}>{c.confidence}%</b></span></div>
        <div className="rs-thread">{c.messages.map(m => <div key={m.id} className={`rs-msg ${m.from}`}><small>{m.from === 'customer' ? c.name : m.from === 'ai' ? 'AI agent' : c.agent}</small><p>{m.text}</p></div>)}<div ref={end} /></div>
        <div className="rs-da">
          {c.human ? <div className="rs-compose"><textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Write a reply…" rows={2} /><button className="rs-green" onClick={send} disabled={!text.trim()}>Send</button></div>
            : <button className="rs-green wide" onClick={() => dispatch({ type: 'takeover', ids: [id], agent: me })}>Take over conversation</button>}
          <div className="rs-da-r">{c.status !== 'resolved' ? <button className="rs-btn-o" onClick={() => dispatch({ type: 'resolve', id })}>Mark resolved</button> : <button className="rs-btn-o" onClick={() => dispatch({ type: 'reopen', id })}>Reopen</button>}</div>
        </div>
      </aside>
    </>
  )
}
