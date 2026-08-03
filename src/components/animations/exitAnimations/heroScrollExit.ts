import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Salida por scroll: el fondo hace zoom + parallax vertical y el título
// sube, se achica y se desenfoca gradualmente, sincronizado 1:1 (scrub)
export function animateHeroScrollExit(hero: HTMLElement) {
  const background = hero.querySelector<HTMLElement>(".hero-background")
  const title = hero.querySelector<HTMLElement>(".hero-title")

  if (!background || !title) return

  gsap.set(title, { force3D: true, willChange: "transform, opacity" })

  gsap
    .timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=150%",
        scrub: 0.8,
        pin: true
      },
    })
    .to(background, { scale: 1.15, yPercent: 12, ease: "none", force3D: true, transformOrigin: "50% 30%" }, 0)
    .to(title, { yPercent: -35, opacity: 0, scale: 0.94, filter: "blur(6px)", ease: "none", force3D: true }, 0)
}