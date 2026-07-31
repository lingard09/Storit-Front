(function () {
  // ── 출석 데이터 ─────────────────────────────────
  // 백엔드 연동 시 이 값만 교체하면 됨.
  // attendanceStreak: API 가 내려주는 "현재 월 기준 연속 출석일".
  //   매월 1일에는 서버에서 streak 를 초기화하므로, 프론트는 내려온 값을 그대로 신뢰한다.
  //   (출석 완료 직후의 streak = 오늘 포함 연속 출석일)
  const CONFIG = {
    monthLabel: "2025년 9월",
    firstWeekday: 4, // 1일의 요일 (0=일 … 4=목)
    daysInMonth: 31,
    attended: 10, // 1~N일 출석 완료
    today: 11, // 오늘(강조)
    timeLeft: "03:41:29 남음",
    baseExp: 15, // 기본 출석 EXP
  };

  // 연속 출석 보상표(단일 소스) — 안내 팝업 & 보상 계산 공용
  const BONUS_TABLE = [
    { streak: 3, exp: 20 },
    { streak: 7, exp: 50 },
    { streak: 14, exp: 100 },
    { streak: 21, exp: 150 },
    { streak: 28, exp: 250 },
  ];

  // attendanceStreak 기준으로 이번 출석 보상 계산
  function getReward(streak) {
    const m = BONUS_TABLE.find((b) => b.streak === streak);
    return {
      streak,
      isBonus: !!m,
      bonusExp: m ? m.exp : 0,
      exp: CONFIG.baseExp + (m ? m.exp : 0),
    };
  }

  document.querySelector(".ci-month").textContent = CONFIG.monthLabel;
  document.querySelector(".ci-nav-label").textContent = CONFIG.monthLabel;
  document.querySelector(".ci-timer-left").textContent = CONFIG.timeLeft;

  const grid = document.querySelector(".ci-grid");
  const streakNum = document.querySelector(".ci-streak-num");

  function renderGrid() {
    streakNum.textContent = CONFIG.attended + "일째";
    let html = "";
    // 1일 앞의 빈 칸
    for (let i = 0; i < CONFIG.firstWeekday; i++) {
      html += `<div class="ci-day is-empty"></div>`;
    }
    for (let d = 1; d <= CONFIG.daysInMonth; d++) {
      const col = (CONFIG.firstWeekday + d - 1) % 7; // 0=일 … 6=토
      let cls = "ci-day";
      let cell;
      if (d <= CONFIG.attended) {
        cls += " is-done";
        cell = `<div class="ci-day-stamp"><img src="assets/checkin_stamp.svg" alt="출석" /></div>`;
      } else {
        if (d === CONFIG.today) cls += " is-today";
        else if (col === 0) cls += " is-sun";
        else if (col === 6) cls += " is-sat";
        cell = `<div class="ci-day-circle"></div>`;
      }
      html += `<div class="${cls}"><span class="ci-day-num">${d}</span>${cell}</div>`;
    }
    grid.innerHTML = html;
  }

  renderGrid();

  // ── 출석하기 → 오늘 스탬프 + 경험치 모달 ──
  const submit = document.querySelector(".ci-submit");
  const reward = document.querySelector(".ci-reward");
  const modal = document.querySelector(".rs-exp");
  const overlay = modal && modal.querySelector(".rs-exp-overlay");
  const closeBtn = modal && modal.querySelector(".rs-exp-close");
  const amountEl = modal && modal.querySelector(".rs-exp-amount");
  const bonusEl = modal && modal.querySelector(".rs-exp-bonus");

  // 레벨업 모달
  const lvupModal = document.querySelector(".mn-levelup");
  let leveledUp = false;

  // 경험치 획득이 레벨업을 유발하는지 판정 (백엔드 연동 시 교체)
  function evalLevelUp(gainedExp) {
    const XP_PER_LEVEL = 100;
    const storedXp = localStorage.getItem("storit.xp");
    // 미설정(null)일 땐 데모 시작값 790(레벨 8). Number(null)=0 이므로 null 먼저 분기.
    let oldXp = storedXp == null ? 790 : Number(storedXp);
    if (!Number.isFinite(oldXp) || oldXp < 0) oldXp = 790;
    const oldLevel = Math.floor(oldXp / XP_PER_LEVEL) + 1;
    const newXp = oldXp + gainedExp;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    localStorage.setItem("storit.xp", String(newXp));
    if (lvupModal) {
      const f = lvupModal.querySelector(".mn-levelup-lv--from");
      const t = lvupModal.querySelector(".mn-levelup-lv--to");
      if (f) f.textContent = `LV ${oldLevel}`;
      if (t) t.textContent = `LV ${newLevel}`;
      // 캐릭터 양옆 쿠키 아이콘은 5레벨 배수 달성 시에만 노출
      lvupModal.querySelectorAll(".mn-levelup-cookie").forEach((c) => {
        c.hidden = newLevel % 5 !== 0;
      });
    }
    return newLevel > oldLevel;
  }

  // attendanceStreak 로 모달 문구 구성 후 오픈
  function openModal(streak) {
    if (!modal) return;
    const r = getReward(streak);
    // 마일스톤(연속 출석) 날: "N일 연속 보너스 + {총합} EXP", 그 외: "+ {기본} EXP"
    if (amountEl) {
      const num = `<span class="rs-exp-amount-num">${r.exp}</span>`;
      amountEl.innerHTML = r.isBonus
        ? `${r.streak}일 연속 보너스 + ${num} EXP`
        : `+ ${num} EXP`;
    }
    // 스트릭 문구를 금액 라인에 통합 → 별도 보너스 라인 미사용
    if (bonusEl) bonusEl.hidden = true;
    leveledUp = evalLevelUp(r.exp);
    modal.hidden = false;
  }
  function closeModal() {
    if (modal) modal.hidden = true;
    // 경험치 획득으로 레벨업했으면 레벨업 모달을 이어서 표시
    if (leveledUp && lvupModal) {
      lvupModal.hidden = false;
      leveledUp = false;
    }
  }
  if (lvupModal) {
    const closeLv = () => {
      lvupModal.hidden = true;
    };
    lvupModal
      .querySelectorAll("[data-close-levelup]")
      .forEach((el) => el.addEventListener("click", closeLv));

    // 프리뷰: checkin.html?levelup → 레벨업 모달 바로 표시 (디자인 확인용)
    if (new URLSearchParams(location.search).has("levelup")) {
      lvupModal.hidden = false;
    }
  }

  let done = CONFIG.today <= CONFIG.attended;

  function checkIn() {
    if (done) return;
    done = true;
    // 오늘까지 출석 처리 후 달력 갱신
    CONFIG.attended = CONFIG.today;
    renderGrid();
    // 버튼 비활성 + 보상 배너
    submit.classList.add("is-done");
    submit.disabled = true;
    if (reward) reward.hidden = false;
    // 출석 완료 직후 streak = 오늘 포함 연속 출석일 (실제로는 API 응답값 사용)
    openModal(CONFIG.attended);
  }

  if (submit) submit.addEventListener("click", checkIn);
  if (overlay) overlay.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // ── 연속 출석 보상 안내 팝업 (ci-info) ──
  const guideRows = document.querySelector(".ci-guide-rows");
  if (guideRows) {
    guideRows.innerHTML = BONUS_TABLE.map(
      (b) => `<tr><td>${b.streak}일 연속</td><td>${b.exp} EXP 추가</td></tr>`
    ).join("");
  }

  const info = document.querySelector(".ci-info");
  const guide = document.querySelector(".ci-guide");
  const guideOverlay = guide && guide.querySelector(".ci-guide-overlay");
  const guideClose = guide && guide.querySelector(".ci-guide-close");

  if (info && guide) {
    info.style.cursor = "pointer";
    info.addEventListener("click", () => {
      guide.hidden = false;
    });
    const hideGuide = () => {
      guide.hidden = true;
    };
    if (guideOverlay) guideOverlay.addEventListener("click", hideGuide);
    if (guideClose) guideClose.addEventListener("click", hideGuide);
  }
})();
