import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Analytics01Icon, ArrowDown01Icon, BotIcon, CommandIcon, Home04Icon, LibrariesIcon, Message02Icon, Notification03Icon, Search01Icon, Setting07Icon, UserMultipleIcon, GoogleGeminiIcon, ArrowRight02Icon, Menu01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { Icon, Avatar } from './ui'
import { useAuth } from '../state/auth'
import { useStore } from '../state/store'
import { computeStats } from '../data/mock'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: Home04Icon, end: true },
  { to: '/app/conversations', label: 'Conversations', icon: Message02Icon },
  { to: '/app/ai-performance', label: 'AI performance', icon: BotIcon },
  { to: '/app/knowledge', label: 'Knowledge', icon: LibrariesIcon },
  { to: '/app/customers', label: 'Customers', icon: UserMultipleIcon },
  { to: '/app/analytics', label: 'Analytics', icon: Analytics01Icon },
]
const NAV2 = [
  { to: '/app/teams', label: 'Teams', icon: UserMultipleIcon },
  { to: '/app/settings', label: 'Settings', icon: Setting07Icon },
]
const TITLES: Record<string, string> = { '/app': 'Dashboard', '/app/conversations': 'Conversations', '/app/ai-performance': 'AI performance', '/app/knowledge': 'Knowledge', '/app/customers': 'Customers', '/app/analytics': 'Analytics', '/app/teams': 'Teams', '/app/settings': 'Settings' }

function useOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fn() }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) })
}

export default function AppShell() {
  const { user, logout } = useAuth()
  const { conversations, state, dispatch } = useStore()
  const nav = useNavigate(), loc = useLocation()
  const [open, setOpen] = useState(false), [bell, setBell] = useState(false), [menu, setMenu] = useState(false), [q, setQ] = useState('')
  const bellRef = useRef<HTMLDivElement>(null), menuRef = useRef<HTMLDivElement>(null), searchRef = useRef<HTMLInputElement>(null)
  useOutside(bellRef, () => setBell(false)); useOutside(menuRef, () => setMenu(false))
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => { const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus() } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  const needs = conversations.filter(c => c.status === 'needs_attention').slice(0, 4)
  const needsCount = conversations.filter(c => c.status === 'needs_attention').length
  const rate = computeStats(conversations, state.range).aiRate
  const title = TITLES[loc.pathname] ?? 'Resolve'
  const me = { name: user?.name ?? 'You', avatar: user?.name.startsWith('Daniel') ? 'daniel' : null }

  return (
    <div className="rs-app">
      <aside className={`rs-side ${open ? 'open' : ''}`}>
        <Link to="/" className="rs-logo"><svg viewBox="0 0 32 32" width="22" height="22"><rect width="32" height="32" rx="9" fill="#01c88a" /><path d="M16 6l2.4 7.6L26 16l-7.6 2.4L16 26l-2.4-7.6L6 16l7.6-2.4z" fill="#fff" /></svg>Resolve</Link>
        <div className="rs-ws"><Avatar c={{ name: 'Acme', avatar: 'daniel' }} /><div><b>Acme</b><small>Support workspace</small></div><span className="rs-chev"><Icon icon={ArrowDown01Icon} className="up" /><Icon icon={ArrowDown01Icon} /></span></div>
        <div className="rs-menu">{NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end} className="rs-it"><Icon icon={n.icon} />{n.label}</NavLink>)}<i className="rs-sep" />{NAV2.map(n => <NavLink key={n.to} to={n.to} className="rs-it"><Icon icon={n.icon} />{n.label}</NavLink>)}</div>
        <div className="rs-agent"><div className="rs-agent-h"><span><Icon icon={GoogleGeminiIcon} size={18} />AI agent</span><button className={`rs-sw ${state.aiActive ? 'on' : ''}`} aria-label="Toggle AI agent" onClick={() => dispatch({ type: 'ai', on: !state.aiActive })}><i /></button></div>
          <small>{state.aiActive ? `Active · handling ${rate.toFixed(1)}% of conversations` : 'Paused · conversations go to your team'}</small>
          <Link to="/app/settings" className="rs-btn-o">View settings <Icon icon={ArrowRight02Icon} size={16} /></Link></div>
      </aside>
      {open && <div className="rs-scrim" onClick={() => setOpen(false)} />}
      <div className="rs-col">
        <header className="rs-top">
          <div className="rs-top-l"><button className="rs-burger" aria-label="Open menu" onClick={() => setOpen(true)}><Icon icon={Menu01Icon} /></button><span>{title}</span></div>
          <div className="rs-top-r">
            <form className="rs-search" onSubmit={e => { e.preventDefault(); nav(`/app/conversations?q=${encodeURIComponent(q)}`) }}>
              <Icon icon={Search01Icon} /><input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything" aria-label="Search conversations" />
              <span className="rs-keys"><kbd><Icon icon={CommandIcon} size={16} /></kbd><kbd>K</kbd></span>
            </form>
            <div className="rs-rel" ref={bellRef}>
              <button className="rs-bell" aria-label="Notifications" onClick={() => setBell(b => !b)}><Icon icon={Notification03Icon} />{needsCount > 0 && <i />}</button>
              {bell && <div className="rs-pop rs-notif"><b>Needs attention <em>{needsCount}</em></b>{needs.map(c => <Link key={c.id} to={`/app/conversations?c=${c.id}`} onClick={() => setBell(false)}><Avatar c={c} size={28} /><span>{c.name}<small>{c.issue}</small></span></Link>)}{needs.length === 0 && <p>You're all caught up.</p>}<Link className="rs-all" to="/app/conversations" onClick={() => setBell(false)}>View all conversations</Link></div>}
            </div>
            <div className="rs-rel" ref={menuRef}>
              <button className="rs-prof" onClick={() => setMenu(m => !m)}><Avatar c={me} /><span><b>{user?.name}</b><small>Support manager</small></span><Icon icon={ArrowDown01Icon} /></button>
              {menu && <div className="rs-pop rs-pm"><small>{user?.email}</small><button onClick={() => { dispatch({ type: 'reset' }); setMenu(false) }}>Reset demo data</button><button onClick={() => { logout(); nav('/') }}><Icon icon={Logout01Icon} size={18} />Log out</button></div>}
            </div>
          </div>
        </header>
        <main className="rs-main"><Outlet /></main>
      </div>
    </div>
  )
}
