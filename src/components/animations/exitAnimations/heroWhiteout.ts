import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Un velo blanco cubre el Hero progresivamente mientras se scrollea,
// sincronizado (scrub) con el mismo tramo que heroScrollExit
export function animateHeroWhiteout(hero: HTMLElement) {
  const whiteout = hero.querySelector<HTMLElement>(".hero-whiteout")
  if (!whiteout) return

  gsap.to(whiteout, {
    opacity: 1,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
  })
}