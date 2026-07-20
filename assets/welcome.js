/**
 * 스토릿 - 환영 화면
 * 가입 시 입력한 닉네임을 표시
 */
(function () {
  const slot = document.querySelector(".wc-nickname");
  const cta = document.querySelector(".wc-cta");

  if (slot) {
    // TODO: 백엔드 연동 시 사용자 정보 API 값으로 교체
    const nickname = localStorage.getItem("storit.nickname");
    if (nickname) slot.textContent = nickname;
  }

  if (cta) {
    cta.addEventListener("click", () => {
      // 메인에서 첫 진입 튜토리얼 코치를 띄우도록 플래그 설정
      sessionStorage.setItem("storit.showMainCoach", "1");
      const next = cta.dataset.next;
      if (next) window.location.href = next;
    });
  }
})();
