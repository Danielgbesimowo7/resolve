import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../state/auth'

// Demo sign-in: any details work and are kept only in this browser (localStorage).
export default function Login() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const signup = sp.get('mode') === 'signup'
  const [name, setName] = useState(''), [email, setEmail] = useState('daniel@acme.com'), [pw, setPw] = useState('')
  if (user) return <Navigate to="/app" replace />
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim() || (email.split('@')[0] || 'You').replace(/^./, c => c.toUpperCase())
    login({ name: n, email: email.trim() }); nav('/app')
  }
  return (
    <div className="rs-login">
      <form onSubmit={submit} className="rs-lcard">
        <Link to="/" className="rs-logo"><svg viewBox="0 0 32 32" width="26" height="26"><rect width="32" height="32" rx="9" fill="#01c88a" /><path d="M16 6l2.4 7.6L26 16l-7.6 2.4L16 26l-2.4-7.6L6 16l7.6-2.4z" fill="#fff" /></svg>Resolve</Link>
        <h2>{signup ? 'Create your workspace' : 'Welcome back'}</h2>
        <p>{signup ? 'Start monitoring your AI conversations.' : 'Log in to see what your AI is doing.'}</p>
        {signup && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Daniel Gbesimowo" autoComplete="name" /></label>}
        <label>Work email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input type="password" required minLength={4} value={pw} onChange={e => setPw(e.target.value)} placeholder="Any password works in this demo" autoComplete="current-password" /></label>
        <button className="rs-green wide" type="submit">{signup ? 'Create workspace' : 'Log in'}</button>
        <small>{signup ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/login?mode=signup">Sign up</Link></>}</small>
      </form>
    </div>
  )
}
