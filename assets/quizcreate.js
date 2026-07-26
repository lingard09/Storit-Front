(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );

  // ── STEP 1: 초기 노출 웹툰 ────────────────────
  // platform: 1~3 (플랫폼 아이콘) · genres: 장르 태그
  const WEBTOONS = [
    { title: "AI. 닥터", thumb: "assets/webtoon_ai_doctor.png", platform: 3, genres: ["의학", "드라마"] },
    { title: "66666년 만에 환생한 흑마법사", thumb: "assets/webtoon_blackmage.png", platform: 1, genres: ["판타지", "액션"] },
    { title: "나 혼자만 레벨업", thumb: "assets/webtoon_solo.jpg", platform: 1, genres: ["액션", "판타지"] },
    { title: "전지적 독자 시점", thumb: "assets/webtoon_orv.jpg", platform: 1, genres: ["판타지", "드라마"] },
    { title: "화산귀환", thumb: "assets/webtoon_hwasan.jpg", platform: 1, genres: ["무협", "액션"] },
  ];
  // 검색으로 추가 가능한 전체 카탈로그 (백엔드 연동 시 검색 API로 교체)
  const CATALOG = [
    ...WEBTOONS,
    { title: "신의 탑", thumb: "assets/webtoon_1.png", platform: 1, genres: ["판타지", "모험"] },
    { title: "내 남편과 결혼해줘", thumb: "assets/webtoon_2.png", platform: 2, genres: ["로맨스", "복수"] },
    { title: "여신강림", thumb: "assets/webtoon_3.png", platform: 1, genres: ["로맨스", "일상"] },
    { title: "김비서가 왜 그럴까", thumb: "assets/webtoon_4.png", platform: 2, genres: ["로맨스", "드라마"] },
    { title: "재혼 황후", thumb: "assets/webtoon_5.png", platform: 2, genres: ["로맨스", "판타지"] },
  ];

  const wrap = $(".qc-webtoons");
  const scrollBtn = $(".qc-scroll-btn");
  let items = WEBTOONS.slice();
  let selectedTitle = null;

  // ── 검증 필드 ─────────────────────────────────
  const episode = $(".qc-episode");
  const question = $(".qc-question");
  const correct = $(".qc-correct");
  const wrongs = $$(".qc-wrong");
  const submit = $(".qc-submit");
  const filled = (el) => el && el.value.trim() !== "";
  function updateSubmit() {
    submit.disabled = !(
      selectedTitle !== null &&
      filled(episode) &&
      filled(question) &&
      filled(correct) &&
      wrongs.every(filled)
    );
  }

  // ── 더 보기 화살표 / 끝이면 + ─────────────────
  const atEnd = () =>
    wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 1;
  const syncBtn = () => {
    if (scrollBtn) scrollBtn.classList.toggle("is-plus", atEnd());
  };

  // ── 웹툰 카드 렌더 ────────────────────────────
  function renderWebtoons() {
    wrap.innerHTML = items
      .map(
        (w, i) => `
      <div class="qc-webtoon" data-idx="${i}">
        <img class="qc-webtoon-thumb" src="${esc(w.thumb)}" alt="" />
        <div class="qc-webtoon-label">${esc(w.title)}</div>
      </div>`
      )
      .join("");
    $$(".qc-webtoon", wrap).forEach((card) => {
      const w = items[+card.dataset.idx];
      if (w.title === selectedTitle) card.classList.add("is-selected");
      card.addEventListener("click", () => {
        selectedTitle = w.title;
        renderWebtoons();
        updateSubmit();
      });
    });
    wrap.classList.toggle("has-selection", selectedTitle !== null);
    syncBtn();
  }
  renderWebtoons();
  wrap.addEventListener("scroll", syncBtn);
  window.addEventListener("resize", syncBtn);

  // ── 웹툰 추가 검색 바텀시트 ───────────────────
  const modal = $(".qc-search-modal");
  const searchInput = $(".qc-search-input");
  const resultsEl = $(".qc-search-results");
  const selectBtn = $(".qc-search-select");
  let pickedIdx = null; // 선택한 결과의 CATALOG 인덱스

  const setPicked = (idx) => {
    pickedIdx = idx;
    if (selectBtn) selectBtn.disabled = idx == null;
    $$(".qc-result", resultsEl).forEach((el) =>
      el.classList.toggle("is-picked", +el.dataset.i === idx)
    );
  };

  function renderResults(q) {
    const query = (q || "").trim();
    const have = new Set(items.map((w) => w.title));
    let list = CATALOG.filter((w) => !have.has(w.title));
    if (query) list = list.filter((w) => w.title.includes(query));
    resultsEl.innerHTML = list.length
      ? list
          .map(
            (w) => `
        <button type="button" class="qc-result" data-i="${CATALOG.indexOf(w)}">
          <img class="qc-result-thumb" src="${esc(w.thumb)}" alt="" />
          <div class="qc-result-body">
            <span class="qc-result-title">${esc(w.title)}</span>
            <div class="qc-result-meta">
              <img class="qc-result-plat" src="assets/platform_${w.platform}.png" alt="" />
              ${(w.genres || []).map((g) => `<span class="qc-result-tag">${esc(g)}</span>`).join("")}
            </div>
          </div>
        </button>`
          )
          .join("")
      : `<p class="qc-result-empty">검색 결과가 없어요</p>`;
    setPicked(null); // 새 검색 시 선택 초기화
    // 결과 클릭 = 선택(강조) → 선택하기 버튼 활성화
    $$(".qc-result", resultsEl).forEach((btn) =>
      btn.addEventListener("click", () => setPicked(+btn.dataset.i))
    );
  }
  function openSearch() {
    if (searchInput) searchInput.value = "";
    renderResults("");
    modal.hidden = false;
    if (searchInput) searchInput.focus();
  }
  if (searchInput)
    searchInput.addEventListener("input", () => renderResults(searchInput.value));

  // 선택하기 → 선택 웹툰을 목록에 추가 후 닫기
  if (selectBtn)
    selectBtn.addEventListener("click", () => {
      if (pickedIdx == null) return;
      const w = CATALOG[pickedIdx];
      items.push(w);
      selectedTitle = w.title;
      renderWebtoons();
      wrap.scrollTo({ left: wrap.scrollWidth });
      modal.hidden = true;
      updateSubmit();
    });

  // 취소 · 오버레이 → 닫기
  if (modal)
    modal
      .querySelectorAll("[data-search-close]")
      .forEach((el) => el.addEventListener("click", () => (modal.hidden = true)));

  // 화살표 클릭: 중간이면 스크롤, 끝(+)이면 검색 시트
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      if (scrollBtn.classList.contains("is-plus")) openSearch();
      else wrap.scrollBy({ left: 146, behavior: "smooth" });
    });
  }

  // ── 입력 검증 바인딩 ──────────────────────────
  [episode, question, correct, ...wrongs].forEach((el) => {
    if (el) el.addEventListener("input", updateSubmit);
  });
  updateSubmit();

  // ── 작성 중단 확인 팝업 ───────────────────────
  // 뒤로가기 시 작성 내용이 있으면 확인, 없으면 바로 이동
  const backBtn = $(".qc-back");
  const leaveModal = $(".qc-leave-modal");
  const isDirty = () =>
    selectedTitle !== null ||
    [episode, question, correct, ...wrongs].some(filled);
  if (backBtn && leaveModal) {
    backBtn.addEventListener("click", () => {
      if (isDirty()) leaveModal.hidden = false;
      else location.href = "myquiz.html";
    });
    leaveModal
      .querySelectorAll("[data-leave-close]")
      .forEach((el) => el.addEventListener("click", () => (leaveModal.hidden = true)));
    const goBtn = $(".qc-leave-go");
    if (goBtn) goBtn.addEventListener("click", () => (location.href = "myquiz.html"));
  }

  // ── 등록 ──────────────────────────────────────
  $("#qc-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    // TODO: 백엔드 퀴즈 등록 API 연동 (등록 후 심사중 상태로)
    location.href = "quizcomplete.html";
  });
})();
