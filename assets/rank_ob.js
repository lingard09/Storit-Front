/**
 * 스토릿 - 랭킹 온보딩 전환
 * 1초 후 자동으로 다음 페이지 이동, 화면 아무 곳이나 탭하면 즉시 이동.
 * 첫 페이지 진입 시 방문 기록을 남겨 다음부터는 온보딩을 건너뜀.
 */
(function () {
  const frame = document.querySelector(".rank-ob");
  if (!frame) return;

  // ?stay: 프리뷰 모드 (자동전환·방문기록 없이 탭으로만 이동)
  const stay = /(?:\?|&)stay\b/.test(location.search);

  // 첫 방문 기록 (첫 페이지에서만, 프리뷰 모드 제외)
  if (frame.hasAttribute("data-first") && !stay) {
    try {
      localStorage.setItem("rankObSeen", "1");
    } catch (e) {}
  }

  const next = frame.dataset.next;
  let done = false;

  function go() {
    if (done || !next) return;
    done = true;
    // 프리뷰 모드에서는 다음 페이지도 프리뷰로 유지
    window.location.href = stay ? next + "?stay" : next;
  }

  // 1초 후 자동 이동 (프리뷰 모드에서는 생략)
  const timer = stay ? null : setTimeout(go, 1000);

  // 탭 시 즉시 이동
  frame.addEventListener("click", () => {
    if (timer) clearTimeout(timer);
    go();
  });
})();
