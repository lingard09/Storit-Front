/**
 * 스토릿 - 유저 정보 입력
 *  - 닉네임 / 출생연도: 필수
 *  - 성별: 선택 (다시 누르면 해제)
 *  - 필수 항목이 모두 유효해야 [다음] 활성화
 */
(function () {
  const nickname = document.querySelector("#ui-nickname");
  const birthYear = document.querySelector("#ui-birthyear");
  const genderBtns = [...document.querySelectorAll(".ui-gender-btn")];
  const cta = document.querySelector(".sheet-cta");
  if (!nickname || !birthYear || !cta) return;

  // 선택 가능한 출생연도 범위
  const MIN_YEAR = 1926;
  const MAX_YEAR = 2012;

  function validYear(v) {
    const n = Number(v);
    return /^\d{4}$/.test(v) && n >= MIN_YEAR && n <= MAX_YEAR;
  }

  /* ── 닉네임 검증 ─────────────────────────── */
  const nickMsg = document.querySelector(".ui-nick-msg");

  // 2~10자, 한글·영문·숫자만 (특수문자·공백 불가)
  const NICK_RE = /^[가-힣a-zA-Z0-9]{2,10}$/;

  // TODO: 백엔드 연동 시 중복 확인 API로 교체
  const TAKEN = ["내가그린기린그림", "스토릿", "관리자", "admin", "막시무스"];

  let nickState = "empty"; // empty | invalid | taken | ok

  function checkNickname() {
    const v = nickname.value.trim();

    if (!v) nickState = "empty";
    else if (!NICK_RE.test(v)) nickState = "invalid";
    else if (TAKEN.includes(v)) nickState = "taken";
    else nickState = "ok";

    const view = {
      empty: ["", ""],
      invalid: ["2-10자만 가능해요. (특수문자 불가)", "is-error"],
      taken: ["이미 사용 중인 닉네임이에요.", "is-error"],
      ok: ["사용 가능한 닉네임이에요.", "is-ok"],
    }[nickState];

    nickMsg.textContent = view[0];
    nickMsg.classList.remove("is-error", "is-ok");
    if (view[1]) nickMsg.classList.add(view[1]);
  }

  function sync() {
    cta.disabled = !(nickState === "ok" && validYear(birthYear.value));
  }

  nickname.addEventListener("input", () => {
    checkNickname();
    sync();
  });

  /* ── 출생연도 설정 모달 (휠 피커) ─────────── */
  const byModal = document.querySelector(".by-modal");
  if (byModal) {
    const list = byModal.querySelector(".by-list");
    const picker = byModal.querySelector(".by-picker");
    const confirm = byModal.querySelector(".by-confirm");
    const ROW_H = 45;
    const DEFAULT_YEAR = 2005;

    // 최신 연도가 위로 오도록 내림차순
    const years = [];
    for (let y = MAX_YEAR; y >= MIN_YEAR; y--) years.push(y);

    list.innerHTML = years
      .map((y) => `<li class="by-year" data-year="${y}">${y}</li>`)
      .join("");

    const items = [...list.children];
    let picked = DEFAULT_YEAR;

    function highlight() {
      const idx = Math.round(picker.scrollTop / ROW_H);
      items.forEach((el, i) => el.classList.toggle("is-current", i === idx));
      picked = Number(items[idx] ? items[idx].dataset.year : DEFAULT_YEAR);
      confirm.textContent = `${picked}년 선택`;
    }

    function scrollTo(year, smooth) {
      const idx = years.indexOf(year);
      if (idx < 0) return;
      picker.scrollTo({ top: idx * ROW_H, behavior: smooth ? "smooth" : "auto" });
    }

    let raf = null;
    picker.addEventListener("scroll", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(highlight);
    });

    items.forEach((el) =>
      el.addEventListener("click", () => scrollTo(Number(el.dataset.year), true)),
    );

    const openBy = () => {
      byModal.hidden = false;
      const current = Number(birthYear.value);
      scrollTo(years.includes(current) ? current : DEFAULT_YEAR, false);
      highlight();
    };
    const closeBy = () => {
      byModal.hidden = true;
      birthYear.focus();
    };

    birthYear.addEventListener("focus", openBy);
    birthYear.addEventListener("click", openBy);
    byModal.querySelector(".by-close").addEventListener("click", closeBy);
    byModal.querySelector(".by-modal-overlay").addEventListener("click", closeBy);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !byModal.hidden) closeBy();
    });

    confirm.addEventListener("click", () => {
      birthYear.value = picked;
      byModal.hidden = true;
      sync();
    });
  }

  // 직접 입력 시에도 숫자만 허용
  birthYear.addEventListener("input", () => {
    const digits = birthYear.value.replace(/\D/g, "");
    if (birthYear.value !== digits) birthYear.value = digits;
    sync();
  });

  genderBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasSelected = btn.classList.contains("is-selected");
      genderBtns.forEach((b) => b.classList.remove("is-selected"));
      if (!wasSelected) btn.classList.add("is-selected");
    });
  });

  /* ── 알림 권한 모달 ─────────────────────── */
  const ntModal = document.querySelector(".nt-modal");

  function collect() {
    const gender = genderBtns.find((b) => b.classList.contains("is-selected"));
    return {
      nickname: nickname.value.trim(),
      birthYear: birthYear.value,
      gender: gender ? gender.dataset.gender : null,
      referralCode: localStorage.getItem("storit.referralCode") || null,
    };
  }

  const NEXT = "welcome.html"; // 로딩 페이지 건너뛰고 welcome 으로 바로 이동

  cta.addEventListener("click", () => {
    if (cta.disabled) return;
    // TODO: 백엔드 연동 시 가입 API 호출 후 모달 표시
    const data = collect();
    console.log(data);
    // welcome 화면에서 닉네임 표시에 사용
    localStorage.setItem("storit.nickname", data.nickname);
    if (ntModal) ntModal.hidden = false;
  });

  if (ntModal) {
    const dismiss = () => {
      ntModal.hidden = true;
    };
    // 두 버튼 모두 다음 화면(로딩)으로 진행
    const proceed = () => {
      window.location.href = NEXT;
    };

    // X · 배경 · ESC 는 모달만 닫음 (userinfo 유지)
    ntModal.querySelector(".nt-close").addEventListener("click", dismiss);
    ntModal.querySelector(".nt-modal-overlay").addEventListener("click", dismiss);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !ntModal.hidden) dismiss();
    });

    // 나중에하기 → 그대로 진행
    ntModal.querySelector(".nt-btn--later").addEventListener("click", proceed);

    // 알림받기 → 권한 요청 후 진행
    ntModal.querySelector(".nt-btn--allow").addEventListener("click", async () => {
      if ("Notification" in window) {
        try {
          await Notification.requestPermission();
        } catch (e) {
          /* 사용자가 취소해도 흐름은 계속 */
        }
      }
      proceed();
    });
  }

  sync();

  /* ── 프로필 설정 모달 ────────────────────── */
  const modal = document.querySelector(".ui-modal");
  const openBtn = document.querySelector(".ui-badge-edit");
  if (!modal || !openBtn) return;

  const options = [...modal.querySelectorAll(".ui-avatar-option")];
  const preview = modal.querySelector(".ui-modal-preview");
  const pageAvatar = document.querySelector(".ui-avatar");
  const albumBtn = modal.querySelector(".ui-modal-album");
  const fileInput = modal.querySelector(".ui-file");
  const confirmBtn = modal.querySelector(".ui-modal-confirm");

  // 모달을 연 시점의 상태 — 취소 시 되돌리기 위함
  let snapshot = null;

  const open = () => {
    snapshot = {
      avatar: pageAvatar ? pageAvatar.innerHTML : "",
      selectedIndex: options.findIndex((o) => o.classList.contains("is-selected")),
    };
    modal.hidden = false;
    modal.querySelector(".ui-modal-close").focus();
  };

  /** 확정하지 않고 닫기 — 연 시점 상태로 복구 */
  const cancel = () => {
    if (snapshot) {
      preview.innerHTML = snapshot.avatar;
      if (pageAvatar) pageAvatar.innerHTML = snapshot.avatar;
      options.forEach((o, i) =>
        o.classList.toggle("is-selected", i === snapshot.selectedIndex),
      );
    }
    modal.hidden = true;
    openBtn.focus();
  };

  openBtn.addEventListener("click", open);
  modal.querySelector(".ui-modal-close").addEventListener("click", cancel);
  modal.querySelector(".ui-modal-overlay").addEventListener("click", cancel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) cancel();
  });

  // 아바타 선택 — 미리보기에만 반영, 확정은 [확인]
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("is-selected"));
      opt.classList.add("is-selected");
      preview.innerHTML = opt.querySelector("svg").outerHTML;
    });
  });

  // 앨범에서 사진 선택
  albumBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    options.forEach((o) => o.classList.remove("is-selected"));
    preview.innerHTML = `<img src="${url}" alt="" />`;
  });

  // 확인 — 미리보기를 페이지 아바타에 확정 반영
  confirmBtn.addEventListener("click", () => {
    if (pageAvatar) pageAvatar.innerHTML = preview.innerHTML;
    modal.hidden = true;
    openBtn.focus();
  });
})();
