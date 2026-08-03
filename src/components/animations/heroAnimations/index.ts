import { gsap } from "gsap"

import { animateSoftwareDeveloperIntro } from "./softwareDeveloperIntro"
import { animateHeroMouseParallax } from "./heroMouseParallax"
import { animateHeroScrollExit } from "../exitAnimations/heroScrollExit"
import { initLetterHoverGlitch } from "./letterHoverGlitch"
import { animateHeroWhiteout } from "../exitAnimations/heroWhiteout"
import { initNameRevealOnHover } from "./nameRevealOnHover"

export function initHeroAnimations(hero: HTMLElement) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) {
    gsap.set(hero.querySelectorAll(".hero-letter"), { x: 0, y: 0, opacity: 1, rotate: 0 })
    return () => {}
  }

  let cleanupFloatTweens = () => {}

  const ctx = gsap.context(() => {
    cleanupFloatTweens = animateSoftwareDeveloperIntro(hero)
    animateHeroScrollExit(hero)
    animateHeroWhiteout(hero)
  }, hero)

  const cleanupMouse = animateHeroMouseParallax(hero)
  const cleanupGlitch = initLetterHoverGlitch(hero)
  const cleanupNameReveal = initNameRevealOnHover(hero)

  return () => {
    ctx.revert()
    cleanupMouse()
    cleanupGlitch()
    cleanupNameReveal()
    cleanupFloatTweens()
  }
}