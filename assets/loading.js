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

  const FADE = 500; // 전경 페이드아웃 시간(ms) — loading.css 트랜지션과 맞춤

  // 이동 직전 마지막 FADE 구간에 전경(로고·연기)을 페이드아웃 → 배경 공유로 자연스럽게 연결
  setTimeout(() => {
    document.body.classList.add("is-leaving");
  }, Math.max(0, delay - FADE));

  setTimeout(() => {
    window.location.href = next;
  }, delay);
})();
