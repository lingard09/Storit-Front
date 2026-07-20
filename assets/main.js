/**
 * 스토릿 - 메인 화면
 * TODO: 백엔드 연동 시 목록 API 응답으로 교체
 */
(function () {
  const WEBTOONS = [
    { title: "66666년 만에 환생한 흑마법사", thumb: 1, platform: 1, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기" },
    { title: "첫정", thumb: 2, platform: 2, tags: ["로맨스", "설렘폭발"], cta: "퀴즈\n풀기" },
    { title: "A.I. 닥터", thumb: 5, platform: 3, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기" },
    { title: "서포터가 다 해 먹음", thumb: 3, platform: 1, tags: ["판타지", "마법"], cta: "퀴즈\n풀기" },
    { title: "회귀자의 은퇴 라이프", thumb: 4, platform: 2, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기" },
  ];

  const list = document.querySelector(".mn-list");
  if (list) {
    list.innerHTML = WEBTOONS.map(
      (w) => `
      <article class="mn-card">
        <img class="mn-card-thumb" src="assets/webtoon_${w.thumb}.png" alt="" />
        <div class="mn-card-main">
          <h3 class="mn-card-title">${w.title}</h3>
          <div class="mn-card-meta">
            <img src="assets/platform_${w.platform}.png" alt="" />
            ${w.tags.map((t) => `<span class="mn-tag">${t}</span>`).join("")}
          </div>
        </div>
        <button type="button" class="mn-card-cta">${w.cta.replace("\n", "<br>")}</button>
      </article>`,
    ).join("");
  }

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
