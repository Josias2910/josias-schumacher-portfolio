import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function animateAboutIntroReveal(section: HTMLElement) {
  const text = section.querySelector<HTMLElement>(".about-intro-text")
  if (!text) return

  gsap.fromTo(
    text,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: section, start: "top 75%" } }
  )
}