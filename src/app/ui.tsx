import { HugeiconsIcon } from '@hugeicons/react'
import { FACES } from '../faces'
import { STATUS_LABEL, type Conversation, type Status } from '../data/mock'

type IconData = Parameters<typeof HugeiconsIcon>[0]['icon']
export const Icon = ({ icon, size = 20, className }: { icon: IconData; size?: number; className?: string }) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} color="currentColor" className={className} />
)

const TINTS = ['#0f766e', '#334155', '#7c5a3b', '#b45309', '#1e293b', '#9d174d', '#0369a1', '#475569', '#3f6212', '#3b0a45']
export function Avatar({ c, size = 33 }: { c: Pick<Conversation, 'name' | 'avatar'>; size?: number }) {
  const face = c.avatar ? FACES[c.avatar] : undefined
  const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('')
  const tint = TINTS[[...c.name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % TINTS.length]
  return (
    <span className="rs-av" style={{ width: size, height: size, fontSize: size * 0.38, background: face ? `url("${face}") center/cover` : tint }}>
      {face ? '' : initials}
    </span>
  )
}

export const StatusPill = ({ s }: { s: Status }) => <span className={`rs-pill rs-${s}`}>{STATUS_LABEL[s]}</span>
