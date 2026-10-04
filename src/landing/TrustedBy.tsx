import { LOGOS } from './logos'

export default function TrustedBy() {
  return (
    <>
<section className="trusted"><h2 className="reveal">Trusted by</h2><div className="mq reveal"><div className="tk" id="tk" dangerouslySetInnerHTML={{__html: LOGOS.join("").repeat(4)}} /></div></section>
    </>
  )
}
