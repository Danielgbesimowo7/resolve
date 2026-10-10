import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { buildConversations, type Conversation, type Message, type Note } from '../data/mock'

export type Range = 7 | 14 | 30
interface State { patches: Record<string, Partial<Conversation>>; range: Range; aiActive: boolean; kb: Record<string, { at: number; text: string }>; cnotes: Record<string, Note[]>; settings: Record<string, unknown> }
type Action =
  | { type: 'takeover'; ids: string[]; agent: string }
  | { type: 'resolve'; id: string }
  | { type: 'reopen'; id: string }
  | { type: 'send'; id: string; text: string; agent: string }
  | { type: 'note'; id: string; text: string; by: string }
  | { type: 'set'; key: string; value: unknown }
  | { type: 'kb'; id: string; text: string }
  | { type: 'cnote'; email: string; text: string; by: string }
  | { type: 'range'; range: Range }
  | { type: 'ai'; on: boolean }
  | { type: 'reset' }

const KEY = 'resolve:state:v1'
const initial = (): State => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) return { kb: {}, cnotes: {}, settings: {}, ...s } } catch { /* ignore */ } return { patches: {}, range: 7, aiActive: true, kb: {}, cnotes: {}, settings: {} } }
const BASE = buildConversations()
const byId = new Map(BASE.map(c => [c.id, c]))
const cur = (s: State, id: string): Conversation => ({ ...byId.get(id)!, ...s.patches[id] })
const msg = (c: Conversation, from: Message['from'], text: string): Message => ({ id: `m${c.messages.length}-${Date.now()}`, from, text, at: Date.now() })

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'takeover': {
      const patches = { ...s.patches }
      for (const id of a.ids) {
        const c = cur(s, id)
        if (c.human) continue
        patches[id] = { status: 'human', human: true, agent: a.agent, messages: [...c.messages, msg(c, 'agent', `Hi ${c.name.split(' ')[0]}, this is ${a.agent.split(' ')[0]} from the support team. I've taken over from here.`)] }
      }
      return { ...s, patches }
    }
    case 'resolve': return { ...s, patches: { ...s.patches, [a.id]: { ...s.patches[a.id], status: 'resolved' } } }
    case 'reopen': return { ...s, patches: { ...s.patches, [a.id]: { ...s.patches[a.id], status: cur(s, a.id).human ? 'human' : 'unresolved' } } }
    case 'send': {
      const c = cur(s, a.id)
      const messages = [...c.messages, msg(c, 'agent', a.text)]
      return { ...s, patches: { ...s.patches, [a.id]: { ...s.patches[a.id], messages, human: true, agent: c.human ? c.agent : a.agent, status: c.status === 'resolved' ? 'resolved' : 'human' } } }
    }
    case 'note': { const c = cur(s, a.id); return { ...s, patches: { ...s.patches, [a.id]: { ...s.patches[a.id], notes: [...c.notes, { id: `n${c.notes.length}-${Date.now()}`, by: a.by, text: a.text, at: Date.now() }] } } } }
    case 'range': return { ...s, range: a.range }
    case 'ai': return { ...s, aiActive: a.on }
    case 'cnote': return { ...s, cnotes: { ...s.cnotes, [a.email]: [...(s.cnotes[a.email] ?? []), { id: `cn${Date.now()}`, by: a.by, text: a.text, at: Date.now() }] } }
    case 'set': return { ...s, settings: { ...s.settings, [a.key]: a.value } }
    case 'kb': return { ...s, kb: { ...s.kb, [a.id]: { at: Date.now(), text: a.text } } }
    case 'reset': return { patches: {}, range: 7, aiActive: true, kb: {}, cnotes: {}, settings: {} }
  }
}

interface StoreCtx { state: State; conversations: Conversation[]; get: (id: string) => Conversation | undefined; dispatch: React.Dispatch<Action> }
const Ctx = createContext<StoreCtx>(null as never)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial)
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)) }, [state])
  const conversations = useMemo(() => BASE.map(c => (state.patches[c.id] ? { ...c, ...state.patches[c.id] } : c)), [state.patches])
  const get = (id: string) => (byId.has(id) ? cur(state, id) : undefined)
  return <Ctx.Provider value={{ state, conversations, get, dispatch }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
