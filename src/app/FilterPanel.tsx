import { useEffect, useState } from 'react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { CHANNELS, PLANS, type Channel } from '../data/mock'
import { Dd, Icon } from './ui'

export interface Filters { channels: Channel[]; intent: string; plan: string; sentiment: string }
export const NO_FILTERS: Filters = { channels: [], intent: 'all', plan: 'all', sentiment: 'all' }
const INTENTS = ['Billing', 'Account', 'Technical', 'Product', 'Shipping']
const SENTIMENTS = ['Frustrated', 'Neutral', 'Positive']

function Select({ label, value, onChange, options, all }: { label: string; value: string; onChange: (v: string) => void; options: string[]; all: string }) {
  return (
    <div className="rs-fg"><b>{label}</b>
      <Dd cls="rs-sel" label={label} value={value} onChange={onChange} options={[['all', all], ...options.map(o => [o, o] as [string, string])]} display={value === 'all' ? all : value} />
    </div>
  )
}

export default function FilterPanel({ value, counts, onApply, onClose }: { value: Filters; counts: Record<string, number>; onApply: (f: Filters) => void; onClose: () => void }) {
  const [f, setF] = useState<Filters>(value)
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  const set = (p: Partial<Filters>) => { const n = { ...f, ...p }; setF(n); onApply(n) }
  return (
    <>
      <div className="rs-blur" onClick={onClose} />
      <aside className="rs-panel" role="dialog" aria-label="Filter conversations">
        <button className="rs-back" onClick={onClose}><Icon icon={ArrowLeft02Icon} size={24} />Back to Conversations</button>
        <hr className="rs-hr" />
        <div className="rs-pcard">
          <div className="rs-pcard-h">Filter by</div>
          <div className="rs-fg"><b>Channels</b>
            <ul className="rs-chl">{CHANNELS.map(c => <li key={c}><label><input className="rs-cb" type="checkbox" checked={f.channels.includes(c)} onChange={() => set({ channels: f.channels.includes(c) ? f.channels.filter(x => x !== c) : [...f.channels, c] })} />{c}</label><span>{(counts[c] ?? 0).toLocaleString()}</span></li>)}</ul></div>
          <Select label="Intent" value={f.intent} onChange={v => set({ intent: v })} options={INTENTS} all="All intents" />
          <Select label="Customer plan" value={f.plan} onChange={v => set({ plan: v })} options={PLANS} all="All plans" />
          <Select label="Sentiment" value={f.sentiment} onChange={v => set({ sentiment: v })} options={SENTIMENTS} all="All sentiments" />
          <button className="rs-btn-o" style={{ width: '100%', height: 48 }} onClick={() => { setF(NO_FILTERS); onApply(NO_FILTERS) }}>Reset filters</button>
        </div>
      </aside>
    </>
  )
}
