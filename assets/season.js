(function () {
  // ── 순위 데이터 (백엔드 연동 시 교체) ────────────
  // 4위부터 리스트 (1~3위는 포디움에서 노출)
  const RANKS = [
    { rank: 4, name: "웹툰도하", score: 22110 },
    { rank: 5, name: "가나다리", score: 22110 },
    { rank: 6, name: "퀴즈사냥꾼", score: 18672 },
    { rank: 7, name: "쿠키러버", score: 18200 },
    { rank: 8, name: "반죽요정", score: 17999 },
    { rank: 9, name: "오븐지기", score: 17980 },
    { rank: 10, name: "불꽃기사", score: 17954 },
    { rank: 11, name: "어둠의주작", score: 16738 },
    { rank: 12, name: "비스킷왕", score: 15623 },
    { rank: 13, name: "저장용사", score: 14987 },
    { rank: 14, name: "순위사냥꾼", score: 13894 },
  ];
  const MY_RANK = 10; // 내 순위
  const SHOWN = 3; // 접힘 상태에서 노출되는 상단 개수 (4·5·6)
  // 리스트는 4위부터 → 상단 3개(4·5·6) 다음이 7위.
  // 내 순위가 7위 이하이면 가릴 등수가 없으므로 버튼 없이 전체 노출.
  const NO_GAP_MAX = RANKS[0].rank + SHOWN; // 7

  const AVATAR = "assets/rk_avatar.svg";
  const fmt = (n) => n.toLocaleString("en-US");

  const rowHTML = (r) => {
    const me = r.rank === MY_RANK;
    const cls = "rk-row" + (me ? " rk-row--me" : "");
    return `<div class="${cls}">
      <div class="rk-row-rank">${r.rank}</div>
      <div class="rk-row-user">
        <img class="rk-avatar" src="${AVATAR}" alt="" />
        <span class="rk-row-name">${r.name}</span>
      </div>
      <span class="rk-row-score">${fmt(r.score)}</span>
    </div>`;
  };

  const gapBtnHTML = () =>
    `<button type="button" class="rk-row rk-row--gap" aria-label="가려진 순위 펼치기"><img src="assets/icon_ellipsis.svg" alt="" /></button>`;

  const listEl = document.querySelector(".sn-list");
  let expanded = false;

  function renderList() {
    if (!listEl) return;
    let rows;
    if (expanded || MY_RANK <= NO_GAP_MAX) {
      // 내 순위 7위 이하 or 펼친 상태 → 전체 연속 출력
      rows = RANKS.map(rowHTML);
    } else {
      // 4·5·6 → 펼치기 버튼 → 내 순위~
      rows = RANKS.slice(0, SHOWN).map(rowHTML);
      rows.push(gapBtnHTML());
      rows.push(...RANKS.filter((r) => r.rank >= MY_RANK).map(rowHTML));
    }
    listEl.innerHTML = rows.join("");

    const btn = listEl.querySelector("button.rk-row--gap");
    if (btn) {
      btn.addEventListener("click", () => {
        expanded = true;
        renderList();
      });
    }
  }
  renderList();

  // ── 남은 시간 카운트다운 (25일 03:41:29부터) ─────
  const cdEl = document.getElementById("sn-countdown");
  if (cdEl) {
    const pad = (n) => String(n).padStart(2, "0");
    let total = 25 * 86400 + 3 * 3600 + 41 * 60 + 29;
    const tick = () => {
      if (total <= 0) return;
      total -= 1;
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      cdEl.textContent = `${d}일 ${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    setInterval(tick, 1000);
  }

  // ── 보상표 모달 ──────────────────────────────────
  const infoIcon = document.querySelector(".sn-info-icon");
  const infoModal = document.querySelector(".sn-modal");
  if (infoIcon && infoModal) {
    const open = () => {
      infoModal.hidden = false;
    };
    infoIcon.addEventListener("click", open);
    infoIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    infoModal.querySelectorAll("[data-info-close]").forEach((el) => {
      el.addEventListener("click", () => {
        infoModal.hidden = true;
      });
    });
  }

  // ── 첫 진입 안내 바텀시트 + 스포트라이트 ─────────
  const guide = document.querySelector(".rk-modal");
  const frame = document.querySelector(".sn-page");
  if (guide && frame) {
    const closeGuide = () => {
      guide.hidden = true;
      frame.classList.remove("rk-guide-on");
    };

    let seen = false;
    try {
      seen = !!localStorage.getItem("seasonGuideSeen");
    } catch (e) {}
    if (!seen) {
      guide.hidden = false;
      frame.classList.add("rk-guide-on");
      try {
        localStorage.setItem("seasonGuideSeen", "1");
      } catch (e) {}
    }

    guide.querySelectorAll("[data-guide-close]").forEach((el) => {
      el.addEventListener("click", closeGuide);
    });
  }
})();
