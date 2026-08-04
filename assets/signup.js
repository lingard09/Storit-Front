/**
 * 스토릿 - 회원가입 / 로그인 (login.html 과 공용)
 * 소셜 버튼 → .su-socials[data-next] 로 이동
 *   회원가입: terms.html (약관 동의) — 기본값
 *   로그인  : main.html
 * (실제 OAuth 연동 시 data-provider 값으로 분기)
 */
(function () {
  const wrap = document.querySelector(".su-socials");
  const next = (wrap && wrap.dataset.next) || "terms.html";
  document.querySelectorAll(".su-social").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = next;
    });
  });
})();
