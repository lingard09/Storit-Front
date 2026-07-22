(function () {
  // ── 추천 상품 (백엔드 연동 시 교체) ──────────────
  const RECOMMENDED = [
    { name: "구글 플레이 기프트 카드", price: "5000원", cookies: 50 },
    { name: "구글 플레이 기프트 카드", price: "5000원", cookies: 50 },
    { name: "구글 플레이 기프트 카드", price: "5000원", cookies: 50 },
  ];

  const pricePill = (n) =>
    `<span class="pd-price"><img src="assets/shop_cookie.svg" alt="" /><span class="pd-price-num">${n}</span></span>`;

  const recoEl = document.querySelector(".pd-reco");
  if (recoEl) {
    recoEl.innerHTML = RECOMMENDED.map(
      (p) => `<div class="pd-reco-card">
        <div class="pd-reco-thumb">
          <img class="pd-gplay-ico" src="assets/gplay_icon.svg" alt="" />
          <img class="pd-gplay-text" src="assets/gplay_text.svg" alt="" />
        </div>
        <p class="pd-reco-name">${p.name}</p>
        <p class="pd-reco-price">${p.price}</p>
        ${pricePill(p.cookies)}
      </div>`
    ).join("");
  }
})();
