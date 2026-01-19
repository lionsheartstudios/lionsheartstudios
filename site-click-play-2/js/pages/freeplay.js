// js/pages/freeplay.js
export function initFreeplay() {
  const playBtn = document.getElementById("playBtn");
  const playBtnContainer = document.getElementById("playButtonContainer");
  const loadingWrap = document.getElementById("loadingWrap");
  const loadingBtnBar = document.getElementById("loadingBtnBar");
  const percentage = document.getElementById("gameLoadingPercentage");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const heroImg = document.getElementById("heroImg");
  const gameImg = document.getElementById("gameImg");
  const gameImgPaused = document.getElementById("gameImgPaused");
  const freeplayHero = document.getElementById("freeplayHero");

  if (
    !playBtn ||
    !playBtnContainer ||
    !loadingWrap ||
    !loadingBtnBar ||
    !heroImg ||
    !gameImg ||
    !gameImgPaused ||
    !freeplayHero
  ) return;

  let isLoading = false;

  const isPausedVisible = () => gameImgPaused.classList.contains("is-visible") && !gameImgPaused.classList.contains("is-hidden");

  const unpauseGame = () => {
    gameImg.classList.add("is-visible");
    gameImg.classList.remove("is-hidden");
    gameImgPaused.classList.add("is-hidden");
    gameImgPaused.classList.remove("is-visible");
    pseudoFullscreenGame();
    console.log("Game unpaused");
  };

  const pseudoFullscreenGame = () => {
    window.dispatchEvent(new CustomEvent("freeplay:loaded"));

    const below = document.getElementById("belowHeroContent");
    if (below) {
      document.documentElement.style.setProperty("--below-hero-maxh", `${below.scrollHeight}px`);
    }
    document.body.classList.add("is-game-loaded");

    if (scrollTopBtn) scrollTopBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
  };

  // Click pause overlay to unpause
  gameImgPaused.addEventListener("click", (e) => {
    e.preventDefault();
    unpauseGame();
  });

  // Click hero: if paused overlay is visible, unpause instead of (or before) other actions
  freeplayHero.addEventListener("click", (e) => {
    if (isPausedVisible()) {
      e.preventDefault();
      unpauseGame();
      return;
    }
    // otherwise do whatever freeplayHero normally does (or nothing)
  });

  playBtn.addEventListener("click", () => {
    if (isLoading) return;
    isLoading = true;

    playBtn.classList.add("hidden");
    loadingWrap.classList.remove("hidden");
    loadingWrap.classList.add("is-loading");

    playBtnContainer.classList.add("clicked");

    pseudoFullscreenGame();

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

      gameImg.classList.add("is-visible");
      heroImg.classList.add("is-hidden");

      window.setTimeout(() => {
        heroImg.classList.add("hidden");
      }, 850);

      loadingWrap.classList.add("hidden");
      loadingWrap.classList.remove("is-loading");

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      isLoading = false;
    };

    requestAnimationFrame(tick);
  });
}
