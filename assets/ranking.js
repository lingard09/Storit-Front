(function () {
  // ── 순위 데이터 (백엔드 연동 시 교체) ────────────
  // 전체 순위 목록 (1위 ~ )
  const RANKS = [
    { rank: 1, name: "무케대마왕", score: 850 },
    { rank: 2, name: "웹툰도하", score: 840 },
    { rank: 3, name: "격일출가좌", score: 830 },
    { rank: 4, name: "쿠키러버", score: 820 },
    { rank: 5, name: "퀴즈마스터", score: 810 },
    { rank: 6, name: "웹툰중독", score: 800 },
    { rank: 7, name: "가나다리", score: 790 },
    { rank: 8, name: "웹툰도999", score: 780 },
    { rank: 9, name: "퀴즈사냥꾼", score: 775 },
    { rank: 10, name: "쿠키몬스터", score: 770 },
  ];
  const MY_RANK = 7; // 내 순위 (백엔드 값)
  const TOP_N = 3; // 항상 노출되는 상위 등수

  const MEDALS = {
    1: "assets/rk_medal_1.svg",
    2: "assets/rk_medal_2.svg",
    3: "assets/rk_medal_3.svg",
  };
  const AVATAR = "assets/rk_avatar.svg";

  const rowHTML = (r) => {
    const isMe = r.rank === MY_RANK;
    const cls = "rk-row" + (isMe ? " rk-row--me" : r.rank === 1 ? " rk-row--top" : "");
    const rankCell = MEDALS[r.rank]
      ? `<img class="rk-medal" src="${MEDALS[r.rank]}" alt="${r.rank}위" />`
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

  const gapBtnHTML = () =>
    `<button type="button" class="rk-row rk-row--gap" aria-label="가려진 순위 펼치기"><img src="assets/icon_ellipsis.svg" alt="" /></button>`;

  const listEl = document.querySelector(".rk-list");
  let expanded = false;

  function renderList() {
    if (!listEl) return;
    let rows;
    if (MY_RANK <= TOP_N + 1 || expanded) {
      // 내 순위가 4등 이하이거나 펼친 상태 → 전체 연속 출력
      rows = RANKS.map(rowHTML);
    } else {
      // 1~3등 + 펼치기 버튼 + 내 순위~
      rows = RANKS.slice(0, TOP_N).map(rowHTML);
      rows.push(gapBtnHTML());
      rows.push(...RANKS.slice(MY_RANK - 1).map(rowHTML));
    }
    listEl.innerHTML = rows.join("");

    const btn = listEl.querySelector(".rk-gap-btn, button.rk-row--gap");
    if (btn) {
      btn.addEventListener("click", () => {
        expanded = true;
        renderList();
      });
    }
  }
  renderList();

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

  // ── 첫 진입 안내 바텀시트 + 스포트라이트 ─────────
  const modal = document.querySelector(".rk-modal");
  const frame = document.querySelector(".rk-page");
  if (modal && frame) {
    let pieClone = null;

    const openGuide = () => {
      modal.hidden = false;
      frame.classList.add("rk-guide-on");
      // 파이 구간 복사본을 화면 중앙에 띄움
      const pie = document.querySelector(".rk-pie");
      if (pie && !pieClone) {
        pieClone = pie.cloneNode(true);
        pieClone.classList.add("rk-pie-clone");
        frame.insertBefore(pieClone, modal);
      }
    };

    const closeGuide = () => {
      modal.hidden = true;
      frame.classList.remove("rk-guide-on");
      if (pieClone) {
        pieClone.remove();
        pieClone = null;
      }
    };

    let seen = false;
    try {
      seen = !!localStorage.getItem("rankGuideSeen");
    } catch (e) {}
    if (!seen) {
      openGuide();
      try {
        localStorage.setItem("rankGuideSeen", "1");
      } catch (e) {}
    }

    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeGuide);
    });
  }
})();
