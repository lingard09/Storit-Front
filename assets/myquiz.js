(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* 프리뷰: 화면 상태를 파라미터로 지정 (main.html?hearts=N · result.html?score=N 과 동일한 용도)
       myquiz.html?state=empty   → 등록한 퀴즈가 하나도 없는 초기 상태
       myquiz.html?state=review  → 심사중 퀴즈 1개만 있는 상태 (아직 플레이 없음)
       myquiz.html               → 기본 샘플(승인·심사중·반려 각 1개)
     ?empty 는 ?state=empty 의 축약. 빈/대기 화면 렌더링은 원래 있던 분기를 그대로 타므로
     데이터만 바꿔 끼우면 된다.
     TODO: 백엔드 연동 시 이 프리뷰 분기는 제거 */
  const qs = new URLSearchParams(location.search);
  const state = qs.has("empty") ? "empty" : qs.get("state") || "";

  // 승인된 퀴즈가 없으면 집계도 0 (플레이 기록이 쌓이기 전)
  const ZERO_STATS = {
    plays: "0",
    playsDelta: 0,
    correctRate: "0%",
    correctRank: "상위 0%",
    avgTime: "0 초",
    timeRank: "상위 0%",
  };

  // ── 집계 통계 (백엔드 연동 시 API 응답으로 교체) ──
  const STATS =
    state === "empty" || state === "review"
      ? ZERO_STATS
      : {
          plays: "255",
          playsDelta: 18, // 어제 대비 (양수=상승/파랑, 음수=하락/빨강, 0/null=표시 안함)
          correctRate: "42%",
          correctRank: "상위 23%",
          avgTime: "5.8 초",
          timeRank: "상위 41%",
        };

  // ── 내 퀴즈 데이터 ────────────────────────────
  // status: "approved"(승인) · "review"(심사중) · "rejected"(반려)
  // 승인: plays/correct/time 지표 / 심사중·반려: date
  const SAMPLE = [
    { title: "66666년 만에 환생한 흑마법사 퀴즈", status: "approved", thumb: "assets/webtoon_blackmage.png", plays: 255, correct: "42%", time: "5.8초", date: "2026.05.24" },
    { title: "나 혼자만 레벨업 퀴즈", status: "review", thumb: "assets/webtoon_solo.jpg", date: "2024.05.20" },
    { title: "나 혼자만 레벨업 퀴즈", status: "rejected", thumb: "assets/webtoon_solo.jpg", date: "2024.05.20", reason: "정답이 맞지 않음" },
  ];
  const REVIEW_ONLY = [
    { title: "나 혼자만 레벨업 퀴즈", status: "review", thumb: "assets/webtoon_solo.jpg", date: "2024.05.20" },
  ];
  const QUIZZES =
    state === "empty" ? [] : state === "review" ? REVIEW_ONLY : SAMPLE;

  const STATUS = {
    approved: { label: "승인 완료", cls: "is-approved" },
    review: { label: "심사중", cls: "is-review" },
    rejected: { label: "반려", cls: "is-rejected" },
  };
  const DATE_LABEL = { review: "신청일", rejected: "반려일" };

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  const countBy = (st) => QUIZZES.filter((q) => q.status === st).length;

  // 지표 행 (승인 퀴즈 / 대표 퀴즈 공용)
  const metricsRow = (q) => `
    <div class="mq-metrics">
      <span class="mq-metric"><i class="mq-play-ico"></i>${q.plays}회</span>
      <span>정답률 ${esc(q.correct)}</span>
      <span>평균 ${esc(q.time)}</span>
    </div>`;

  /* 안내 박스(mq-info)는 "유저 참여 현황" 섹션이 아직 보여줄 게 없을 때만 노출.
     기준은 등록 여부가 아니라 '플레이 기록'이다 — 심사중 퀴즈만 있으면 등록은 됐어도
     통계가 전부 0이라 안내가 계속 필요하다.
     (.mq-info 는 display:flex 라 hidden 속성이 안 먹혀 인라인 display 로 숨김) */
  const hasPlays = QUIZZES.some((q) => (q.plays || 0) > 0);
  const infoEl = $(".mq-info");
  if (infoEl && hasPlays) infoEl.style.display = "none";

  // ── 등록퀴즈 통계 ─────────────────────────────
  $(".mq-reg-v").textContent = `${QUIZZES.length}개`;
  $(".mq-reg-sub").textContent = `심사중 ${countBy("review")}개`;

  // ── 총 플레이 수 / 정답률 / 풀이 시간 ─────────
  $(".mq-plays-v").textContent = `${STATS.plays} 회`;
  const d = STATS.playsDelta;
  $(".mq-plays-sub").innerHTML =
    d == null || d === 0
      ? "어제 대비 -"
      : `어제 대비 <i class="mq-delta ${d > 0 ? "is-up" : "is-down"}"></i>${Math.abs(d)}`;
  $(".mq-correct-v").textContent = STATS.correctRate;
  $(".mq-correct-sub").textContent = STATS.correctRank;
  $(".mq-time-v").textContent = STATS.avgTime;
  $(".mq-time-sub").textContent = STATS.timeRank;

  // ── 필터 카운트 ───────────────────────────────
  const counts = {
    all: QUIZZES.length,
    approved: countBy("approved"),
    review: countBy("review"),
    rejected: countBy("rejected"),
  };
  const filters = $$(".mq-filter");
  filters.forEach((btn) => {
    const n = $(".mq-filter-n", btn);
    if (n) n.textContent = counts[btn.dataset.filter] ?? 0;
  });

  // ── 목록 아이템 카드 ──────────────────────────
  function quizCard(q) {
    const s = STATUS[q.status] || STATUS.review;
    const meta =
      q.status === "approved"
        ? metricsRow(q)
        : `<span class="mq-item-date">${DATE_LABEL[q.status]} ${esc(q.date)}</span>`;
    return `
      <div class="mq-item">
        <img class="mq-item-thumb" src="${esc(q.thumb)}" alt="" />
        <div class="mq-item-body">
          <span class="mq-badge ${s.cls}">${s.label}</span>
          <b class="mq-item-title">${esc(q.title)}</b>
          ${meta}
        </div>
        <button type="button" class="mq-item-detail">상세<br />보기</button>
      </div>`;
  }

  // ── 가장 많이 풀린 퀴즈 ───────────────────────
  const top = $(".mq-top");
  const emptyTop = (title, desc, img, w, h, btn) => `
    <div class="mq-empty">
      <img class="mq-empty-img" src="assets/${img}" alt="" aria-hidden="true"
           style="width:${w}px;height:${h}px" />
      <div class="mq-empty-body">
        <b>${title}</b>
        <span>${desc}</span>
        ${btn || ""}
      </div>
    </div>`;
  const played = QUIZZES.filter((q) => (q.plays || 0) > 0);
  if (!QUIZZES.length) {
    top.innerHTML = emptyTop(
      "아직 대표 퀴즈가 없어요",
      "여기에 가장 인기있는 퀴즈에 <br />대한 정보가 표시됩니다!",
      "empty_no_top_quiz.svg",
      102,
      88,
    );
  } else if (!played.length) {
    top.innerHTML = emptyTop(
      "아직 플레이된 퀴즈가 없어요",
      "승인 되면 자동으로<br />유저들이 참여하기 시작합니다!",
      "empty_no_plays.svg",
      95,
      105
    );
  } else {
    const q = played.slice().sort((a, b) => b.plays - a.plays)[0];
    top.innerHTML = `
      <div class="mq-topcard">
        <img class="mq-topcard-thumb" src="${esc(q.thumb)}" alt="" />
        <div class="mq-topcard-body">
          <b class="mq-item-title">${esc(q.title)}</b>
          ${metricsRow(q)}
        </div>
      </div>`;
  }

  // ── 내 퀴즈 목록 ──────────────────────────────
  const listEl = $(".mq-list");
  function renderList(filter) {
    const items =
      filter === "all" ? QUIZZES : QUIZZES.filter((q) => q.status === filter);
    if (!items.length) {
      listEl.innerHTML = `
        <div class="mq-empty mq-empty--list">
          <img class="mq-empty-img" src="assets/empty_no_quiz.svg" alt=""
               aria-hidden="true" style="width:86px;height:86px" />
          <div class="mq-empty-body">
            <b>아직 등록한 퀴즈가 없어요</b>
            <span>웹툰을 읽고 문제를 만들어<br />다른 유저에게 도전장을 보내보세요!</span>
          </div>
        </div>`;
      return;
    }
    listEl.innerHTML = items.map(quizCard).join("");
    // 상세보기 → 퀴즈 상세 페이지 (상태·정보 전달)
    $$(".mq-item-detail", listEl).forEach((btn, i) => {
      const q = items[i];
      btn.addEventListener("click", () => {
        const params = new URLSearchParams({
          status: q.status,
          title: q.title,
          date: q.date || "",
          thumb: q.thumb,
          reason: q.reason || "",
        });
        location.href = "quizdetail.html?" + params.toString();
      });
    });
  }
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.toggle("is-active", b === btn));
      renderList(btn.dataset.filter);
    });
  });
  renderList("all");

  // ── 퀴즈 만들기 (배너 버튼 · FAB) ──────────────
  $$(".mq-create").forEach((el) => {
    el.addEventListener("click", () => {
      location.href = "quizcreate.html";
    });
  });
})();
