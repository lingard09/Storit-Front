/**
 * 스토릿 - 오늘의 미션
 * 미션 카드 "바로가기" 버튼 동작.
 *   · 개발/데모: 누르면 해당 카드가 완료 상태로 전환(진행바 채움 + N/N + 완료 패널).
 *   · 출시(PRODUCTION=true): 실제 미션 화면(홈)으로 이동.
 */
(function () {
  // 출시 시 true 로 바꾸면 바로가기 → 홈화면 이동
  const PRODUCTION = false;
  const HOME_URL = "main.html";

  // ── 오늘 이미 쿠키를 구웠으면 "이미 구웠어요" 상태로 ──
  // (쿠키 획득 완료 화면 도달 시 cookie_reward.js 가 오늘 날짜를 기록)
  // 테스트: URL 파라미터 ?baked=1 (이미 구움) / ?baked=0 (일반) 로 강제 미리보기 가능.
  function today() {
    return new Date().toISOString().slice(0, 10);
  }
  const bakedParam = new URLSearchParams(location.search).get("baked");
  const isBaked =
    bakedParam !== null
      ? bakedParam === "1" || bakedParam === "true"
      : localStorage.getItem("storit.mission.bakedDate") === today();
  if (isBaked) {
    // 재료 5개 모두 완료 표시
    document.querySelectorAll(".ms-ing-circle").forEach((c) => {
      c.classList.add("is-done");
      const img = c.querySelector("img");
      if (img) img.classList.remove("is-dimmed");
      if (!c.querySelector(".ms-ing-check")) {
        const chk = document.createElement("span");
        chk.className = "ms-ing-check";
        chk.setAttribute("aria-hidden", "true");
        chk.innerHTML =
          '<svg viewBox="0 0 14 14" width="14" height="14"><path d="M3.4 7.2 L6 9.6 L10.6 4.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        c.appendChild(chk);
      }
    });
    // 미션 리스트 숨기고 "이미 구웠어요" 카드 표시
    const list = document.querySelector(".ms-list");
    const baked = document.querySelector(".ms-baked");
    if (list) list.hidden = true;
    if (baked) baked.hidden = false;
    return; // 이하 바로가기 등 인터랙션은 스킵
  }

  document.querySelectorAll(".ms-go").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (PRODUCTION) {
        location.href = HOME_URL;
        return;
      }
      completeCard(btn.closest(".ms-card"));
    });
  });

  // 데모: 카드를 완료 상태로 전환
  function completeCard(card) {
    if (!card) return;

    // 진행바 100%
    const fill = card.querySelector(".ms-bar-fill");
    if (fill) fill.style.width = "100%";

    // 카운트 N / M → M / M
    const count = card.querySelector(".ms-card-count");
    if (count) {
      const total = count.textContent.split("/")[1].trim();
      count.textContent = `${total} / ${total}`;
    }

    // 상태 패널: 바로가기 → 완료
    const status = card.querySelector(".ms-card-status");
    if (status) {
      status.classList.remove("is-todo");
      status.classList.add("is-done");
      status.innerHTML =
        '<span class="ms-pill">기본 재료</span>' +
        '<span class="ms-done"><img src="assets/icon_check_green.svg" alt="" />완료</span>';
    }

    // 재료 5개 모두 수집 완료 → 완료 페이지로 이동.
    // 쿠키는 여기서 지급하지 않고 "대기"만 걸어둔다.
    // 실제 지급은 "쿠키 획득 완료(cookie_reward)" 화면 도달 시에만 이뤄짐.
    if (document.querySelectorAll(".ms-card-status.is-todo").length === 0) {
      localStorage.setItem("storit.mission.rewardPending", "1");
      setTimeout(() => {
        location.href = "mission_done.html";
      }, 600);
    }
  }
})();
