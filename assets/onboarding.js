/**
 * 스토릿 - 온보딩 페이지 전환
 * 탭 또는 좌측 스와이프로 다음 온보딩 페이지 이동
 */
(function () {
  const frame = document.querySelector(".onboarding");
  if (!frame) return;

  const next = frame.dataset.next;
  const prev = frame.dataset.prev;

  function go(url) {
    if (url) window.location.href = url;
  }

  const cta = frame.querySelector(".ob-cta");
  if (cta) {
    cta.addEventListener("click", (e) => {
      e.stopPropagation();
      go(next);
    });
  }

  frame.addEventListener("click", () => go(next));

  // 스와이프
  let startX = null;

  frame.addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  frame.addEventListener(
    "touchend",
    (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;

      if (dx < -50) go(next);
      else if (dx > 50) go(prev);
    },
    { passive: true },
  );
})();
