(function () {
  // ── 알림 토글 (프로토타입: 상태만 전환) ──────────
  // TODO: 백엔드 연동 시 알림 설정 저장 API 연결
  document.querySelectorAll(".se-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.classList.toggle("is-on");
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
  });

  // ── 기기 알림 권한 (앱 자체 푸시 권한) ──────────────
  // 누를 때마다 ON/OFF 전환하고 상태를 저장한다.
  // TODO: 실제 앱에서는 OS 푸시 권한 설정 화면으로 딥링크 → 복귀 시 실제 권한값으로 동기화.
  //   (예전엔 여기서 Notification.requestPermission() 을 호출했는데, 권한이 'default' 일 때
  //    첫 클릭이 권한 요청으로 소비되고 거부되면 화면이 안 바뀌어 "안 눌린다"고 보였다.
  //    프로토타입에서는 브라우저 권한 팝업을 띄우지 않고 상태만 전환한다.)
  const permBtn = document.querySelector(".se-perm");
  const permStatus = permBtn && permBtn.querySelector(".se-perm-status");
  if (permBtn && permStatus) {
    const LS_KEY = "storit.devicePush";

    // 저장값이 없으면 기본 ON (마크업 기본 상태와 동일)
    const readState = () => localStorage.getItem(LS_KEY) !== "off";

    const render = () => {
      const on = readState();
      permStatus.textContent = on ? "ON" : "OFF";
      permBtn.classList.toggle("is-on", on);
      permBtn.setAttribute("aria-pressed", on ? "true" : "false");
      permBtn.setAttribute(
        "aria-label",
        `기기 알림 권한 ${on ? "켜짐" : "꺼짐"}`
      );
    };

    permBtn.addEventListener("click", () => {
      localStorage.setItem(LS_KEY, readState() ? "off" : "on");
      render();
    });

    // 실제 연동 시: 기기 설정 다녀온 뒤 복귀하면 상태 재동기화
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) render();
    });
    window.addEventListener("pageshow", render);

    render();
  }

  // ── 로그아웃 확인 모달 ──────────────────────────
  const logoutModal = document.querySelector(".se-logout-modal");
  if (logoutModal) {
    document.querySelectorAll(".se-link").forEach((link) => {
      const label = link.querySelector(".se-link-label");
      if (label && label.textContent.trim() === "로그아웃") {
        link.addEventListener("click", () => {
          logoutModal.hidden = false;
        });
      }
    });
    // 머무르기 · X · 오버레이 → 닫기
    logoutModal.querySelectorAll("[data-logout-close]").forEach((el) => {
      el.addEventListener("click", () => {
        logoutModal.hidden = true;
      });
    });
    // 로그아웃 → 로그인 화면으로 이동
    const goBtn = logoutModal.querySelector(".se-logout-go");
    if (goBtn) {
      goBtn.addEventListener("click", () => {
        // TODO: 실제 로그아웃(세션 만료) 처리
        location.href = "login.html";
      });
    }
  }

  // 회원 탈퇴 확인 (프로토타입)
  document.querySelectorAll(".se-link").forEach((link) => {
    const label = link.querySelector(".se-link-label");
    if (label && label.textContent.trim() === "회원 탈퇴") {
      link.addEventListener("click", () => {
        // TODO: 실제 탈퇴 플로우 연결
      });
    }
  });
})();
