import { useLayoutEffect, useEffect } from 'react'
import css from './landing.css?inline'
import v2css from './v2.css?inline'
import Sprite from './Sprite'
import MenuOverlay from './MenuOverlay'
import Hero from './Hero'
import TrustedBy from './TrustedBy'
import HowItWorks from './HowItWorks'
import Features from './Features'
import Integrations from './Integrations'
import Pricing from './Pricing'
import Faq from './Faq'
import Cta from './Cta'
import Footer from './Footer'
import ToTop from './ToTop'
import { initLanding } from './effects'

// Landing styles are injected only while this route is mounted, so they never leak into the dashboard app.
export default function Landing() {
  useLayoutEffect(() => {
    const el = document.createElement('style')
    el.textContent = css + v2css
    el.dataset.landing = 'true'
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
  useEffect(() => {
    document.title = 'Resolve — AI support that gets better with every conversation'
    const stopLanding = initLanding()
    return () => { stopLanding() }
  }, [])
  return (
    <>
      <Sprite />
      <MenuOverlay />
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <Features />
      <Integrations />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
      <ToTop />
    </>
  )
}
