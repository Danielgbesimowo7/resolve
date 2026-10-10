import int from './int-logos.json'

const Intercom = () => <span className="vlogo-tile" style={{ background: '#0b1f2a', borderRadius: 14 }}><svg viewBox="0 0 24 24" width="34" height="34"><g fill="#fff"><rect x="5" y="5" width="2" height="9" rx="1" /><rect x="9" y="4" width="2" height="11" rx="1" /><rect x="13" y="4" width="2" height="11" rx="1" /><rect x="17" y="5" width="2" height="9" rx="1" /><path d="M5 17c4 2.6 10 2.6 14 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></g></svg></span>
const Salesforce = () => <svg viewBox="0 0 88 60" width="84" height="58"><g fill="#00a1e0"><circle cx="30" cy="22" r="16" /><circle cx="50" cy="20" r="19" /><circle cx="68" cy="30" r="14" /><circle cx="20" cy="38" r="13" /><circle cx="42" cy="40" r="14" /><rect x="20" y="30" width="58" height="22" rx="11" /></g><text x="44" y="37" textAnchor="middle" fontSize="12" fontWeight="500" fill="#fff" fontFamily="Inter,sans-serif">salesforce</text></svg>
const Zendesk = () => <svg viewBox="0 0 24 24" width="56" height="56"><path fill={'#' + int.siZendesk.hex} d={int.siZendesk.path} /></svg>
const Slack = () => <svg viewBox="0 0 54 54" width="40" height="40"><g><path fill="#36c5f0" d="M19.7 5a4.3 4.3 0 100 8.6h4.3V9.3A4.3 4.3 0 0019.7 5zm0 11.5H8.3a4.3 4.3 0 100 8.6h11.4a4.3 4.3 0 000-8.6z" /><path fill="#2eb67d" d="M49 20.8a4.3 4.3 0 10-8.6 0v4.3h4.3a4.3 4.3 0 004.3-4.3zm-11.5 0V9.3a4.3 4.3 0 10-8.6 0v11.5a4.3 4.3 0 108.6 0z" /><path fill="#ecb22e" d="M33.2 49a4.3 4.3 0 100-8.6h-4.3v4.3a4.3 4.3 0 004.3 4.3zm0-11.5h11.5a4.3 4.3 0 100-8.6H33.2a4.3 4.3 0 000 8.6z" /><path fill="#e01e5a" d="M5 33.2a4.3 4.3 0 108.6 0v-4.3H9.3A4.3 4.3 0 005 33.2zm11.5 0v11.5a4.3 4.3 0 108.6 0V33.2a4.3 4.3 0 10-8.6 0z" /></g></svg>
const Teams = () => <svg viewBox="0 0 40 38" width="52" height="50"><circle cx="30" cy="8" r="5" fill="#7b83eb" /><circle cx="19" cy="7" r="6" fill="#5059c9" /><path d="M24 15h12a2 2 0 012 2v9a6 6 0 01-6 6 6 6 0 01-6-6z" fill="#5059c9" /><path d="M10 14h17a2 2 0 012 2v10a9 9 0 01-9 9h0a9 9 0 01-9-9V16a2 2 0 012-2z" fill="#7b83eb" /><rect x="1" y="10" width="19" height="19" rx="3" fill="#4b53bc" /><path d="M6.5 15.5h10v2.2h-3.9V25h-2.2v-7.3H6.5z" fill="#fff" /></svg>

const LOGOS = [<Intercom key="i" />, <Salesforce key="s" />, <Zendesk key="z" />, <Slack key="sl" />, <Teams key="t" />]

export default function Integrations() {
  const set = (k: string) => LOGOS.map((l, n) => <span key={k + n} className="vl">{l}</span>)
  return (
    <section className="sec integ" id="integrations">
      <div className="pillb"><i className="dot"></i>Integrations</div>
      <h2 className="tw" data-t="*Connect* Resolve to the tools your team already uses."></h2>
      <p className="lead reveal">Bring conversations, customer context and support workflows together without changing how your team works.</p>
      <div className="vint2" role="img" aria-label="Intercom, Salesforce, Zendesk, Slack and Microsoft Teams flowing in and out of Resolve">
        <i className="vbeam l" /><i className="vbeam r" />
        <div className="vtrackw">
          <div className="vtrack" aria-hidden="true">
            {[0, 1].map(h => <div key={h} className="vhalf">{set(`a${h}`)}{set(`b${h}`)}{set(`c${h}`)}</div>)}
          </div>
        </div>
        <div className="vhub">
          <i className="vlogo big"><svg viewBox="0 0 24 24" width="22" height="22" style={{ color: '#fff' }}><use href="#h-gem" /></svg></i>
          <b>Resolve</b>
        </div>
      </div>
    </section>
  )
}
