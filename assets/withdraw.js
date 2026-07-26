(function () {
  const $ = (s) => document.querySelector(s);

  // ── 동의 체크 → 탈퇴 버튼 활성화 ──────────────
  const agree = $(".wd-agree-check");
  const submit = $(".wd-submit");
  if (agree && submit) {
    const sync = () => {
      submit.disabled = !agree.checked;
    };
    agree.addEventListener("change", sync);
    sync();

    submit.addEventListener("click", () => {
      if (submit.disabled) return;
      // TODO: 실제 회원 탈퇴 처리(계정 삭제 API)
      // 탈퇴 후 로그인 화면으로 이동
      location.href = "signup.html";
    });
  }
})();
