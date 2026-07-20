/**
 * 스토릿 - 회원가입
 * 소셜 버튼 → 약관 동의 페이지
 * (실제 OAuth 연동 시 data-provider 값으로 분기)
 */
(function () {
  document.querySelectorAll(".su-social").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "terms.html";
    });
  });
})();
