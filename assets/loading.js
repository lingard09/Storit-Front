/**
 * 스토릿 - 로딩 화면
 * 일정 시간 후 메인으로 이동 (data-next 지정 시)
 */
(function () {
  const page = document.querySelector(".ld-page");
  if (!page) return;

  const next = page.dataset.next;
  const delay = Number(page.dataset.delay || 2500);

  if (!next) return; // 이동 대상 미지정 시 로딩 화면 유지

  setTimeout(() => {
    window.location.href = next;
  }, delay);
})();
