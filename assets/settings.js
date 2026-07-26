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
  // 클릭 → 기기 푸시 권한 설정으로 이동 → 복귀 시 ON/OFF 반영
  const permBtn = document.querySelector(".se-perm");
  const permStatus = permBtn && permBtn.querySelector(".se-perm-status");
  if (permBtn && permStatus) {
    const LS_KEY = "storit.devicePush"; // 프로토타입 저장 상태
    const supported = "Notification" in window;

    // 표시 상태: 저장값 우선, 없으면 브라우저 권한에서 유추(기본 ON)
    const readState = () => {
      const saved = localStorage.getItem(LS_KEY);
      if (saved === "on" || saved === "off") return saved === "on";
      if (supported) return Notification.permission === "granted";
      return true;
    };
    const render = () => {
      const on = readState();
      permStatus.textContent = on ? "ON" : "OFF";
      permBtn.classList.toggle("is-on", on);
      permBtn.setAttribute(
        "aria-label",
        `기기 알림 권한 ${on ? "켜짐" : "꺼짐"}`
      );
    };

    permBtn.addEventListener("click", () => {
      // 아직 권한을 정하지 않았으면 실제 권한 요청(설정 이동 대체)
      if (supported && Notification.permission === "default") {
        Notification.requestPermission().then((p) => {
          localStorage.setItem(LS_KEY, p === "granted" ? "on" : "off");
          render();
        });
        return;
      }
      // 실제 앱: OS 푸시 권한 설정 화면으로 딥링크 이동
      // 프로토타입: 설정에서 변경 후 돌아온 흐름을 시뮬레이션
      localStorage.setItem(LS_KEY, readState() ? "off" : "on");
      render();
    });

    // 웹뷰에서 기기 설정 다녀온 뒤 복귀 시 상태 재동기화
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) render();
    });
    window.addEventListener("focus", render);
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
        location.href = "signup.html";
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
