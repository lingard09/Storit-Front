/**
 * 스토릿 - 초대 코드 입력
 *
 * 규칙
 *  - 선택 입력: 미입력 시에도 [다음] 진행 가능
 *  - 입력 시 공백 제거 + 대문자 변환
 *  - 적용 성공 / 오류 메시지 표시
 *  - 이미 적용된 계정은 재적용 불가
 *  - 실제 보상은 가입 완료 시점에 지급 (여기서는 코드만 보관)
 */
(function () {
  const input = document.querySelector(".rf-input");
  const applyBtn = document.querySelector(".rf-apply");
  const msg = document.querySelector(".rf-msg");
  const next = document.querySelector(".sheet-cta");
  if (!input || !applyBtn || !msg) return;

  const STORE_KEY = "storit.referralCode";
  const card = document.querySelector(".rf-card");

  const MSG_OK = "초대코드가 적용되었어요! 가입 완료 후 쿠키 2개가 지급돼요.";
  const MSG_ERROR = "유효하지 않은 초대코드예요. 다시 확인해주세요.";

  const normalize = (v) => v.replace(/\s+/g, "").toUpperCase();

  function setMessage(text, kind) {
    msg.textContent = text;
    msg.classList.remove("is-ok", "is-error");
    if (kind) msg.classList.add(kind);
    card.classList.toggle("has-msg", Boolean(text));
  }

  /** 적용 완료 상태로 잠금 (재적용 불가) */
  function lock(code) {
    input.value = code;
    input.disabled = true;
    applyBtn.disabled = true;
    setMessage(MSG_OK, "is-ok");
  }

  /**
   * TODO: 백엔드 연동 시 실제 검증 API로 교체
   * 현재는 형식 검증만 수행 (영숫자 4~16자)
   */
  function verify(code) {
    return Promise.resolve(/^[A-Z0-9]{4,16}$/.test(code));
  }

  // 이미 적용한 계정이면 잠금 상태로 시작
  const applied = localStorage.getItem(STORE_KEY);
  if (applied) lock(applied);

  input.addEventListener("input", () => {
    const start = input.selectionStart;
    const before = input.value;
    const after = normalize(before);
    if (before !== after) {
      input.value = after;
      input.setSelectionRange(start - (before.length - after.length), start - (before.length - after.length));
    }
    applyBtn.disabled = after.length === 0;
    if (msg.textContent) setMessage("", null);
  });

  applyBtn.addEventListener("click", async () => {
    const code = normalize(input.value);
    if (!code) return;

    applyBtn.disabled = true;
    const ok = await verify(code);

    if (ok) {
      localStorage.setItem(STORE_KEY, code);
      lock(code);
    } else {
      setMessage(MSG_ERROR, "is-error");
      applyBtn.disabled = false;
    }
  });

  // 미입력이어도 항상 다음 단계로 진행 가능
  if (next) {
    next.addEventListener("click", () => {
      window.location.href = next.dataset.next || "#";
    });
  }
})();
