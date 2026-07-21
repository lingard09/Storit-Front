/**
 * 스토릿 - 메인 화면
 * TODO: 백엔드 연동 시 목록 API 응답으로 교체
 */
(function () {
  // creator: 유저 제작 퀴즈면 제작자명(없으면 공식) / url: 원작 보러가기 링크(네이버웹툰 검색)
  // TODO: 백엔드 연동 시 각 퀴즈의 실제 작품 URL(titleId 직링크)로 교체
  const WEBTOONS = [
    { title: "66666년 만에 환생한 흑마법사", thumb: 1, platform: 1, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기", creator: "무케대왕", url: "https://comic.naver.com/search?keyword=66666%EB%85%84%20%EB%A7%8C%EC%97%90%20%ED%99%98%EC%83%9D%ED%95%9C%20%ED%9D%91%EB%A7%88%EB%B2%95%EC%82%AC" },
    { title: "첫정", thumb: 2, platform: 2, tags: ["로맨스", "설렘폭발"], cta: "퀴즈\n풀기", url: "https://comic.naver.com/search?keyword=%EC%B2%AB%EC%A0%95" },
    { title: "A.I. 닥터", thumb: 5, platform: 3, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기", url: "https://comic.naver.com/search?keyword=A.I.%20%EB%8B%A5%ED%84%B0" },
    { title: "서포터가 다 해 먹음", thumb: 3, platform: 1, tags: ["판타지", "마법"], cta: "퀴즈\n풀기", creator: "불꽃소녀", url: "https://comic.naver.com/search?keyword=%EC%84%9C%ED%8F%AC%ED%84%B0%EA%B0%80%20%EB%8B%A4%20%ED%95%B4%20%EB%A8%B9%EC%9D%8C" },
    { title: "회귀자의 은퇴 라이프", thumb: 4, platform: 1, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기", url: "https://comic.naver.com/search?keyword=%ED%9A%8C%EA%B7%80%EC%9E%90%EC%9D%98%20%EC%9D%80%ED%87%B4%20%EB%9D%BC%EC%9D%B4%ED%94%84" },
  ];

  const list = document.querySelector(".mn-list");
  if (list) {
    list.innerHTML = WEBTOONS.map(
      (w, i) => `
      <article class="mn-card">
        <img class="mn-card-thumb" src="assets/webtoon_${w.thumb}.png" alt="" />
        <div class="mn-card-main">
          <h3 class="mn-card-title">${w.title}</h3>
          <div class="mn-card-meta">
            <img src="assets/platform_${w.platform}.png" alt="" />
            ${w.tags.map((t) => `<span class="mn-tag">${t}</span>`).join("")}
          </div>
        </div>
        <button type="button" class="mn-card-cta" data-idx="${i}">${w.cta.replace("\n", "<br>")}</button>
      </article>`,
    ).join("");

    // 퀴즈 풀기 → 퀴즈 화면으로 이동 (제목·제작자·원작 링크 전달)
    list.querySelectorAll(".mn-card-cta").forEach((btn) => {
      btn.addEventListener("click", () => {
        const w = WEBTOONS[Number(btn.dataset.idx)];
        sessionStorage.setItem("storit.quizTitle", w.title);
        if (w.creator) sessionStorage.setItem("storit.quizCreator", w.creator);
        else sessionStorage.removeItem("storit.quizCreator");
        if (w.url) sessionStorage.setItem("storit.quizUrl", w.url);
        else sessionStorage.removeItem("storit.quizUrl");
        window.location.href = "quiz.html";
      });
    });
  }

  // ── 오늘의 응원 한마디 ──────────────────
  // 첫 방문: 빈 상태(첫 응원 유도) → 스토릿 버튼으로 입력 → 목록
  (function initCheer() {
    const section = document.querySelector(".mn-cheer");
    if (!section) return;
    const empty = section.querySelector(".mn-cheer-empty");
    const listEl = section.querySelector(".mn-cheer-list");

    // 커뮤니티 응원 (백엔드 연동 시 목록 API 응답으로 교체)
    const COMMUNITY = [
      { msg: "오늘 내가 1등한데 오천냥 냠~", who: "불꽃소녀" },
      { msg: "미쳣다 오늘 왜이렄에 어려움", who: "행복전도사" },
      { msg: "행운의 쿠키 제발..", who: "열정베이커" },
    ];

    const nickname = localStorage.getItem("storit.nickname") || "나";

    const esc = (s) =>
      s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    // 내 응원을 맨 위(강조) + 커뮤니티 순으로 렌더
    function renderList(mine) {
      const rows = [{ msg: mine, who: nickname, mine: true }, ...COMMUNITY];
      listEl.innerHTML = rows
        .map(
          (r) => `
        <div class="mn-cheer-row${r.mine ? " is-mine" : ""}">
          <span class="mn-cheer-msg">${esc(r.msg)}</span>
          <span class="mn-cheer-who">${esc(r.who)}</span>
        </div>`,
        )
        .join("");
      empty.hidden = true;
      listEl.hidden = false;
    }

    const saved = localStorage.getItem("storit.myCheer");
    if (saved) {
      renderList(saved);
      return;
    }

    // 스토릿 버튼 → 입력창으로 전환
    empty.querySelector(".mn-cheer-empty-tag").addEventListener("click", () => {
      empty.innerHTML = `
        <input class="mn-cheer-input" type="text" maxlength="40"
               placeholder="응원 한마디를 남겨보세요!" />
        <button type="button" class="mn-cheer-empty-tag">등록</button>`;
      const input = empty.querySelector(".mn-cheer-input");
      input.focus();

      const submit = () => {
        const msg = input.value.trim();
        if (!msg) return;
        localStorage.setItem("storit.myCheer", msg);
        renderList(msg);
      };
      empty.querySelector(".mn-cheer-empty-tag").addEventListener("click", submit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit();
      });
    });
  })();

  // 첫 진입 튜토리얼 코치 (welcome 에서 넘어온 경우 표시)
  const coach = document.querySelector(".mn-coach");
  if (coach && sessionStorage.getItem("storit.showMainCoach") === "1") {
    sessionStorage.removeItem("storit.showMainCoach");
    coach.hidden = false;
    coach.querySelector(".mn-sheet-cta").addEventListener("click", () => {
      coach.hidden = true;
    });
  }

  // 하단 네비게이션
  const navItems = [...document.querySelectorAll(".mn-nav-item")];
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      navItems.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      // TODO: 각 탭 페이지로 이동
    });
  });

  // 요일 탭
  const days = [...document.querySelectorAll(".mn-day")];
  days.forEach((btn) => {
    btn.addEventListener("click", () => {
      days.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      // TODO: 선택 요일로 목록 필터링
    });
  });
})();
