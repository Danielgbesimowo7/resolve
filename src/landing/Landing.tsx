import { useLayoutEffect, useEffect } from 'react'
import css from './landing.css?inline'
import Sprite from './Sprite'
import MenuOverlay from './MenuOverlay'
import Hero from './Hero'
import TrustedBy from './TrustedBy'
import HowItWorks from './HowItWorks'
import Features from './Features'
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
    el.textContent = css
    el.dataset.landing = 'true'
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
  useEffect(() => {
    document.title = 'Resolve — AI support that gets better with every conversation'
    return initLanding()
  }, [])
  return (
    <>
      <Sprite />
      <MenuOverlay />
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
      <ToTop />
    </>
  )
}
