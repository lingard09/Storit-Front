(function () {
  // ── 데이터 (백엔드 연동 시 교체) ─────────────────
  const REWARDS = {
    available: [
      {
        name: "네이버페이 포인트 5,000원",
        cookies: 50,
        dday: "D-28",
        expiry: "~2026.05.21",
        thumb: "assets/naverpay_thumb.svg",
      },
      {
        name: "네이버페이 포인트 5,000원",
        cookies: 50,
        dday: "D-28",
        expiry: "~2026.05.21",
        thumb: "assets/naverpay_thumb.svg",
      },
    ],
    done: [
      {
        name: "네이버페이 포인트 5,000원",
        cookies: 50,
        expiry: "~2026.05.21",
        thumb: "assets/naverpay_thumb.svg",
      },
      {
        name: "네이버페이 포인트 5,000원",
        cookies: 50,
        expiry: "~2026.05.21",
        thumb: "assets/naverpay_thumb.svg",
      },
    ],
  };

  const TABS = [
    { key: "available", label: "사용 가능" },
    { key: "done", label: "사용 완료" },
  ];

  // 프리뷰 라우트: storage.html?empty → 사용 가능 보상이 없는 빈 상태 화면
  // ("사용 가능한 보상이 없어요!"). 백엔드 연동 전 디자인 확인용.
  const EMPTY_PREVIEW = new URLSearchParams(location.search).has("empty");

  const listEl = document.querySelector(".st-list");
  const noticeEl = document.querySelector(".st-notice");
  const emptyEl = document.querySelector(".st-empty");
  const emptyTitle = document.querySelector(".st-empty-title");
  const countEl = document.querySelector(".st-count");
  const tabBtns = document.querySelectorAll(".st-tab");

  const cardHTML = (
    r,
    done,
  ) => `<div class="st-card${done ? " st-card--done" : ""}">
    <img class="st-card-thumb" src="${r.thumb}" alt="" />
    <div class="st-card-body">
      ${done ? "" : `<span class="st-card-dday">${r.dday}</span>`}
      <p class="st-card-name">${r.name}</p>
      <span class="st-card-cost">
        <img src="assets/shop_cookie_ico.svg" alt="" /><b>${r.cookies}</b> 쿠키 교환
      </span>
      <span class="st-card-expiry">
        <img src="assets/icon_calendar_expiry.svg" alt="" />${r.expiry}
      </span>
    </div>
    <button type="button" class="st-card-use"${done ? "" : ` onclick="location.href='voucher.html'"`}>${done ? "사용완료" : "사용하기"}</button>
  </div>`;

  function render(tabKey) {
    const tab = TABS.find((t) => t.key === tabKey) || TABS[0];
    // ?empty 프리뷰: 두 탭(사용 가능/사용 완료) 모두 비워 빈 상태로 렌더
    const items = EMPTY_PREVIEW ? [] : REWARDS[tab.key] || [];

    // 개수
    countEl.innerHTML = `${tab.label} <b>${items.length}</b>`;

    // 카드 목록
    const isDone = tab.key === "done";
    listEl.innerHTML = items.map((r) => cardHTML(r, isDone)).join("");

    if (items.length) {
      // 보상 있음: "더 없음" 푸터 (안내사항은 사용 가능 탭에서만)
      noticeEl.hidden = isDone;
      emptyEl.classList.remove("st-empty--full");
      emptyEl.classList.toggle("st-empty--done", isDone);
      emptyTitle.textContent = "사용 가능한 보상이 더 없어요!";
    } else {
      // 보상 없음: 상단 큰 빈 상태
      noticeEl.hidden = true;
      emptyEl.classList.remove("st-empty--done");
      emptyEl.classList.add("st-empty--full");
      emptyTitle.textContent = "사용 가능한 보상이 없어요!";
    }
  }

  // 탭 전환
  tabBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      render(TABS[i].key);
    });
  });

  render("available");
})();
