import { useLocation } from 'react-router-dom'
export default function ComingSoon() {
  const { pathname } = useLocation()
  const name = pathname.split('/').pop()?.replace(/-/g, ' ') ?? ''
  return <div className="rs-soon"><h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2><p>This screen is not built yet. Add its design and it slots into this layout.</p></div>
}
