import { gsap } from "gsap"

// Caracteres "matrix-style" usados para el scramble de corrupción
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ"
const GLITCH_COLORS = ["#5eead4", "#f472b6", "#a3e635", "#ffffff"]

function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

function randomColor() {
  return GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)]
}

// Prepara cada letra una sola vez: mueve el caracter visible a un span
// propio (.hero-letter-main) y agrega dos "fantasmas" (cian/magenta)
// superpuestos, ocultos por defecto. Durante el glitch esos fantasmas
// se desplazan unos px y el main suma un glow (drop-shadow) — la suma
// de ambas cosas es lo que hace que el efecto "sangre" alrededor de la
// letra en vez de quedar encerrado en su caja.
function setupLetter(letter: HTMLElement) {
  if (letter.dataset.ready === "true") return
  letter.dataset.ready = "true"

  const original = letter.textContent ?? ""
  letter.dataset.originalChar = original
  letter.textContent = ""
  letter.style.position = "relative"
  letter.style.display = "inline-block"

  const main = document.createElement("span")
  main.className = "hero-letter-main"
  main.textContent = original
  letter.appendChild(main)

  ;[
    { color: "#5eead4", z: "-1" },
    { color: "#f472b6", z: "1" },
  ].forEach(({ color, z }) => {
    const ghost = document.createElement("span")
    ghost.setAttribute("aria-hidden", "true")
    ghost.dataset.role = "hero-letter-ghost"
    ghost.textContent = original
    Object.assign(ghost.style, {
      position: "absolute",
      inset: "0",
      color,
      opacity: "0",
      pointerEvents: "none",
      mixBlendMode: "screen",
      zIndex: z,
    })
    letter.appendChild(ghost)
  })
}

function corruptLetter(letter: HTMLElement) {
  if (letter.dataset.glitching === "true") return
  letter.dataset.glitching = "true"

  const original = letter.dataset.originalChar ?? ""
  if (original === "\u00A0") {
    letter.dataset.glitching = "false"
    return
  }

  const main = letter.querySelector<HTMLElement>(".hero-letter-main")!
  const ghosts = letter.querySelectorAll<HTMLElement>('[data-role="hero-letter-ghost"]')

  const cycles = 6
  const tl = gsap.timeline({
    onComplete: () => {
      main.textContent = original
      ghosts.forEach((g) => (g.textContent = original))
      letter.dataset.glitching = "false"
    },
  })

  for (let i = 0; i < cycles; i++) {
    tl.call(() => {
      const char = randomGlitchChar()
      main.textContent = char
      ghosts.forEach((g) => (g.textContent = char))
    }, undefined, `+=${0.02 + i * 0.008}`)
      .to(main, {
        skewX: () => gsap.utils.random(-18, 18),
        color: () => randomColor(),
        filter: () => `drop-shadow(0 0 6px ${randomColor()})`,
        duration: 0.035,
        ease: "none",
      }, "<")
      .to(ghosts, {
        opacity: () => gsap.utils.random(0.4, 0.85),
        x: () => gsap.utils.random(-7, 7),
        y: () => gsap.utils.random(-5, 5),
        skewX: () => gsap.utils.random(-18, 18),
        duration: 0.035,
        ease: "none",
      }, "<")
  }

  tl.to(main, { skewX: 0, color: "", filter: "none", duration: 0.08, ease: "power2.out" })
    .to(ghosts, { opacity: 0, x: 0, y: 0, skewX: 0, duration: 0.08, ease: "power2.out" }, "<")
}

export function initLetterHoverGlitch(hero: HTMLElement) {
  const letters = hero.querySelectorAll<HTMLElement>(".hero-title .hero-letter")
  if (!letters.length) return () => {}

  gsap.set(letters, { display: "inline-block", force3D: true })
  letters.forEach(setupLetter)

  const onPointerEnter = (event: Event) => {
    corruptLetter(event.currentTarget as HTMLElement)
  }

  letters.forEach((letter) => letter.addEventListener("pointerenter", onPointerEnter))

  return () => {
    letters.forEach((letter) => letter.removeEventListener("pointerenter", onPointerEnter))
  }
}