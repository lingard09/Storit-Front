(function () {
  // ── 샘플 데이터 (백엔드 연동 시 API 응답으로 교체) ──
  // 값이 비어있으면(null/"") 빈 상태 문구를 유지한다.
  const DATA = {
    name: "감자도리",
    level: 8,
    expPercent: 67,
    nextExp: 120,
    // 나의 업적 (순서: 최고 랭킹 · 행운 횟수 · 누적 출석 · 최고 점수)
    achievements: { rank: "10위", luck: "7회", attend: "15일", score: "98.8점" },
    cookies: { balance: "80", earned: "1,240", used: "1,160" },
    lifeWebtoon: "기자매",
    genre: "공포, 스릴러",
    storageCount: 2,
    quizCount: 1,
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const set = (el, v) => {
    if (el && v != null && v !== "") el.textContent = v;
  };

  // 프로필
  set($(".mp-name"), DATA.name);
  set($(".mp-lv-num"), DATA.level);
  const fill = $(".mp-exp-fill");
  if (fill) fill.style.width = `${Math.max(DATA.expPercent || 0, 8)}%`;
  set($(".mp-exp-pct"), `${DATA.expPercent || 0}%`);
  set($(".mp-next-exp"), `${DATA.nextExp} EXP`);

  // 나의 업적 (라벨 기준 매핑 — HTML 순서가 바뀌어도 안전)
  const a = DATA.achievements;
  const achMap = {
    "최고 랭킹": a.rank,
    "행운 횟수": a.luck,
    "누적 출석": a.attend,
    "최고 점수": a.score,
  };
  $$(".mp-stat").forEach((stat) => {
    const k = stat.querySelector(".mp-stat-k");
    const v = stat.querySelector(".mp-stat-v");
    if (k && k.textContent.trim() in achMap) set(v, achMap[k.textContent.trim()]);
  });

  // 쿠키 내역
  const cookieData = [DATA.cookies.balance, DATA.cookies.earned, DATA.cookies.used];
  $$(".mp-cookie-v").forEach((el, i) => set(el, cookieData[i]));

  // 인생 웹툰 / 좋아하는 장르
  const prefVals = $$(".mp-pref-v");
  set(prefVals[0], DATA.lifeWebtoon);
  set(prefVals[1], DATA.genre);

  // 내 보관함 / 내 퀴즈
  const linkDescs = $$(".mp-link-desc");
  if (linkDescs[0])
    linkDescs[0].innerHTML = `사용 가능한<br />상품권 ${DATA.storageCount}개`;
  if (linkDescs[1])
    linkDescs[1].innerHTML = `퀴즈 심사 결과<br />확인 ${DATA.quizCount}건`;

  // ── EXP / 시즌 레벨 안내 모달 ────────────────────
  const nextEl = $(".mp-next");
  const expModal = $(".mp-modal");
  if (nextEl && expModal) {
    const open = () => {
      expModal.hidden = false;
    };
    nextEl.addEventListener("click", open);
    nextEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    expModal.querySelectorAll("[data-exp-close]").forEach((el) => {
      el.addEventListener("click", () => {
        expModal.hidden = true;
      });
    });
  }

  // 이어서 열리는 시트 열기 함수 (아래에서 할당)
  let openGenreModal = null;
  let openWebtoonModal = null;

  // ── 프로필 수정 바텀시트 (아바타 순서 = 회원가입과 동일) ──
  const editBtn = $(".mp-edit");
  const editModal = $(".mp-edit-modal");
  const editGrid = $(".mp-edit-grid");
  if (editBtn && editModal && editGrid) {
    // 회원가입(userinfo) 아바타 1~10 순서
    const AVATARS = Array.from(
      { length: 10 },
      (_, i) => `assets/avatar_${String(i + 1).padStart(2, "0")}.svg`
    );
    const current = $(".mp-edit-current-img");
    const pageAvatar = $(".mp-avatar");
    // 페이지 아바타가 목록에 없으면(예: mp_avatar.svg) 첫 번째를 기본 선택
    const inList = (src) => AVATARS.indexOf(src) !== -1;
    const pageSrc = pageAvatar ? pageAvatar.getAttribute("src") : null;
    let selectedSrc = inList(pageSrc) ? pageSrc : AVATARS[0];

    // ── 닉네임 유효성 검사 ──
    const nameInput = $(".mp-edit-name");
    const nameDivider = editModal.querySelector(".mp-edit-divider");
    const nameError = $(".mp-edit-error");
    const pageName = $(".mp-name");
    // 데모: 이미 사용 중인 닉네임 (백엔드 중복 확인으로 교체)
    const TAKEN = ["김철수", "이영희", "베이커리왕", "쿠키몬스터"];
    const NAME_RE = /^[가-힣a-zA-Z0-9]{2,10}$/; // 특수문자 제외 2~10자
    // 검증: 유효하면 true. 오류 시 빨간 문구 + 저장 비활성.
    const validateName = () => {
      if (!nameInput) return true;
      const v = nameInput.value.trim();
      const origin = pageName ? pageName.textContent.trim() : "";
      let msg = "";
      if (!NAME_RE.test(v)) {
        msg = "특수문자 제외 2~10자로 입력해주세요";
      } else if (v !== origin && TAKEN.includes(v)) {
        msg = "이미 사용 중인 닉네임이에요";
      }
      const invalid = msg !== "";
      nameInput.classList.toggle("is-invalid", invalid);
      if (nameDivider) nameDivider.classList.toggle("is-invalid", invalid);
      if (nameError) {
        nameError.textContent = msg;
        nameError.hidden = !invalid;
      }
      return !invalid;
    };

    editGrid.innerHTML = AVATARS.map(
      (src) =>
        `<button type="button" class="mp-edit-opt" data-src="${src}"><img src="${src}" alt="" /><span class="mp-edit-check" aria-hidden="true"></span></button>`
    ).join("");

    const opts = $$(".mp-edit-opt", editGrid);
    const markSelected = (src) => {
      selectedSrc = src;
      opts.forEach((o) =>
        o.classList.toggle("is-selected", o.dataset.src === src)
      );
    };
    markSelected(selectedSrc);

    // 아바타 선택 → 미리보기에만 반영(확정은 [저장하기])
    opts.forEach((o) => {
      o.addEventListener("click", () => {
        const src = o.dataset.src;
        markSelected(src);
        if (current) current.src = src;
      });
    });

    const saveBtn = $(".mp-edit-save");
    // 유효성 결과로 저장 버튼 활성/비활성 갱신
    const refreshSave = () => {
      const ok = validateName();
      if (saveBtn) saveBtn.disabled = !ok;
    };
    if (nameInput) nameInput.addEventListener("input", refreshSave);

    editBtn.addEventListener("click", () => {
      const cur = pageAvatar ? pageAvatar.getAttribute("src") : selectedSrc;
      if (current) current.src = cur;
      markSelected(inList(cur) ? cur : selectedSrc);
      // 입력값을 현재 닉네임으로 되돌리고 재검증
      if (nameInput && pageName) nameInput.value = pageName.textContent.trim();
      refreshSave();
      editModal.hidden = false;
    });

    // 저장하기 → 선택 아바타 + 닉네임을 페이지에 확정 반영 후 닫기
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        if (saveBtn.disabled) return;
        if (pageAvatar) pageAvatar.src = selectedSrc;
        if (nameInput && pageName) pageName.textContent = nameInput.value.trim();
        editModal.hidden = true;
        // 닉네임 수정 후 → 선호 장르 선택 시트로 이어짐
        if (openGenreModal) openGenreModal();
      });
    }

    // 취소 · 오버레이 → 반영 없이 닫기
    editModal.querySelectorAll("[data-edit-close]").forEach((el) => {
      el.addEventListener("click", () => {
        editModal.hidden = true;
      });
    });
  }

  // ── 선호 웹툰 장르 선택 바텀시트 (최대 3개) ──
  const genreModal = $(".mp-genre-modal");
  const genreGrid = $(".mp-genre-grid");
  if (genreModal && genreGrid) {
    const GENRES = [
      "판타지", "로맨스", "로맨스 판타지",
      "음악", "무협", "드라마", "학원물",
      "스릴러", "시대극", "액션", "모험",
      "공포", "일상물", "스포츠", "개그",
      "미스터리", "추리", "SF", "드라마",
    ];
    const ROWS = [3, 4, 4, 4, 4]; // 한 줄에 3/4/4/4/4개
    const MAX_GENRE = 3;
    let gi = 0;
    genreGrid.innerHTML = ROWS.map((n) => {
      const cells = GENRES.slice(gi, gi + n)
        .map(
          (g) => `<button type="button" class="mp-genre-chip" data-genre="${g}">${g}</button>`
        )
        .join("");
      gi += n;
      return `<div class="mp-genre-row">${cells}</div>`;
    }).join("");

    const chips = $$(".mp-genre-chip", genreGrid);
    const selectedCount = () =>
      chips.filter((c) => c.classList.contains("is-selected")).length;
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const on = chip.classList.contains("is-selected");
        // 최대 3개 — 초과 선택 시 무시
        if (!on && selectedCount() >= MAX_GENRE) return;
        chip.classList.toggle("is-selected");
      });
    });

    const genrePref = $$(".mp-pref-v")[1];
    // 열기: 현재 좋아하는 장르로 미리 선택
    openGenreModal = () => {
      const raw = genrePref ? genrePref.textContent.trim() : "";
      const cur = raw && raw !== "설정하기" ? raw.split(",").map((s) => s.trim()) : [];
      chips.forEach((c) =>
        c.classList.toggle("is-selected", cur.includes(c.dataset.genre))
      );
      genreModal.hidden = false;
    };

    // 좋아하는 장르 [수정하기] 버튼으로도 직접 열기
    const genreBtn = $$(".mp-pref-btn")[1];
    if (genreBtn) genreBtn.addEventListener("click", () => openGenreModal());

    // 수정하기 → 선택 장르를 페이지에 반영 후 닫기
    const genreSave = $(".mp-genre-save");
    if (genreSave) {
      genreSave.addEventListener("click", () => {
        const vals = [
          ...new Set(
            chips
              .filter((c) => c.classList.contains("is-selected"))
              .map((c) => c.dataset.genre)
          ),
        ];
        if (genrePref)
          genrePref.textContent = vals.length ? vals.join(", ") : "설정하기";
        genreModal.hidden = true;
        // 장르 선택 후 → 나의 인생 웹툰 시트로 이어짐
        if (openWebtoonModal) openWebtoonModal();
      });
    }

    // 취소 · 오버레이 → 반영 없이 닫기
    genreModal.querySelectorAll("[data-genre-close]").forEach((el) => {
      el.addEventListener("click", () => {
        genreModal.hidden = true;
      });
    });
  }

  // ── 나의 인생 웹툰 바텀시트 ──
  const webtoonModal = $(".mp-webtoon-modal");
  if (webtoonModal) {
    const webtoonInput = $(".mp-webtoon-name");
    const webtoonPref = $$(".mp-pref-v")[0];

    // 열기: 현재 인생 웹툰으로 입력값 채우기
    openWebtoonModal = () => {
      const cur = webtoonPref ? webtoonPref.textContent.trim() : "";
      if (webtoonInput) webtoonInput.value = cur && cur !== "설정하기" ? cur : "";
      webtoonModal.hidden = false;
    };

    // 인생 웹툰 [수정하기] 버튼으로도 직접 열기
    const webtoonBtn = $$(".mp-pref-btn")[0];
    if (webtoonBtn) webtoonBtn.addEventListener("click", () => openWebtoonModal());

    // 수정하기 → 입력값을 페이지에 반영 후 닫기
    const webtoonSave = $(".mp-webtoon-save");
    if (webtoonSave) {
      webtoonSave.addEventListener("click", () => {
        const v = webtoonInput ? webtoonInput.value.trim() : "";
        if (webtoonPref) webtoonPref.textContent = v || "설정하기";
        webtoonModal.hidden = true;
      });
    }

    // 취소 · 오버레이 → 반영 없이 닫기
    webtoonModal.querySelectorAll("[data-webtoon-close]").forEach((el) => {
      el.addEventListener("click", () => {
        webtoonModal.hidden = true;
      });
    });
  }
})();
