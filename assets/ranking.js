(function () {
  // ── 순위 데이터 (백엔드 연동 시 교체) ────────────
  const RANKS = [
    { rank: 1, name: "무케대마왕", score: 850, top: true },
    { rank: 2, name: "웹툰도하", score: 840, top: true },
    { rank: 3, name: "격일출가좌", score: 830, top: true },
    { gap: true },
    { rank: 7, name: "가나다리", score: 790, me: true },
    { rank: 8, name: "웹툰도999", score: 780 },
    { rank: 9, name: "퀴즈사냥꾼", score: 775 },
    { rank: 10, name: "쿠키몬스터", score: 770 },
  ];

  const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const AVATAR = "assets/rank_avatar.svg";

  const rowHTML = (r) => {
    if (r.gap) {
      return `<div class="rk-row rk-row--gap"><span></span><span></span><span></span></div>`;
    }
    const cls =
      "rk-row" + (r.me ? " rk-row--me" : r.top ? " rk-row--top" : "");
    const rankCell = MEDALS[r.rank]
      ? `<span class="rk-medal">${MEDALS[r.rank]}</span>`
      : r.rank;
    return `<div class="${cls}">
      <div class="rk-row-rank">${rankCell}</div>
      <div class="rk-row-user">
        <img class="rk-avatar" src="${AVATAR}" alt="" />
        <span class="rk-row-name">${r.name}</span>
      </div>
      <span class="rk-row-score">${r.score}점</span>
    </div>`;
  };

  const listEl = document.querySelector(".rk-list");
  if (listEl) listEl.innerHTML = RANKS.map(rowHTML).join("");

  // ── 정산 카운트다운 ──────────────────────────────
  const cdEl = document.getElementById("rk-countdown");
  if (cdEl) {
    // 03:41:29 → 초 단위
    let total = 3 * 3600 + 41 * 60 + 29;
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      if (total <= 0) return;
      total -= 1;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      cdEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    setInterval(tick, 1000);
  }

  // ── 탭 전환 ──────────────────────────────────────
  const tabs = document.querySelectorAll(".rk-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      // TODO: 일간/시즌 데이터 교체
    });
  });
})();
