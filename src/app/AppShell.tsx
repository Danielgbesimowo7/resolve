import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Analytics01Icon, ArrowDown01Icon, BotIcon, CommandIcon, Home04Icon, LibrariesIcon, Message02Icon, Search01Icon, Setting07Icon, UserMultipleIcon, GoogleGeminiIcon, ArrowRight02Icon, Menu01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
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

// The exact bell button from the design (bordered square, green unread dot).
const Bell = ({ unread }: { unread: boolean }) => (
  <svg viewBox="0 0 31 32" fill="none" aria-hidden="true" className={unread ? '' : 'none'}>
    <rect x="0.419" y="0.419" width="30.052" height="31.026" rx="7.128" fill="#fff" stroke="#EAEAEA" strokeWidth="0.839" />
    <path d="M9.1036 20.9635H21.7873C22.3976 20.9635 22.7028 20.9635 22.8794 20.8756C23.2225 20.7047 23.4061 20.3228 23.3251 19.9481C23.2836 19.7552 23.0929 19.517 22.7117 19.0404L22.5694 18.8625C22.1871 18.3847 21.996 18.1458 21.8342 17.8952C21.3313 17.1162 21.0202 16.2291 20.9262 15.3067C20.896 15.0101 20.896 14.7041 20.896 14.0922V12.9974C20.896 12.6081 20.896 12.4134 20.8852 12.2491C20.7201 9.72963 18.7133 7.72278 16.1939 7.55765C16.0295 7.54688 15.8348 7.54688 15.4455 7.54688C15.0562 7.54688 14.8615 7.54688 14.6971 7.55765C12.1777 7.72278 10.1709 9.72963 10.0057 12.2491C9.99497 12.4134 9.99497 12.6081 9.99497 12.9974V14.0922C9.99497 14.7041 9.99497 15.0101 9.96474 15.3067C9.87077 16.2291 9.5596 17.1162 9.05675 17.8952C8.89501 18.1458 8.70387 18.3847 8.32163 18.8625L8.1793 19.0404C7.79807 19.517 7.60746 19.7552 7.56583 19.9481C7.48493 20.3228 7.66847 20.7047 8.01162 20.8756C8.18821 20.9635 8.49334 20.9635 9.1036 20.9635Z" stroke="#141B34" strokeWidth="1.25781" />
    <path d="M18.7996 20.9636C18.7996 22.816 17.2979 24.3177 15.4455 24.3177C13.593 24.3177 12.0913 22.816 12.0913 20.9636" stroke="#141B34" strokeWidth="1.25781" strokeLinecap="round" strokeLinejoin="round" />
    <circle className="dot" cx="21.8033" cy="8.38544" r="4.61198" fill="#01C88A" stroke="#fff" strokeWidth="0.838542" />
  </svg>
)

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
  const needsAll = conversations.filter(c => c.status === 'needs_attention'), needs = needsAll.slice(0, 4)
  const rate = computeStats(conversations, state.range).aiRate
  const title = TITLES[loc.pathname] ?? (loc.pathname.startsWith('/app/customers') ? 'Customers' : loc.pathname.startsWith('/app/conversations') ? 'Conversations' : 'Resolve')
  const me = { name: user?.name ?? 'You', avatar: user?.name.startsWith('Daniel') ? 'daniel' : null }

  return (
    <div className="rs-app">
      <aside className={`rs-side ${open ? 'open' : ''}`}>
        <Link to="/" className="rs-logo"><svg viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" rx="9" fill="#01c88a" /><path d="M16 6l2.4 7.6L26 16l-7.6 2.4L16 26l-2.4-7.6L6 16l7.6-2.4z" fill="#fff" /></svg>Resolve</Link>
        <hr className="rs-hr" />
        <button className="rs-ws" type="button" aria-label="Workspace: Acme"><span className="rs-ws-l"><span className="rs-wsav">A</span><span><b>Acme</b><small>Support workspace</small></span></span><span className="rs-chev"><Icon icon={ArrowDown01Icon} size={24} className="up" /><Icon icon={ArrowDown01Icon} size={24} /></span></button>
        <div className="rs-menu">{NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end} className="rs-it"><Icon icon={n.icon} size={24} />{n.label}</NavLink>)}</div>
        <hr className="rs-hr" />
        <div className="rs-menu">{NAV2.map(n => <NavLink key={n.to} to={n.to} className="rs-it"><Icon icon={n.icon} size={24} />{n.label}</NavLink>)}</div>
        <div className="rs-agent"><div className="rs-agent-h"><span><i className="rs-agent-ico"><Icon icon={GoogleGeminiIcon} size={24} /></i>AI agent</span>
          <button type="button" className={`rs-live ${state.aiActive ? '' : 'off'}`} aria-pressed={state.aiActive} onClick={() => dispatch({ type: 'ai', on: !state.aiActive })}><i />{state.aiActive ? 'Active' : 'Paused'}</button></div>
          <small>{state.aiActive ? `Handling ${rate.toFixed(1)}% of conversations` : 'Paused: conversations go to your team'}</small>
          <Link to="/app/settings" className="rs-btn-o">View settings <Icon icon={ArrowRight02Icon} size={24} /></Link></div>
      </aside>
      {open && <div className="rs-scrim" onClick={() => setOpen(false)} />}
      <div className="rs-col">
        <header className="rs-top">
          <div className="rs-top-l"><button className="rs-burger" aria-label="Open menu" onClick={() => setOpen(true)}><Icon icon={Menu01Icon} /></button><span>{title}</span></div>
          <div className="rs-top-r">
            <form className="rs-search" onSubmit={e => { e.preventDefault(); nav(`/app/conversations?q=${encodeURIComponent(q)}`) }}>
              <Icon icon={Search01Icon} size={24} /><input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything" aria-label="Search conversations" />
              <span className="rs-keys"><kbd><Icon icon={CommandIcon} size={24} /></kbd><kbd>K</kbd></span>
            </form>
            <div className="rs-rel" ref={bellRef}>
              <button className="rs-bell" aria-label="Notifications" onClick={() => setBell(b => !b)}><Bell unread={needsAll.length > 0} /></button>
              {bell && <div className="rs-pop"><b>Needs attention <em>{needsAll.length}</em></b>{needs.map(c => <Link key={c.id} to={`/app/conversations/${c.id}`} onClick={() => setBell(false)}><Avatar c={c} size={32} /><span>{c.name}<small>{c.issue}</small></span></Link>)}{needs.length === 0 && <p>You're all caught up.</p>}<Link className="rs-all" to="/app/conversations" onClick={() => setBell(false)}>View all conversations</Link></div>}
            </div>
            <div className="rs-rel" ref={menuRef}>
              <button className="rs-prof" onClick={() => setMenu(m => !m)}><span className="rs-prof-l"><Avatar c={me} size={40} /><span><b>{user?.name}</b><small>Support manager</small></span></span><Icon icon={ArrowDown01Icon} size={24} /></button>
              {menu && <div className="rs-pop"><small>{user?.email}</small><button onClick={() => { dispatch({ type: 'reset' }); setMenu(false) }}>Reset demo data</button><button onClick={() => { logout(); nav('/') }}><Icon icon={Logout01Icon} size={20} />Log out</button></div>}
            </div>
          </div>
        </header>
        <main className="rs-main"><Outlet /></main>
      </div>
    </div>
  )
}
