// js/pages/freeplay.js
export function initFreeplay() {
  const playBtn = document.getElementById("playBtn");
  const loadingWrap = document.getElementById("loadingWrap");
  const loadingBtnBar = document.getElementById("loadingBtnBar");
  const percentage = document.getElementById("gameLoadingPercentage");

  const heroImg = document.getElementById("heroImg");
  const gameImg = document.getElementById("gameImg");

  if (!playBtn || !loadingWrap || !loadingBtnBar || !heroImg || !gameImg) return;

  let isLoading = false;

  playBtn.addEventListener("click", () => {
    if (isLoading) return;
    isLoading = true;

    playBtn.classList.add("hidden");
    loadingWrap.classList.remove("hidden");
    loadingWrap.classList.add("is-loading");

    loadingBtnBar.style.width = "0%";
    if (percentage) percentage.textContent = "0%";

    const durationMs = 5_000;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const pct = Math.round(t * 100);

      loadingBtnBar.style.width = `${pct}%`;
      if (percentage) percentage.textContent = `${pct}%`;

      if (t < 1) return requestAnimationFrame(tick);

      // Done -> show game image
      // Fade in game image (and optionally fade out hero)
      gameImg.classList.add("is-visible");
      heroImg.classList.add("is-hidden");

      // If you want to remove hero from layout after fade completes:
      window.setTimeout(() => {
        heroImg.classList.add("hidden"); // optional: only if you still want it gone
      }, 850);

      // Hide loading UI
      loadingWrap.classList.add("hidden");
      loadingWrap.classList.remove("is-loading");

      // Go "fullscreen"
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const below = document.getElementById("belowHeroContent");
      if (below) {
        document.documentElement.style.setProperty("--below-hero-maxh", `${below.scrollHeight}px`);
      }
      document.body.classList.add("is-game-loaded");

      // Tell header logic to hide too
      window.dispatchEvent(new CustomEvent("freeplay:loaded"));

      isLoading = false;
    };

    requestAnimationFrame(tick);
  });
}
