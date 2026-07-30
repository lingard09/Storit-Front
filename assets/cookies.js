(function () {
  // ── 데이터 (백엔드 연동 시 교체) ─────────────────
  const SUMMARY = { balance: 80, won: 8000, earned: 1240, used: 1160 };

  const HISTORY = [
    [
      {
        id: 1,
        date: "2024.05.17",
        title: "오늘의 미션 완료",
        description: "쿠키 1개 적립",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 2,
        date: "2024.05.17",
        title: "친구 초대 보상",
        description: "초대한 친구 가입 완료",
        amount: 2,
        type: "earn",
        time: "14:32",
      },
      {
        id: 3,
        date: "2024.05.17",
        title: "일일 랭킹 1위 보상",
        description: "쿠키 50개 적립",
        amount: 50,
        type: "earn",
        time: "14:32",
      },
      {
        id: 4,
        date: "2024.05.16",
        title: "시즌 랭킹 1위 보상",
        description: "26 시즌 1 최종 1위 달성",
        amount: 50,
        type: "earn",
        time: "14:32",
      },
      {
        id: 5,
        date: "2024.05.16",
        title: "시즌 랭킹 2위 보상",
        description: "26 시즌 1 최종 2위 달성",
        amount: 30,
        type: "earn",
        time: "14:32",
      },
      {
        id: 6,
        date: "2024.05.16",
        title: "시즌 랭킹 3위 보상",
        description: "26 시즌 1 최종 3위 달성",
        amount: 20,
        type: "earn",
        time: "14:32",
      },
      {
        id: 7,
        date: "2024.05.16",
        title: "시즌 랭킹 상위 5% 보상",
        description: "26 시즌 1 상위 5% 달성",
        amount: 5,
        type: "earn",
        time: "14:32",
      },
      {
        id: 8,
        date: "2024.05.16",
        title: "시즌 랭킹 상위 10% 보상",
        description: "26 시즌 1 상위 10% 달성",
        amount: 3,
        type: "earn",
        time: "14:32",
      },
      {
        id: 9,
        date: "2024.05.16",
        title: "시즌 랭킹 상위 20% 보상",
        description: "26 시즌 1 상위 20% 달성",
        amount: 2,
        type: "earn",
        time: "14:32",
      },
      {
        id: 10,
        date: "2024.05.16",
        title: "시즌 레벨 5 달성",
        description: "레벨 달성 보상",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 11,
        date: "2024.05.16",
        title: "시즌 레벨 10 달성",
        description: "레벨 달성 보상",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 12,
        date: "2024.05.16",
        title: "시즌 레벨 15 달성",
        description: "레벨 달성 보상",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 13,
        date: "2024.05.16",
        title: "시즌 레벨 20 달성",
        description: "레벨 달성 보상",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 14,
        date: "2024.05.16",
        title: "시즌 레벨 25 달성",
        description: "레벨 달성 보상",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 15,
        date: "2024.05.16",
        title: "시즌 레벨 30 달성",
        description: "레벨 달성 보상",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 16,
        date: "2024.05.16",
        title: "친구 연속 출석 보상",
        description: "초대한 친구 3일 연속 출석",
        amount: 2,
        type: "earn",
        time: "14:32",
      },
      {
        id: 17,
        date: "2024.05.16",
        title: "친구 퀴즈 참여 보상",
        description: "초대한 친구 퀴즈 3개 참여",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
      {
        id: 18,
        date: "2024.05.16",
        title: "이벤트 보상",
        description: "이벤트 참여 또는 당첨 보상 지급",
        amount: 5,
        type: "earn",
        time: "14:32",
      },
      {
        id: 19,
        date: "2024.05.16",
        title: "운영 보상",
        description: "서비스 오류, CS 처리 지급",
        amount: 5,
        type: "earn",
        time: "14:32",
      },
      {
        id: 20,
        date: "2024.05.16",
        title: "상품 교환 취소 환불",
        description: "상품 발송 실패 또는 교환 취소로 반환",
        amount: 20,
        type: "earn",
        time: "14:32",
      },
      {
        id: 21,
        date: "2024.05.16",
        title: "쿠키 내역 정정",
        description: "잘못 지급되거나 차감된 쿠키 내역 정정",
        amount: 10,
        type: "earn",
        time: "14:32",
      },
      {
        id: 22,
        date: "2024.05.16",
        title: "오늘의 행운 등수 보상",
        description: "쿠키 20개 적립",
        amount: 20,
        type: "earn",
        time: "14:32",
      },
      {
        id: 23,
        date: "2024.05.16",
        title: "상품권 교환",
        description: "쿠키 30개 사용",
        amount: -30,
        type: "use",
        time: "14:32",
      },
      {
        id: 24,
        date: "2024.05.16",
        title: "일일 랭킹 Top 30 보상",
        description: "쿠키 1개 적립",
        amount: 1,
        type: "earn",
        time: "14:32",
      },
    ],
  ];

  // HISTORY 가 [[ ...항목 ]] 형태로 한 번 더 감싸져 있어 평탄화해서 사용
  // (평탄화 안 하면 filter 의 h 가 개별 항목이 아니라 내부 배열이 됨 → 내역이 안 뜸)
  const ITEMS = HISTORY.flat();

  // 프리뷰 라우트: cookies.html?empty → 쿠키 없을 때(빈 상태) 화면.
  // 내역을 비우고 요약 수치도 0 으로 렌더 (백엔드 연동 전 디자인 확인용)
  const EMPTY_PREVIEW = new URLSearchParams(location.search).has("empty");
  const S = EMPTY_PREVIEW ? { balance: 0, won: 0, earned: 0, used: 0 } : SUMMARY;

  const fmt = (n) => n.toLocaleString("en-US");

  // ── 요약 채우기 ──────────────────────────────────
  const setText = (sel, txt) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = txt;
  };
  setText(".ck-summary-col:nth-child(1) .ck-summary-val b", fmt(S.balance));
  setText(".ck-summary-col:nth-child(2) .ck-summary-val b", fmt(S.won));
  setText(
    ".ck-substats .ck-substat:nth-child(1) .ck-substat-val",
    fmt(S.earned),
  );
  setText(
    ".ck-substats .ck-substat:nth-child(2) .ck-substat-val",
    fmt(S.used),
  );

  // ── 내역 렌더 ────────────────────────────────────
  const emptyEl = document.querySelector(".ck-empty");
  const listEl = document.querySelector(".ck-history");
  const tabs = document.querySelectorAll(".ck-tab");
  let tab = "all"; // all | earn | use

  const itemHTML = (it) => {
    const amt = it.type === "earn" ? `+${fmt(it.amount)}` : fmt(it.amount);
    return `<div class="ck-item">
      <div class="ck-item-info">
        <p class="ck-item-title">${it.title}</p>
        <p class="ck-item-desc">${it.description}</p>
      </div>
      <div class="ck-item-right">
        <p class="ck-item-amount ck-item-amount--${it.type}">${amt}</p>
        <p class="ck-item-time">${it.time}</p>
      </div>
    </div>`;
  };

  const groupByDate = (items) => {
    const groups = [];
    const map = {};
    items.forEach((it) => {
      if (!map[it.date]) {
        map[it.date] = [];
        groups.push({ date: it.date, items: map[it.date] });
      }
      map[it.date].push(it);
    });
    return groups;
  };

  function render() {
    // 전체 내역이 없으면 빈 상태 (?empty 프리뷰 시 강제)
    if (EMPTY_PREVIEW || !ITEMS.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (listEl) listEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (!listEl) return;
    listEl.hidden = false;

    const items = ITEMS.filter((h) => tab === "all" || h.type === tab);
    if (!items.length) {
      listEl.innerHTML = `<p class="ck-history-none">해당 내역이 없어요</p>`;
      return;
    }
    listEl.innerHTML = groupByDate(items)
      .map(
        (g) => `<div class="ck-group">
          <div class="ck-group-date">${g.date}</div>
          <div class="ck-group-items">${g.items.map(itemHTML).join("")}</div>
        </div>`,
      )
      .join("");
  }

  // ── 탭 전환 ──────────────────────────────────────
  const TAB_KEY = ["all", "earn", "use"];
  tabs.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      tab = TAB_KEY[i] || "all";
      render();
    });
  });

  render();
})();
