import { gsap } from "gsap"

// Entrada letra por letra: SOFTWARE entra deslizándose desde fuera de
// pantalla por la izquierda, DEVELOPER entra subiendo desde abajo. Al
// terminar, cada línea completa queda flotando de forma orgánica.
// Devuelve un cleanup para matar los tweens de flotación infinita, ya que
// se crean de forma asíncrona (dentro de un callback del timeline) y por
// lo tanto gsap.context() no los trackea automáticamente.
export function animateSoftwareDeveloperIntro(hero: HTMLElement) {
  const lines = hero.querySelectorAll<HTMLElement>(".hero-title-line")
  if (lines.length < 2) return () => {}

  const [softwareLine, developerLine] = Array.from(lines)
  const softwareLetters = softwareLine.querySelectorAll<HTMLElement>(".hero-letter")
  const developerLetters = developerLine.querySelectorAll<HTMLElement>(".hero-letter")

  if (!softwareLetters.length || !developerLetters.length) return () => {}

  const floatTweens: gsap.core.Tween[] = []

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

  return () => {
    floatTweens.forEach((tween) => tween.kill())
    floatTweens.length = 0
  }
}