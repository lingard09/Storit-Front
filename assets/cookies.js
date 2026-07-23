(function () {
  // ── 데이터 (백엔드 연동 시 교체) ─────────────────
  const SUMMARY = { balance: 80, won: 8000, earned: 1240, used: 1160 };

  const HISTORY = [
    { id: 1, date: "2024.05.17", title: "오늘의 미션 완료", description: "쿠키 1개 적립", amount: 1, type: "earn", time: "14:32" },
    { id: 2, date: "2024.05.17", title: "친구 초대 보상", description: "초대한 친구 가입 완료", amount: 2, type: "earn", time: "14:32" },
    { id: 3, date: "2024.05.17", title: "일일 랭킹 1위 보상", description: "쿠키 50개 적립", amount: 50, type: "earn", time: "14:32" },
    { id: 4, date: "2024.05.17", title: "상품권 교환", description: "쿠키 30개 사용", amount: -30, type: "use", time: "14:32" },
    { id: 5, date: "2024.05.16", title: "행운의 등수 달성", description: "쿠키 20개 적립", amount: 20, type: "earn", time: "14:32" },
    { id: 6, date: "2024.05.16", title: "일일 랭킹 Top 30 보상", description: "쿠키 1개 적립", amount: 1, type: "earn", time: "14:32" },
    { id: 7, date: "2024.05.16", title: "초대코드 입력 보상", description: "가입 시 초대코드 입력 완료", amount: 2, type: "earn", time: "14:32" },
    { id: 8, date: "2024.05.16", title: "상품권 교환", description: "쿠키 30개 사용", amount: -30, type: "use", time: "14:32" },
  ];

  const fmt = (n) => n.toLocaleString("en-US");

  // ── 요약 채우기 ──────────────────────────────────
  const setText = (sel, txt) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = txt;
  };
  setText(".ck-summary-col:nth-child(1) .ck-summary-val b", fmt(SUMMARY.balance));
  setText(".ck-summary-col:nth-child(2) .ck-summary-val b", fmt(SUMMARY.won));
  setText(".ck-substats .ck-substat:nth-child(1) .ck-substat-val", fmt(SUMMARY.earned));
  setText(".ck-substats .ck-substat:nth-child(2) .ck-substat-val", fmt(SUMMARY.used));

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
    // 전체 내역이 없으면 빈 상태
    if (!HISTORY.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (listEl) listEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (!listEl) return;
    listEl.hidden = false;

    const items = HISTORY.filter((h) => tab === "all" || h.type === tab);
    if (!items.length) {
      listEl.innerHTML = `<p class="ck-history-none">해당 내역이 없어요</p>`;
      return;
    }
    listEl.innerHTML = groupByDate(items)
      .map(
        (g) => `<div class="ck-group">
          <div class="ck-group-date">${g.date}</div>
          <div class="ck-group-items">${g.items.map(itemHTML).join("")}</div>
        </div>`
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
