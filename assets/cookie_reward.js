/**
 * 스토릿 - 쿠키 획득 완료
 * 쿠키 지급은 "이 화면에 도달했을 때"만 이뤄진다.
 *   · 미션을 전부 완료하면 mission.js 가 대기 플래그(storit.mission.rewardPending)만 설정.
 *   · 이 화면에서 그 플래그가 있으면 실제로 보유 쿠키를 +1 지급하고 플래그를 제거(1회만).
 *   · 플래그 없이(직접 방문/새로고침) 들어오면 지급하지 않고 현재 보유량만 표시.
 */
(function () {
  var REWARD = 1;
  var KEY_BALANCE = "storit.cookies";
  var KEY_PENDING = "storit.mission.rewardPending";

  var balance = parseInt(localStorage.getItem(KEY_BALANCE), 10);
  if (!isFinite(balance)) balance = 4; // 데모 기본 보유량

  var before = balance;
  var granted = localStorage.getItem(KEY_PENDING) === "1";

  if (granted) {
    balance += REWARD;
    localStorage.setItem(KEY_BALANCE, String(balance));
    localStorage.removeItem(KEY_PENDING); // 1회만 지급
    // 오늘 쿠키를 구움 → 미션 재진입 시 "이미 구웠어요" 표시용 날짜 기록
    localStorage.setItem(
      "storit.mission.bakedDate",
      new Date().toISOString().slice(0, 10),
    );
  }

  var beforeEl = document.querySelector(".cr-count-before");
  var afterEl = document.querySelector(".cr-count-after");
  if (beforeEl) beforeEl.textContent = before;
  // 이 화면은 쿠키 획득 완료 화면 → 항상 "획득 후"(before + REWARD)를 표시
  if (afterEl) afterEl.textContent = before + REWARD;

  // "홈으로 가기" → 경험치 30 EXP 획득 플래그 세팅 후 메인으로 이동
  // (메인화면에서 mn-exp 모달이 뜸)
  var homeBtn = document.querySelector(".cr-home-btn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      sessionStorage.setItem("storit.showExpModal", "30");
      location.href = "main.html";
    });
  }
})();
