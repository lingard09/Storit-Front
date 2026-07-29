(function () {
  // ── 데이터 (백엔드 연동 시 교체) ─────────────────
  // iconOn: 활성(선택) 시 아이콘. 내부가 닫힌 외곽선 아이콘은 네거티브(갈색 채움+크림 디테일)
  // 버전을 쓰고, 그 외(채움형·열린 외곽선)는 원본 유지.
  const CATEGORIES = [
    { key: "all", label: "전체", icon: "assets/icon_cat_present.svg" },
    { key: "voucher", label: "상품권", icon: "assets/icon_cat_coupon.svg", iconOn: "assets/icon_cat_voucher_active.png" },
    { key: "cvs", label: "편의점", icon: "assets/icon_cat_store.svg", iconOn: "assets/icon_cat_cvs_active.png" },
    { key: "cafe", label: "카페", icon: "assets/icon_cat_coffee.svg", iconOn: "assets/icon_cat_cafe_active.png" },
    { key: "food", label: "음식", icon: "assets/icon_cat_food.svg", iconOn: "assets/icon_cat_food_active.png" },
    { key: "etc", label: "기타", icon: "assets/icon_cat_more.svg", iconOn: "assets/icon_cat_etc_active.png" },
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
    `<span class="sh-price"><img src="assets/shop_cookie_ico.svg" alt="" /><span class="sh-price-num">${n}</span></span>`;

  // 카테고리
  const catsEl = document.querySelector(".sh-cats");
  if (catsEl) {
    catsEl.innerHTML = CATEGORIES.map((c, i) => {
      // CSS 변수의 url()은 이를 사용하는 shop.css(assets/) 기준으로 해석되므로 assets/ 접두사 제거
      const ico = c.icon
        ? `<span class="sh-cat-ico" style="--ico:url('${c.icon.replace("assets/", "")}');--ico-on:url('${(c.iconOn || c.icon).replace("assets/", "")}')"></span>`
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

  // 정렬 드롭다운
  const sortBtn = document.querySelector(".sh-sort");
  const sortMenu = document.querySelector(".sh-sort-menu");
  if (sortBtn && sortMenu) {
    const sortLabel = sortBtn.querySelector(".sh-sort-label");
    const openMenu = (open) => {
      sortMenu.hidden = !open;
      sortBtn.setAttribute("aria-expanded", String(open));
    };
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMenu(sortMenu.hidden);
    });
    sortMenu.addEventListener("click", (e) => {
      const opt = e.target.closest(".sh-sort-opt");
      if (!opt) return;
      sortMenu.querySelectorAll(".sh-sort-opt").forEach((o) => o.classList.remove("is-selected"));
      opt.classList.add("is-selected");
      if (sortLabel) sortLabel.textContent = opt.textContent.trim();
      openMenu(false);
      // TODO: opt.dataset.sort 기준으로 상품 재정렬
    });
    document.addEventListener("click", (e) => {
      if (!sortMenu.hidden && !e.target.closest(".sh-sort-wrap")) openMenu(false);
    });
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
