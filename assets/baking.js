/**
 * 스토릿 - 쿠키 굽는 중 (로딩)
 * 굽기 애니메이션을 잠시 보여준 뒤 쿠키 완성 화면으로 이동.
 */
(function () {
  const NEXT_URL = "cookie_complete.html";
  const DELAY_MS = 3500;
  setTimeout(() => {
    location.href = NEXT_URL;
  }, DELAY_MS);
})();
