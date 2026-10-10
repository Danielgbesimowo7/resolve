import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight02Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { useStore } from '../state/store'
import { useAuth } from '../state/auth'
import { Avatar, Icon } from './ui'

type Member = { name: string; email: string; role: 'Admin' | 'Agent' | 'Viewer' }
const DEFAULTS: Record<string, unknown> = {
  industry: 'SaaS', size: '500 - 1,000', supportEmail: 'Support@acme.com', tz: '(GMT +01:00) Lagos', phone: '+234 801 234 5678', lang: 'English (US)',
  n_new: true, n_ai: true, n_esc: true, n_week: false, threshold: 60, autoKb: true, refundApproval: true, tone: 'Friendly', plan: 'Pro', twofa: false,
  slack: true, google: true, zendesk: false, intercom: false, wsName: 'Acme Corp', domain: 'acme.com',
  team: [{ name: 'Daniel Gbesimowo', email: 'danielgbesimowo7@gmail.com', role: 'Admin' }, { name: 'Daniel Okafor', email: 'daniel.okafor@acme.com', role: 'Agent' }, { name: 'Amara Eze', email: 'amara@acme.com', role: 'Agent' }, { name: 'Tolu Bello', email: 'tolu@acme.com', role: 'Viewer' }] as Member[],
}
const TABS = ['Account', 'Team', 'AI agent', 'Integrations', 'Plan and Billing', 'Workspace'] as const
const PLANS = [{ n: 'Free', p: '$0', d: 'For trying Resolve with a small team' }, { n: 'Pro', p: '$149', d: 'Advanced AI support tools for growing teams' }, { n: 'Business', p: '$349', d: 'Automation and analytics for larger teams' }, { n: 'Enterprise', p: 'Custom', d: 'Security, SSO and dedicated support' }]
const INCLUDES = ['Unlimited conversations', 'Advanced AI agent', 'Team collaboration', 'Data export', 'Detailed analytics', 'Custom knowledge base']

function useSetting<T>(key: string) {
  const { state, dispatch } = useStore()
  return [(state.settings[key] ?? DEFAULTS[key]) as T, (v: T) => dispatch({ type: 'set', key, value: v })] as const
}
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`rs-tg ${on ? 'on' : ''}`} onClick={() => onChange(!on)}><i /></button>
}
function Editable({ k, label }: { k: string; label: string }) {
  const [v, set] = useSetting<string>(k), [edit, setEdit] = useState(false), [d, setD] = useState(v)
  const save = () => { setEdit(false); if (d.trim()) set(d.trim()); else setD(v) }
  return <div className="rs-fld"><span>{label}</span>{edit ? <input autoFocus value={d} onChange={e => setD(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()} aria-label={label} /> : <button onClick={() => { setD(v); setEdit(true) }} title="Click to edit">{v}</button>}</div>
}
const Row = ({ k, t, d }: { k: string; t: string; d: string }) => { const [on, set] = useSetting<boolean>(k); return <div className="rs-trow"><div><b>{t}</b><small>{d}</small></div><Toggle on={on} onChange={set} label={t} /></div> }
function download(name: string, text: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = name; a.click(); URL.revokeObjectURL(a.href) }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  return <><div className="rs-blur" onClick={onClose} /><div className="rs-modal" role="dialog" aria-label={title}><div className="rs-ttl">{title}</div>{children}</div></>
}

export default function Settings() {
  const { conversations, state, dispatch } = useStore(), { user } = useAuth()
  const [sp, setSp] = useSearchParams()
  const tab = TABS.find(t => t.toLowerCase().replace(/ /g, '') === (sp.get('tab') ?? '').replace(/-/g, '')) ?? 'Account'
  const [plan, setPlan] = useSetting<string>('plan'), [team, setTeam] = useSetting<Member[]>('team'), [twofa, setTwofa] = useSetting<boolean>('twofa'), [thr, setThr] = useSetting<number>('threshold'), [tone, setTone] = useSetting<string>('tone'), [wsName] = useSetting<string>('wsName')
  const [modal, setModal] = useState<'pw' | 'login' | null>(null), [inv, setInv] = useState(''), [pw, setPw] = useState(''), [pwOk, setPwOk] = useState(false), [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }
  const integ = ['slack', 'google', 'zendesk', 'intercom'] as const
  const names = { slack: 'Slack', google: 'Google workspace', zendesk: 'Zendesk', intercom: 'Intercom' }
  const [ints, setInts] = [integ.map(k => state.settings[k] ?? DEFAULTS[k]) as boolean[], (k: string, v: boolean) => dispatch({ type: 'set', key: k, value: v })] as const
  const go = (t: string) => setSp({ tab: t.toLowerCase().replace(/ /g, '-') })
  const me = { name: user?.name ?? 'You', avatar: user?.name.startsWith('Daniel') ? 'daniel' : null }
  const tIdx = TABS.indexOf(tab)
  const exportData = () => { download('resolve-export.json', JSON.stringify({ exportedAt: new Date().toISOString(), conversations: conversations.length, settings: state.settings }, null, 2)); flash('Data export downloaded') }
  return (
    <div className="rs-page">
      <div className="rs-head sub"><p>Manage your account, team, AI agent, and workspace settings.</p></div>
      <div className="rs-stabs" role="tablist">{TABS.map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => go(t)}>{t}</button>)}<i style={{ ['--i' as string]: tIdx }} /></div>
      <div className="rs-set">
        <div className="rs-setL">
          {tab === 'Account' && <>
            <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>Organization details</b><small>Manage your company information and workspace settings.</small></div></div>
              <div className="rs-org"><span className="rs-wsav">{wsName[0]}</span><div><b>{wsName}</b><small>{DEFAULTS.domain as string}</small></div></div><hr className="rs-hr" />
              <div className="rs-grid2"><Editable k="industry" label="Industry" /><Editable k="size" label="Company size" /><Editable k="supportEmail" label="Support email" /><Editable k="tz" label="Timezone" /></div></div>
            <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>Account settings</b><small>Update your profile and notification preferences</small></div><button className="rs-btn-o" onClick={() => flash('Profile is managed by your sign-in details in this demo')}>Edit profile</button></div>
              <div className="rs-org"><Avatar c={me} size={56} /><div><b>{user?.name}</b><small>{user?.email}</small></div></div><hr className="rs-hr" />
              <div className="rs-grid2"><Editable k="phone" label="Phone number" /><Editable k="lang" label="Language" /><Editable k="tz" label="Timezone" /></div>
              <div className="rs-sh" style={{ marginTop: 8 }}><div><b>Notifications</b><small>Choose what you want to be notified about</small></div></div>
              <Row k="n_new" t="New conversation" d="Get notified when new customer conversations arrive." /><Row k="n_ai" t="AI performance alert" d="Get notified about drops in AI resolution rate or confidence" /><Row k="n_esc" t="Customer escalations" d="Get notified when conversations require human attention" /><Row k="n_week" t="Weekly digest" d="Receive a summary of key metrics and insights." /></div></>}
          {tab === 'Team' && <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>Team members</b><small>{team.length} people have access to this workspace.</small></div></div>
            <form className="rs-inv" onSubmit={e => { e.preventDefault(); const em = inv.trim(); if (!/^\S+@\S+\.\S+$/.test(em)) return flash('Enter a valid email'); setTeam([...team, { name: em.split('@')[0].replace(/^./, c => c.toUpperCase()), email: em, role: 'Agent' }]); setInv(''); flash(`Invite sent to ${em}`) }}><input value={inv} onChange={e => setInv(e.target.value)} placeholder="Invite by email" aria-label="Invite by email" /><button className="rs-green" type="submit">Send invite</button></form>
            <div className="rs-tbl">{team.map((m, i) => <div key={m.email} className="rs-tr rs-cT"><span className="rs-cu"><Avatar c={{ name: m.name, avatar: m.name.startsWith('Daniel G') ? 'daniel' : null }} size={40} /><span><b>{m.name}</b><small>{m.email}</small></span></span>
              <span><label className="rs-dd"><span>{m.role}</span><select value={m.role} disabled={i === 0} onChange={e => setTeam(team.map((x, j) => (j === i ? { ...x, role: e.target.value as Member['role'] } : x)))} aria-label={`Role for ${m.name}`}>{['Admin', 'Agent', 'Viewer'].map(r => <option key={r}>{r}</option>)}</select></label></span>
              <span className="rs-end">{i > 0 && <button className="rs-btn-o" onClick={() => setTeam(team.filter(x => x.email !== m.email))}>Remove</button>}</span></div>)}</div></div>}
          {tab === 'AI agent' && <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>AI agent</b><small>Control how your AI handles customer conversations.</small></div></div>
            <div className="rs-trow"><div><b>AI agent is {state.aiActive ? 'active' : 'paused'}</b><small>When paused, every conversation goes straight to your team.</small></div><Toggle on={state.aiActive} onChange={v => dispatch({ type: 'ai', on: v })} label="AI agent active" /></div>
            <div className="rs-trow col"><div><b>Escalation threshold: {thr}%</b><small>The AI hands over to a human when its confidence drops below this level.</small></div><input type="range" min={20} max={95} value={thr} onChange={e => setThr(Number(e.target.value))} aria-label="Escalation threshold" /></div>
            <Row k="autoKb" t="Suggest knowledge updates" d="Let the AI recommend articles to add when it struggles." /><Row k="refundApproval" t="Require approval for refunds" d="A teammate approves refunds before the AI confirms them." />
            <div className="rs-trow"><div><b>Tone of voice</b><small>How the AI sounds when it replies.</small></div><label className="rs-dd"><span>{tone}</span><select value={tone} onChange={e => setTone(e.target.value)} aria-label="Tone of voice">{['Friendly', 'Professional', 'Concise'].map(t => <option key={t}>{t}</option>)}</select></label></div></div>}
          {tab === 'Integrations' && <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>Integrations</b><small>Connect the tools your team already uses.</small></div></div>
            {integ.map((k, i) => <div className="rs-trow" key={k}><div><b>{names[k]}</b><small>{ints[i] ? 'Connected' : 'Not connected'}</small></div><button className={ints[i] ? 'rs-btn-o' : 'rs-green'} onClick={() => { setInts(k, !ints[i]); flash(`${names[k]} ${ints[i] ? 'disconnected' : 'connected'}`) }}>{ints[i] ? 'Disconnect' : 'Connect'}</button></div>)}</div>}
          {tab === 'Plan and Billing' && <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>Plan and billing</b><small>Choose the plan that fits your team.</small></div></div>
            <div className="rs-plans">{PLANS.map(p => <div key={p.n} className={`rs-pl ${plan === p.n ? 'on' : ''}`}><b>{p.n}</b><strong>{p.p}{p.p.startsWith('$') && p.p !== '$0' ? <small>/month</small> : null}</strong><small>{p.d}</small><button className={plan === p.n ? 'rs-btn-o' : 'rs-green'} disabled={plan === p.n} onClick={() => { setPlan(p.n); flash(`Switched to ${p.n}`) }}>{plan === p.n ? 'Current plan' : p.n === 'Enterprise' ? 'Contact sales' : 'Switch plan'}</button></div>)}</div>
            <div className="rs-trow"><div><b>Payment method</b><small>Visa ending in 4242 · Expires 08/28</small></div><button className="rs-btn-o" onClick={() => flash('Payment methods are managed by your billing provider')}>Update</button></div>
            {['Sep 14, 2026', 'Aug 14, 2026', 'Jul 14, 2026'].map(d => <div className="rs-trow" key={d}><div><b>Invoice · {d}</b><small>{plan === 'Pro' ? '$149.00' : plan === 'Business' ? '$349.00' : '$0.00'} · Paid</small></div><button className="rs-btn-o" onClick={() => download(`invoice-${d}.txt`, `Resolve invoice\nDate: ${d}\nPlan: ${plan}\nStatus: Paid\n`)}>Download</button></div>)}</div>}
          {tab === 'Workspace' && <div className="rs-card rs-pad rs-sc"><div className="rs-sh"><div><b>Workspace</b><small>Name, domain and data for this workspace.</small></div></div>
            <div className="rs-grid2"><Editable k="wsName" label="Workspace name" /><Editable k="domain" label="Domain" /></div><hr className="rs-hr" />
            <div className="rs-trow"><div><b>Export workspace data</b><small>Download a copy of your workspace data.</small></div><button className="rs-btn-o" onClick={exportData}>Export</button></div>
            <div className="rs-trow"><div><b>Reset demo data</b><small>Restore the original sample conversations and settings.</small></div><button className="rs-btn-o" onClick={() => { dispatch({ type: 'reset' }); flash('Demo data reset') }}>Reset</button></div></div>}
        </div>
        <aside className="rs-setR">
          <div className="rs-card rs-pad rs-sc"><div className="rs-ttl">Current plan</div>
            <div className="rs-planbox"><div className="rs-between"><b>{plan}</b><i className="rs-pill rs-resolved">Your plan is active</i></div><small>{PLANS.find(p => p.n === plan)?.d}</small><small>Renews on May 14, 2027</small><button className="rs-green" onClick={() => go('Plan and Billing')}>Manage plan</button></div>
            <b className="rs-incl">Plan includes</b><ul className="rs-ul">{INCLUDES.map(i => <li key={i}><Icon icon={CheckmarkCircle01Icon} size={24} />{i}</li>)}</ul></div>
          <div className="rs-card rs-pad rs-sc"><div className="rs-ttl">Security</div>
            <button className="rs-nav" onClick={() => setModal('pw')}>Change password<Icon icon={ArrowRight02Icon} size={24} /></button>
            <div className="rs-nav">Two factor authentication<Toggle on={twofa} onChange={v => { setTwofa(v); flash(`Two factor authentication ${v ? 'enabled' : 'disabled'}`) }} label="Two factor authentication" /></div>
            <button className="rs-nav" onClick={() => setModal('login')}>Login activity<Icon icon={ArrowRight02Icon} size={24} /></button>
            <button className="rs-nav" onClick={exportData}>Data export<Icon icon={ArrowRight02Icon} size={24} /></button></div>
          <div className="rs-card rs-pad rs-sc"><div className="rs-ttl">Integrations</div>{integ.slice(0, 3).map((k, i) => <div className="rs-nav" key={k}><span>{names[k]}<small className={ints[i] ? 'ok' : ''}>{ints[i] ? 'Connected' : 'Not connected'}</small></span><Toggle on={ints[i]} onChange={v => setInts(k, v)} label={names[k]} /></div>)}</div>
          <div className="rs-card rs-pad rs-sc"><div className="rs-ttl">Need help?</div><p className="rs-plain">Our support team is here to help you get the most out of resolve</p><a className="rs-btn-o" href="mailto:support@resolve.app">Contact support</a></div>
        </aside>
      </div>
      {modal === 'pw' && <Modal title="Change password" onClose={() => { setModal(null); setPwOk(false); setPw('') }}>{pwOk ? <p className="rs-plain">Your password has been updated.</p> : <><input className="rs-ta" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password (min. 8 characters)" aria-label="New password" /><div className="rs-pfoot"><button className="rs-btn-o" onClick={() => setModal(null)}>Cancel</button><button className="rs-green" disabled={pw.length < 8} onClick={() => setPwOk(true)}>Update password</button></div></>}</Modal>}
      {modal === 'login' && <Modal title="Login activity" onClose={() => setModal(null)}>{[['Chrome on Windows · Lagos, NG', 'Now'], ['Safari on iPhone · Lagos, NG', 'Yesterday'], ['Chrome on Windows · Lagos, NG', '3 days ago']].map(([a, b]) => <div className="rs-trow" key={a + b}><div><b>{a}</b><small>{b}</small></div></div>)}<div className="rs-pfoot"><button className="rs-green" onClick={() => setModal(null)}>Done</button></div></Modal>}
      {toast && <div className="rs-toast" role="status">{toast}</div>}
    </div>
  )
}
