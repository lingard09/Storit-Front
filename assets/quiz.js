/**
 * 스토릿 - 퀴즈 풀이 화면
 * TODO: 백엔드 연동 시 문제 API 응답으로 교체 (QUESTIONS / correct 값)
 */
(function () {
  // 5문항 (correct: 정답 보기 인덱스 — 백엔드 정답으로 교체)
  const QUESTIONS = [
    {
      text: "무인이 이를 수 있는<br />최고의 경지를 칭하는 이름은?",
      timer: 30,
      episode: "68화",
      options: ["소드 마스터", "체르빌 오르곤", "빌드 마스터", "그랜드 마스터"],
      correct: 0,
    },
    {
      text: "제이미가 환생하기 전<br />불렸던 이름은?",
      timer: 20,
      episode: "1화",
      options: ["디아블로 볼피르", "카론", "루시펠", "아스타로트"],
      correct: 0,
    },
    {
      text: "제이미를 봉인한<br />존재의 수는?",
      timer: 15,
      episode: "14화",
      options: ["12신", "7대 마왕", "3천왕", "9현자"],
      correct: 0,
    },
    {
      text: "세상에 존재하는<br />가장 강력한<br />에너지 덩어리는?",
      timer: 10,
      episode: "117화",
      options: ["드래곤 하트", "인어의 눈물", "엘프의 심장", "퍼펙트 셀"],
      correct: 0,
    },
    {
      text: "제이미의<br />첫 번째 권능은?",
      timer: 10,
      episode: "31화",
      options: ["반명", "역천", "파도", "단명"],
      correct: 0,
    },
  ];

  // 메인에서 선택한 작품 제목 반영
  const title = sessionStorage.getItem("storit.quizTitle");
  if (title) {
    const el = document.querySelector(".qz-title");
    if (el) el.textContent = title;
  }

  // 유저 제작 퀴즈면 배지 표시 (공식 퀴즈면 storit.quizCreator 없음)
  const creator = sessionStorage.getItem("storit.quizCreator");
  const badge = document.querySelector(".qz-badge");
  if (badge && creator) {
    badge.querySelector(".qz-badge-text").textContent = `${creator}님이 만든 퀴즈에요!`;
  }

  // DOM refs
  const numEl = document.querySelector(".qz-q-num");
  const textEl = document.querySelector(".qz-q-text");
  const timerEl = document.querySelector(".qz-timer");
  const epEl = document.querySelector(".qz-ep");
  const optionsEl = document.querySelector(".qz-options");
  const fillEl = document.querySelector(".qz-progress-fill");
  const curEl = document.querySelector(".qz-progress-label .cur");
  const totalEl = document.querySelector(".qz-total");
  if (totalEl) totalEl.textContent = String(QUESTIONS.length);

  let idx = 0; // 현재 문항 (0-based)
  let score = 0; // 지금까지 맞춘 갯수
  let locked = false; // 문항당 1회 선택
  let ticking = null;
  let startedAt = 0; // 첫 문항 시작 시각(경과 시간 계산용)

  function elapsedSec() {
    return startedAt ? (Date.now() - startedAt) / 1000 : 0;
  }

  function stopTimer() {
    if (ticking) {
      clearInterval(ticking);
      ticking = null;
    }
  }

  function startTimer(sec) {
    stopTimer();
    if (!startedAt) startedAt = Date.now(); // 퀴즈 시작 시각
    let remain = sec;
    if (timerEl) timerEl.textContent = remain + "초";
    ticking = setInterval(() => {
      remain -= 1;
      if (timerEl) timerEl.textContent = Math.max(remain, 0) + "초";
      if (remain <= 0) {
        stopTimer();
        // 시간 초과 → 오답 처리 후 다음 문항
        goNext();
      }
    }, 1000);
  }

  function renderQuestion() {
    const q = QUESTIONS[idx];
    locked = false;

    if (numEl) numEl.textContent = `Q${idx + 1}.`;
    if (textEl) textEl.innerHTML = q.text;
    if (epEl) epEl.textContent = q.episode;
    if (badge) badge.hidden = !(creator && idx === 3); // 유저 제작 배지는 4번 문항에만

    // 진행바 (현재/전체)
    const pct = (idx + 1) / QUESTIONS.length;
    if (fillEl) fillEl.style.width = `${pct * 100}%`;
    if (curEl) curEl.textContent = String(idx + 1);

    // 보기 4개
    optionsEl.innerHTML = q.options
      .map((o, i) => `<button type="button" class="qz-option" data-i="${i}">${o}</button>`)
      .join("");
    optionsEl.querySelectorAll(".qz-option").forEach((btn) => {
      btn.addEventListener("click", () => select(btn));
    });

    startTimer(q.timer);
  }

  // 보기 선택 → 채점 후 다음 문항
  function select(btn) {
    if (locked) return;
    locked = true;
    stopTimer();

    optionsEl.querySelectorAll(".qz-option").forEach((o) => o.classList.remove("is-selected"));
    btn.classList.add("is-selected");

    if (Number(btn.dataset.i) === QUESTIONS[idx].correct) score += 1;

    // 선택 표시를 잠깐 보여준 뒤 다음 문항
    setTimeout(goNext, 300);
  }

  function goNext() {
    stopTimer();
    if (idx < QUESTIONS.length - 1) {
      idx += 1;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  // 퀴즈 종료(정상 완료) — 점수 반영 & 랭킹 등록 → 결과 화면
  function finishQuiz() {
    saveResult();
    if (score > 0) registerRanking();
    window.location.href = "result.html";
  }

  // 결과 화면에서 쓸 값 저장
  function saveResult() {
    sessionStorage.setItem("storit.lastScore", String(score));
    sessionStorage.setItem("storit.quizTotal", String(QUESTIONS.length));
    sessionStorage.setItem("storit.quizElapsed", elapsedSec().toFixed(2));
    localStorage.setItem("storit.lastScore", String(score));
  }

  // 1점 이상이면 랭킹 등록 (0점이면 미등록)
  function registerRanking() {
    // TODO: 백엔드 연동 시 랭킹 등록 API 호출
    const ranking = JSON.parse(localStorage.getItem("storit.ranking") || "[]");
    ranking.push({ title: title || "", score });
    localStorage.setItem("storit.ranking", JSON.stringify(ranking));
  }

  // 이탈 시: 지금까지 맞춘 갯수만큼 점수 반영 → 1점 이상이면 랭킹 등록
  function leaveQuiz() {
    stopTimer();
    saveResult();
    if (score > 0) registerRanking();
    // 이동하기 → 메인 (결과는 저장돼 있어 두 경우 모두 접근 가능)
    window.location.href = "main.html";
  }

  // 뒤로가기 → 이탈 확인 모달
  const exit = document.querySelector(".qz-exit");
  const back = document.querySelector(".qz-back");
  if (back && exit) {
    const openExit = () => {
      exit.hidden = false;
    };
    const closeExit = () => {
      exit.hidden = true;
    };

    back.addEventListener("click", openExit);
    exit.querySelector(".qz-exit-overlay").addEventListener("click", closeExit);
    exit.querySelector(".qz-exit-close").addEventListener("click", closeExit);
    exit.querySelector(".qz-exit-stay").addEventListener("click", closeExit); // 계속풀기
    exit.querySelector(".qz-exit-leave").addEventListener("click", leaveQuiz); // 이동하기 → 메인
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !exit.hidden) closeExit();
    });
  }

  // 보러가기 → 원작 웹툰 외부 링크 (새 탭)
  const linkBtn = document.querySelector(".qz-chip-link");
  if (linkBtn) {
    linkBtn.addEventListener("click", () => {
      const url = sessionStorage.getItem("storit.quizUrl");
      if (url) window.open(url, "_blank", "noopener");
    });
  }

  // 첫 진입 튜토리얼 코치 (퀴즈 최초 1회) → 닫으면 첫 문항 시작
  const coach = document.querySelector(".qz-coach");
  const seen = localStorage.getItem("storit.quizIntroSeen") === "1";
  if (coach && !seen) {
    // 코치가 뜬 동안엔 타이머 시작 전에 첫 문항만 렌더 (타이머는 시작 후)
    renderQuestionStatic();
    coach.hidden = false;
    coach.querySelector(".qz-sheet-cta").addEventListener("click", () => {
      localStorage.setItem("storit.quizIntroSeen", "1");
      coach.hidden = true;
      startTimer(QUESTIONS[idx].timer); // 인트로 닫고 타이머 시작
    });
  } else {
    renderQuestion();
  }

  // 코치 표시용: 타이머 없이 첫 문항 내용만 렌더
  function renderQuestionStatic() {
    const q = QUESTIONS[idx];
    if (numEl) numEl.textContent = `Q${idx + 1}.`;
    if (textEl) textEl.innerHTML = q.text;
    if (epEl) epEl.textContent = q.episode;
    if (timerEl) timerEl.textContent = q.timer + "초";
    if (badge) badge.hidden = !(creator && idx === 3); // 유저 제작 배지는 4번 문항에만
    const pct = (idx + 1) / QUESTIONS.length;
    if (fillEl) fillEl.style.width = `${pct * 100}%`;
    if (curEl) curEl.textContent = String(idx + 1);
    optionsEl.innerHTML = q.options
      .map((o, i) => `<button type="button" class="qz-option" data-i="${i}">${o}</button>`)
      .join("");
    optionsEl.querySelectorAll(".qz-option").forEach((btn) => {
      btn.addEventListener("click", () => select(btn));
    });
  }
})();
