/**
 * 스토릿 - 퀴즈 완료 결과 화면
 * TODO: 백엔드 연동 시 채점 결과(점수/경험치/시간)를 API 응답으로 교체
 */
(function () {
  const total = Number(sessionStorage.getItem("storit.quizTotal") || 5);
  const correct = Number(sessionStorage.getItem("storit.lastScore") || 0);
  const elapsed = Number(sessionStorage.getItem("storit.quizElapsed") || 0);
  const title = sessionStorage.getItem("storit.quizTitle");

  // 파생값: 경험치 = 맞춘 문제 x 12, 점수 = 정답률 기반
  const exp = correct * 12;
  const score = Math.round((correct / total) * 100);

  const set = (sel, text) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  };

  if (title) set(".rs-title", title);
  set(".rs-score-num", String(score));

  // 점수 69점 이하: 아쉬움 상태 (말풍선 문구 + 마스코트 이미지 교체)
  if (score <= 69) {
    const heroMsg = document.querySelector(".rs-hero-msg");
    if (heroMsg) {
      heroMsg.innerHTML =
        '아쉬워요!<br /><span class="accent-y">다른 웹툰</span>도<br />풀어볼까요!';
    }
    const heroMascot = document.querySelector(".rs-hero-mascot");
    if (heroMascot) {
      heroMascot.src = "assets/mascot_low.png";
      heroMascot.classList.add("is-low");
    }
  }

  // 원형 프로그레스 링 — 점수(100점 만점) 비율만큼 채움 (둥근 끝)
  const fill = document.querySelector(".rs-ring-fill");
  if (fill) {
    const pct = Math.max(0, Math.min(100, score));
    const C = 2 * Math.PI * 114; // r=114 원둘레
    fill.style.strokeDasharray = String(C);
    fill.style.strokeDashoffset = String(C * (1 - pct / 100));
  }
  set(".rs-correct", `${correct}개`);
  set(".rs-exp-val", `${exp}XP`);
  set(".rs-exp-amount-num", String(exp));
  if (elapsed > 0) set(".rs-time", `${elapsed.toFixed(2)}초`);

  // 퀴즈 평가 (하나 선택)
  const evalBtns = Array.from(document.querySelectorAll(".rs-eval-btn"));
  evalBtns.forEach((b) => {
    b.addEventListener("click", () => {
      evalBtns.forEach((o) => o.classList.remove("is-selected"));
      b.classList.add("is-selected");
    });
  });

  // 응원 입력 (프로토타입: 입력 후 초기화)
  const cheerBtn = document.querySelector(".rs-cheer-submit");
  const cheerInput = document.querySelector(".rs-cheer-input");
  if (cheerBtn && cheerInput) {
    cheerBtn.addEventListener("click", () => {
      const v = cheerInput.value.trim();
      if (!v) return;

      const nickname = localStorage.getItem("storit.nickname") || "나";
      // TODO: 백엔드 연동 시 응원 등록 API
      localStorage.setItem("storit.myCheer", v); // 메인 응원 피드에 반영

      // 입력창·꼬리·버튼 숨기고 → 작성한 응원 문구(100% 너비) 표시
      const tail = document.querySelector(".rs-cheer-tail");
      const result = document.querySelector(".rs-cheer-result");
      if (result) {
        result.textContent = `${v}_${nickname}`;
        result.hidden = false;
      }
      cheerInput.hidden = true;
      cheerBtn.hidden = true;
      if (tail) tail.hidden = true;
    });
  }

  // 하단 버튼
  const rank = document.querySelector(".rs-action--weak");
  if (rank) rank.addEventListener("click", () => (window.location.href = "ranking.html"));
  const more = document.querySelector(".rs-action--fill");
  if (more) more.addEventListener("click", () => (window.location.href = "main.html"));

  // 뒤로가기 → 메인
  const back = document.querySelector(".rs-back");
  if (back) back.addEventListener("click", () => (window.location.href = "main.html"));

  // 점수 설명 바텀시트 (경험치 팝업 닫으면 표시)
  const sheet = document.querySelector(".rs-sheet");
  if (sheet) {
    // 랭킹 확인하러 가기 → 시트·딤 닫고 result 페이지 전체 노출
    // TODO: 랭킹 페이지(ranking.html) 완성 시 window.location.href 로 교체
    sheet.querySelector(".rs-sheet-cta").addEventListener("click", () => {
      sheet.hidden = true;
      hideSpotlight();
    });
  }

  // 링·통계바만 밝게 남기는 스포트라이트 딤 (프레임 레벨, 요소 위치 실측)
  const frame = document.querySelector(".frame");
  function showSpotlight() {
    if (!frame) return;
    hideSpotlight();
    const ringEl = document.querySelector(".rs-hero-ring");
    const statsEl = document.querySelector(".rs-stats");
    if (!ringEl || !statsEl) return;
    const fr = frame.getBoundingClientRect();
    const W = fr.width;
    const H = fr.height;

    // 프레임 기준 사각형 구멍 헬퍼 (여유 pad, 라운드 rad)
    const holeRect = (el, pad, rad) => {
      if (!el) return "";
      const b = el.getBoundingClientRect();
      const x = b.left - fr.left - pad;
      const y = b.top - fr.top - pad;
      const w = b.width + pad * 2;
      const h = b.height + pad * 2;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="#000"/>`;
    };

    const rr = ringEl.getBoundingClientRect();
    const cx = rr.left - fr.left + rr.width / 2;
    const cy = rr.top - fr.top + rr.height / 2;
    const r = rr.width / 2 + 6; // 링 원형 구멍

    const bubbleEl = document.querySelector(".rs-hero-bubble");
    const scoreEl = document.querySelector(".rs-score");
    const scoreH = scoreEl ? scoreEl.getBoundingClientRect().height : 0;

    const svg =
      `<svg class="rs-spotlight" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">` +
      `<defs><mask id="rs-holes">` +
      `<rect width="${W}" height="${H}" fill="#fff"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000"/>` + // 링
      holeRect(bubbleEl, 4, 16) + // 말풍선
      holeRect(scoreEl, 4, scoreH / 2 + 4) + // 점수 박스(알약)
      holeRect(statsEl, 2, 12) + // 통계바
      `</mask></defs>` +
      `<rect width="${W}" height="${H}" fill="rgba(0,0,0,0.6)" mask="url(#rs-holes)"/>` +
      `</svg>`;
    frame.insertAdjacentHTML("beforeend", svg);
  }
  function hideSpotlight() {
    const sp = frame && frame.querySelector(".rs-spotlight");
    if (sp) sp.remove();
  }

  // 점수 설명 시트: 핸들 닫기 → 스포트라이트 제거
  if (sheet) {
    sheet.querySelector(".rs-sheet-handle").addEventListener("click", () => {
      sheet.hidden = true;
      hideSpotlight();
    });
  }

  // ── 레벨업 판정 (경험치 획득으로 레벨 상승 시) ────
  // TODO: 백엔드 연동 시 현재 경험치/레벨을 API 응답으로 교체
  const XP_PER_LEVEL = 100;
  const storedXp = localStorage.getItem("storit.xp");
  // 미설정(null)일 땐 데모 시작값 790(레벨 8). Number(null)=0 이므로 null 을 먼저 분기.
  let oldXp = storedXp == null ? 790 : Number(storedXp);
  if (!Number.isFinite(oldXp) || oldXp < 0) oldXp = 790;
  const oldLevel = Math.floor(oldXp / XP_PER_LEVEL) + 1;
  const newXp = oldXp + exp;
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
  const leveledUp = newLevel > oldLevel;
  localStorage.setItem("storit.xp", String(newXp));

  const lvupModal = document.querySelector(".rs-lvup");
  if (lvupModal) {
    const fromEl = lvupModal.querySelector(".rs-lvup-from");
    const toEl = lvupModal.querySelector(".rs-lvup-to");
    if (fromEl) fromEl.textContent = `LV ${oldLevel}`;
    if (toEl) toEl.textContent = `LV ${newLevel}`;
  }

  // 점수 설명 시트로 진행 (스포트라이트 유지)
  const proceedToSheet = () => {
    if (sheet) {
      sheet.hidden = false;
      showSpotlight();
    } else {
      hideSpotlight();
    }
  };

  // 레벨업 모달 → 닫으면 점수 설명 시트
  if (lvupModal) {
    const closeLv = () => {
      lvupModal.hidden = true;
      proceedToSheet();
    };
    lvupModal.querySelector(".rs-exp-overlay").addEventListener("click", closeLv);
    lvupModal.querySelector(".rs-exp-close").addEventListener("click", closeLv);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lvupModal.hidden) closeLv();
    });
  }

  // 경험치 획득 팝업 (진입 시 표시)
  //  → 닫을 때 레벨업이면 레벨업 모달, 아니면 점수 설명 시트
  const expModal = document.querySelector(".rs-exp:not(.rs-lvup)");
  if (expModal) {
    expModal.hidden = false; // 팝업일 땐 일반 딤, 하이라이트 없음
    const close = () => {
      expModal.hidden = true;
      if (leveledUp && lvupModal) {
        lvupModal.hidden = false; // 레벨업 축하 먼저
      } else {
        proceedToSheet();
      }
    };
    expModal.querySelector(".rs-exp-overlay").addEventListener("click", close);
    expModal.querySelector(".rs-exp-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !expModal.hidden) close();
    });
  }
})();
