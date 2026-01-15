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

    // Swap buttons
    playBtn.classList.add("hidden");
    loadingWrap.classList.remove("hidden");
    loadingWrap.classList.add("is-loading");

    // Reset progress
    loadingBtnBar.style.width = "0%";
    if (percentage) percentage.textContent = "0%";

    const durationMs = 10_000;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const pct = Math.round(t * 100);

      // Make bar undeniably visible (red) and update width
      loadingBtnBar.style.width = `${pct}%`;
      if (percentage) percentage.textContent = `${pct}%`;

      if (t < 1) return requestAnimationFrame(tick);

      // Done -> show game image
      heroImg.classList.add("hidden");
      gameImg.classList.remove("hidden");

      // Hide loading UI
      loadingWrap.classList.add("hidden");
      loadingWrap.classList.remove("is-loading");

      isLoading = false;
    };

    requestAnimationFrame(tick);
  });
}
