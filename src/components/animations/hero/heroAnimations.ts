import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const floatTweens: gsap.core.Tween[] = []

// Entrada letra por letra: SOFTWARE entra deslizándose desde fuera de
// pantalla por la izquierda, DEVELOPER entra subiendo desde abajo. Al
// terminar, cada línea completa queda flotando de forma orgánica.
function animateSoftwareDeveloper(hero: HTMLElement) {
  const lines = hero.querySelectorAll<HTMLElement>(".hero-title-line")
  if (lines.length < 2) return

  const [softwareLine, developerLine] = Array.from(lines)
  const softwareLetters = softwareLine.querySelectorAll<HTMLElement>(".hero-letter")
  const developerLetters = developerLine.querySelectorAll<HTMLElement>(".hero-letter")

  if (!softwareLetters.length || !developerLetters.length) return

  gsap.set([softwareLine, developerLine], { force3D: true, willChange: "transform" })
  gsap.set([...softwareLetters, ...developerLetters], { force3D: true, willChange: "transform, opacity" })

  // SOFTWARE arranca fuera de pantalla a la izquierda, con leve giro
  gsap.set(softwareLetters, { x: -140, opacity: 0, rotate: -6 })
  // DEVELOPER arranca por debajo de su posición final
  gsap.set(developerLetters, { y: 90, opacity: 0, rotate: 4 })

  const intro = gsap.timeline({ delay: 0.15 })

  intro.to(softwareLetters, {
    x: 0,
    opacity: 1,
    rotate: 0,
    duration: 1,
    stagger: 0.035,
    ease: "power4.out",
  })

  intro.to(
    developerLetters,
    {
      y: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.9,
      stagger: 0.03,
      ease: "power4.out",
    },
    "-=0.6",
  )

  intro.add(() => {
    floatTweens.push(
      gsap.to(softwareLine, {
        x: 10,
        y: -6,
        rotate: 0.4,
        duration: 4.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
      }),
      gsap.to(developerLine, {
        x: -8,
        y: 5,
        rotate: -0.35,
        duration: 5.8,
        delay: 0.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
      }),
    )
  }, "-=0.2")
}

// Parallax de mouse: cada capa se mueve a distinta velocidad según el
// cursor. pointermove + quickTo mantienen todo en el compositor (60fps+)
function animateHeroMouse(hero: HTMLElement) {
  const software = hero.querySelector<HTMLElement>(
    ".hero-title-line:nth-child(1) .hero-title-line-inner",
  )
  const developer = hero.querySelector<HTMLElement>(
    ".hero-title-line:nth-child(2) .hero-title-line-inner",
  )
  const background = hero.querySelector<HTMLElement>(".hero-background")

  if (!software || !developer || !background) return

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

// Nombre en columna vertical, loop infinito de abajo hacia arriba: la
// pista contiene el contenido duplicado (ver Astro), así que desplazarla
// -50% en el eje Y produce un ciclo perfecto sin salto entre vueltas
function animateMarquee(hero: HTMLElement) {
  const track = hero.querySelector<HTMLElement>(".hero-vertical-marquee-track")
  if (!track) return

  gsap.set(track, { force3D: true, willChange: "transform" })

  gsap.to(track, {
    yPercent: -50,
    duration: 34,
    ease: "none",
    repeat: -1,
  })
}

// Salida por scroll: el fondo hace zoom + parallax vertical y el título
// sube, se achica y se desenfoca gradualmente, sincronizado 1:1 (scrub)
function animateHeroExit(hero: HTMLElement) {
  const background = hero.querySelector<HTMLElement>(".hero-background")
  const title = hero.querySelector<HTMLElement>(".hero-title")

  if (!background || !title) return

  gsap.set(title, { force3D: true, willChange: "transform, opacity" })

  gsap
    .timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    })
    .to(background, { scale: 1.15, yPercent: 12, ease: "none", force3D: true, transformOrigin: "50% 30%" }, 0)
    .to(title, { yPercent: -35, opacity: 0, scale: 0.94, filter: "blur(6px)", ease: "none", force3D: true }, 0)
}

// Punto de entrada: corre todas las animaciones salvo que el usuario tenga
// "reducir movimiento" activado. Devuelve cleanup para React/StrictMode.
export function initHeroAnimations(hero: HTMLElement) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) {
    gsap.set(hero.querySelectorAll(".hero-letter"), { x: 0, y: 0, opacity: 1, rotate: 0 })
    return () => {}
  }

  const ctx = gsap.context(() => {
    animateSoftwareDeveloper(hero)
    animateHeroExit(hero)
    animateMarquee(hero)
  }, hero)

  const cleanupMouse = animateHeroMouse(hero)

  return () => {
    ctx.revert()
    cleanupMouse?.()
    floatTweens.forEach((tween) => tween.kill())
    floatTweens.length = 0
  }
}