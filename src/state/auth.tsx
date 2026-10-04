import { createContext, useContext, useState, type ReactNode } from 'react'

export interface User { name: string; email: string }
interface AuthCtx { user: User | null; login: (u: User) => void; logout: () => void }
const KEY = 'resolve:user'
const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null } })
  const login = (u: User) => { localStorage.setItem(KEY, JSON.stringify(u)); setUser(u) }
  const logout = () => { localStorage.removeItem(KEY); setUser(null) }
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
