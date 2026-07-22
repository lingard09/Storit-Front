(function () {
  // ── 데이터 (백엔드 연동 시 교체) ─────────────────
  const CATEGORIES = [
    { key: "all", label: "전체", icon: "assets/icon_cat_present.svg" },
    { key: "voucher", label: "상품권", icon: "assets/icon_cat_coupon.svg" },
    { key: "cvs", label: "편의점", icon: "assets/icon_cat_store.svg" },
    { key: "cafe", label: "카페", icon: "assets/icon_cat_coffee.svg" },
    { key: "food", label: "음식", icon: "assets/icon_cat_food.svg" },
    { key: "etc", label: "기타", icon: "assets/icon_cat_more.svg" },
  ];

  // 추천상품 (가로 스크롤) — 구글 플레이 기프트 카드
  const RECOMMENDED = [
    { name: "구글 플레이 기프트 카드", price: "5000원", cookies: 50 },
    { name: "구글 플레이 기프트 카드", price: "5000원", cookies: 50 },
    { name: "구글 플레이 기프트 카드", price: "5000원", cookies: 50 },
  ];

  // 전체상품 (2열 그리드) — 네이버페이 포인트
  const PRODUCTS = Array.from({ length: 8 }, () => ({
    name: "네이버페이 포인트",
    price: "5,000원",
    cookies: 50,
    thumb: "assets/naverpay.png",
  }));

  const cookiePill = (n) =>
    `<span class="sh-price"><img src="assets/shop_cookie.svg" alt="" /><span class="sh-price-num">${n}</span></span>`;

  // 카테고리
  const catsEl = document.querySelector(".sh-cats");
  if (catsEl) {
    catsEl.innerHTML = CATEGORIES.map((c, i) => {
      const ico = c.icon
        ? `<img class="sh-cat-ico" src="${c.icon}" alt="" />`
        : `<span class="sh-cat-emoji">${c.emoji}</span>`;
      return `<button type="button" class="sh-cat${i === 0 ? " is-active" : ""}" data-cat="${c.key}">
        ${ico}${c.label}
      </button>`;
    }).join("");
    catsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".sh-cat");
      if (!btn) return;
      catsEl.querySelectorAll(".sh-cat").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      // TODO: 카테고리별 상품 필터
    });
  }

  // 추천상품
  const recoEl = document.querySelector(".sh-reco");
  if (recoEl) {
    recoEl.innerHTML = RECOMMENDED.map(
      (p) => `<div class="sh-reco-card" onclick="location.href='product.html'">
        <div class="sh-reco-thumb">
          <img class="sh-gplay-ico" src="assets/gplay_icon.svg" alt="" />
          <img class="sh-gplay-text" src="assets/gplay_text.svg" alt="" />
        </div>
        <p class="sh-reco-name">${p.name}</p>
        <p class="sh-reco-price">${p.price}</p>
        ${cookiePill(p.cookies)}
      </div>`
    ).join("");
  }

  // 전체상품
  const gridEl = document.querySelector(".sh-grid");
  if (gridEl) {
    gridEl.innerHTML = PRODUCTS.map(
      (p) => `<div class="sh-card" onclick="location.href='product.html'">
        <img class="sh-card-thumb" src="${p.thumb}" alt="" />
        <p class="sh-card-name">${p.name}</p>
        <p class="sh-card-price">${p.price}</p>
        ${cookiePill(p.cookies)}
      </div>`
    ).join("");
  }
})();
