import gsap from "gsap";

const GREETINGS = [
  "Hola", "Hello", "Bonjour", "Ciao", "Hallo", "Olá",
  "こんにちは", "안녕하세요", "你好", "Привет", "مرحبا", "Namaste"
];

export function playEntranceAnimation(
  overlay: HTMLElement,
  textEl: HTMLElement,
  onComplete: () => void
) {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const letters = hero?.querySelectorAll<HTMLElement>(".hero-letter");

  // Oculta el Hero y sus letras YA, antes de que arranque cualquier
  // animación, para evitar el flash de "SOFTWARE DEVELOPER" ya cargado
  if (hero) gsap.set(hero, { opacity: 0, y: 30 });
  if (letters?.length) gsap.set(letters, { opacity: 0 });

  const tl = gsap.timeline({ onComplete });

  GREETINGS.forEach((word) => {
    tl.call(() => (textEl.textContent = word))
      .fromTo(
        textEl,
        { opacity: 0, scale: 0.7, filter: "blur(8px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.09, ease: "power2.out" }
      )
      .to(
        textEl,
        { opacity: 0, scale: 1.2, filter: "blur(8px)", duration: 0.08, ease: "power2.in" },
        "+=0.02"
      );
  });

  tl.to(overlay, { scale: 1.15, duration: 0.4, ease: "power2.in" }, "-=0.1")
    .to(overlay, { opacity: 0, duration: 0.6, ease: "power3.inOut" }, "-=0.1")
    .set(overlay, { display: "none" })
    .call(() => window.dispatchEvent(new CustomEvent("entrance:complete")));

  if (hero) {
    tl.to(hero, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");
  }
}