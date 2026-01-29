export function initScrollTopBtn() {
  const btn = document.getElementById("scrollTopBtn");
  
  const gameImg = document.getElementById("gameImg");
  const gameImgPaused = document.getElementById("gameImgPaused");

  if (!btn || !gameImg || !gameImgPaused) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    window.dispatchEvent(new CustomEvent("freeplay:unloaded"));

    // Tell trees below to hide too, same way
    const below = document.getElementById("belowHeroContent");
    if (below) {
      document.documentElement.style.setProperty("--below-hero-maxh", `0px`);
    }
    document.body.classList.remove("is-game-loaded");

    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

    // Show pause screen
    gameImg.classList.add("is-hidden");
    gameImg.classList.remove("is-visible");
    gameImgPaused.classList.add("is-visible");
    gameImgPaused.classList.remove("is-hidden");
  });
}
