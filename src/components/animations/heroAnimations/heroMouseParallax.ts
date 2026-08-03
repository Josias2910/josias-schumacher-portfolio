import { gsap } from "gsap"

// Parallax de mouse: cada capa se mueve a distinta velocidad según el
// cursor. pointermove + quickTo mantienen todo en el compositor (60fps+)
export function animateHeroMouseParallax(hero: HTMLElement) {
  const software = hero.querySelector<HTMLElement>(
    ".hero-title-line:nth-child(1) .hero-title-line-inner",
  )
  const developer = hero.querySelector<HTMLElement>(
    ".hero-title-line:nth-child(2) .hero-title-line-inner",
  )
  const background = hero.querySelector<HTMLElement>(".hero-background")

  if (!software || !developer || !background) return () => {}

  gsap.set(background, { force3D: true, willChange: "transform" })

  const layers = [
    { x: gsap.quickTo(software, "x", { duration: 0.8, ease: "power3.out" }), y: gsap.quickTo(software, "y", { duration: 0.8, ease: "power3.out" }), fx: -28, fy: -14, el: software },
    { x: gsap.quickTo(developer, "x", { duration: 1.05, ease: "power3.out" }), y: gsap.quickTo(developer, "y", { duration: 1.05, ease: "power3.out" }), fx: 18, fy: 9, el: developer },
    { x: gsap.quickTo(background, "x", { duration: 1.5, ease: "power3.out" }), y: gsap.quickTo(background, "y", { duration: 1.5, ease: "power3.out" }), fx: 7, fy: 4, el: background },
  ]

  const onPointerMove = (event: PointerEvent) => {
    const rect = hero.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5

    for (const layer of layers) {
      layer.x(nx * layer.fx)
      layer.y(ny * layer.fy)
    }
  }

  const onPointerLeave = () => {
    for (const layer of layers) {
      gsap.to(layer.el, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(0.6, 0.7)",
        overwrite: "auto",
        force3D: true,
      })
    }
  }

  hero.addEventListener("pointermove", onPointerMove)
  hero.addEventListener("pointerleave", onPointerLeave)

  return () => {
    hero.removeEventListener("pointermove", onPointerMove)
    hero.removeEventListener("pointerleave", onPointerLeave)
  }
}