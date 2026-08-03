import { gsap } from "gsap"

// Un solo dorado para todo el nombre (el mismo tono de "JOSIAS"),
// con sombra + stroke fijos para que se mantenga legible tanto sobre
// el gris oscuro como sobre la niebla clara del fondo del hero.
const NAME_COLOR = "#e7c34c"

export function initNameRevealOnHover(hero: HTMLElement) {
  const trigger = hero.querySelector<HTMLElement>(".hero-title")
  const container = hero.querySelector<HTMLElement>(".hero-name-reveal")
  const letters = hero.querySelectorAll<HTMLElement>(".hero-name-letter")

  if (!trigger || !container || !letters.length) return () => {}

  gsap.set(container, { autoAlpha: 0 })
  gsap.set(letters, {
    force3D: true,
    transformOrigin: "50% 50%",
    color: NAME_COLOR,
    textShadow: "0 2px 6px rgba(0,0,0,0.55), 0 0 16px rgba(0,0,0,0.25)",
    webkitTextStroke: "0.4px rgba(0,0,0,0.25)",
  })

  let currentTl: gsap.core.Timeline | null = null
  const floatTweens: gsap.core.Tween[] = []

  const killFloats = () => {
    floatTweens.forEach((tween) => tween.kill())
    floatTweens.length = 0
  }

  const startFloating = () => {
    killFloats()
    letters.forEach((letter, i) => {
      floatTweens.push(
        gsap.to(letter, {
          y: gsap.utils.random(-6, 6),
          rotate: gsap.utils.random(-3, 3),
          duration: gsap.utils.random(2.2, 3.4),
          delay: i * 0.04,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          force3D: true,
        }),
      )
    })
  }

  const playEnter = () => {
    currentTl?.kill()
    killFloats()

    const tl = gsap.timeline({ onComplete: startFloating })
    currentTl = tl

    tl.set(container, { autoAlpha: 1 })
      .set(letters, {
        scale: 0,
        opacity: 0,
        x: () => gsap.utils.random(-60, 60),
        y: () => gsap.utils.random(-80, 80),
        rotate: () => gsap.utils.random(-120, 120),
      })
      .to(letters, {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1.15,
        duration: 0.55,
        stagger: { each: 0.045, from: "center" },
        ease: "back.out(2.2)",
      })
      .to(letters, {
        scale: 1,
        duration: 0.35,
        stagger: { each: 0.02, from: "center" },
        ease: "elastic.out(1, 0.4)",
      }, "-=0.15")
  }

  const playExit = () => {
    currentTl?.kill()
    killFloats()

    const tl = gsap.timeline({
      onComplete: () => gsap.set(container, { autoAlpha: 0 }),
    })
    currentTl = tl

    tl.to(letters, {
      scale: 0,
      opacity: 0,
      y: 20,
      rotate: 0,
      duration: 0.25,
      stagger: { each: 0.015, from: "edges" },
      ease: "power3.in",
    })
  }

  trigger.addEventListener("pointerenter", playEnter)
  trigger.addEventListener("pointerleave", playExit)

  return () => {
    trigger.removeEventListener("pointerenter", playEnter)
    trigger.removeEventListener("pointerleave", playExit)
    currentTl?.kill()
    killFloats()
  }
}