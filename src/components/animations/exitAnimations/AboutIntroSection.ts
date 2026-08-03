
import { animateAboutIntroReveal } from "./aboutIntroReveal";

export interface Props {
  greeting?: string;
}

export function aboutIntroSectionHtml({ greeting = "Soy Josias" }: Props = {}): string {
  return `
<section data-about-intro class="flex min-h-screen items-center justify-center bg-white">
  <h2 class="about-intro-text text-4xl font-medium text-neutral-900 sm:text-5xl">
    ${greeting}
  </h2>
</section>
`.trim();
}

export function initAboutIntroSection(): void {
  if (typeof document === "undefined") return;

  const section = document.querySelector<HTMLElement>("[data-about-intro]");
  if (section) {
    animateAboutIntroReveal(section);
  }
}
