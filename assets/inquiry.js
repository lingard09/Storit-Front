(function () {
  const $ = (s, r = document) => r.querySelector(s);

  // ── 문의 유형 칩 (단일 선택) ──────────────────
  const TYPES = [
    { label: "계정/로그인", emoji: "👤" },
    { label: "퀴즈/정답 오류", emoji: "📝" },
    { label: "랭킹/점수", emoji: "🏆" },
    { label: "보상/상점", emoji: "🍪" },
    { label: "내 웹툰 퀴즈/심사", emoji: "✏️" },
    { label: "오류/버그", emoji: "🛠️" },
    { label: "기타 문의", emoji: "💬" },
  ];
  const typesWrap = $(".iq-types");
  typesWrap.innerHTML = TYPES.map(
    (t) =>
      `<button type="button" class="iq-type" data-type="${t.label}">` +
      `<span class="iq-type-emoji">${t.emoji}</span>${t.label}</button>`
  ).join("");

  const typeBtns = Array.from(typesWrap.querySelectorAll(".iq-type"));
  let selectedType = null;
  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedType = btn.dataset.type;
      typeBtns.forEach((b) => b.classList.toggle("is-selected", b === btn));
      typesWrap.classList.add("has-selection");
      updateSubmit();
    });
  });

  // ── 이메일 검증 ───────────────────────────────
  const email = $(".iq-email");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = () => EMAIL_RE.test(email.value.trim());
  email.addEventListener("input", () => {
    // 입력 중엔 값이 있고 형식이 틀릴 때만 빨갛게
    const v = email.value.trim();
    email.classList.toggle("is-invalid", v !== "" && !emailValid());
    updateSubmit();
  });

  // ── 문의 내용 글자 수 ─────────────────────────
  const content = $(".iq-content");
  const count = $(".iq-count");
  content.addEventListener("input", () => {
    count.textContent = content.value.length;
    updateSubmit();
  });

  // ── 스크린샷 첨부 (최대 5, 선택) ──────────────
  const attachBtn = $(".iq-attach");
  const fileInput = $(".iq-file");
  const attachN = $(".iq-attach-n");
  let files = [];
  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    files = files.concat(Array.from(fileInput.files)).slice(0, 5);
    attachN.textContent = files.length;
    fileInput.value = ""; // 같은 파일 재선택 허용
  });

  // ── 제출 활성화 (필수: 유형 + 이메일 + 내용) ──
  const submit = $(".iq-submit");
  function updateSubmit() {
    const ok =
      !!selectedType && emailValid() && content.value.trim().length > 0;
    submit.disabled = !ok;
  }

  // ── 제출 ──────────────────────────────────────
  $("#iq-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    // TODO: 백엔드 문의 접수 API 연동
    // 접수 후 완료 페이지로 이동
    location.href = "inquiry_complete.html";
  });
})();
