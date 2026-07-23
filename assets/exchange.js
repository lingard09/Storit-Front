(function () {
  const agree = document.querySelector(".ex-agree");
  const box = document.querySelector(".ex-agree-box");
  const submit = document.querySelector(".ex-submit");
  if (!agree || !box || !submit) return;

  let checked = false;

  agree.addEventListener("click", () => {
    checked = !checked;
    agree.setAttribute("aria-pressed", String(checked));
    box.src = checked ? "assets/icon_check_lg_on.svg" : "assets/icon_check_lg.svg";
    submit.disabled = !checked;
  });

  const failModal = document.querySelector(".ex-fail");
  const lackModal = document.querySelector(".ex-lack");

  // 보유/필요 쿠키 (백엔드 연동 시 교체)
  const MY_COOKIES = 80;
  const PRICE = 50;

  submit.addEventListener("click", () => {
    if (submit.disabled) return;
    // 보유 쿠키가 부족하면 부족 모달, 아니면 교환 시도 (실패 시 실패 모달)
    if (MY_COOKIES < PRICE) {
      if (lackModal) lackModal.hidden = false;
      return;
    }
    // TODO: 교환 신청 API 연동 (실패 시 실패 모달 노출)
    if (failModal) failModal.hidden = false;
  });

  // 모든 모달 닫기 버튼 (오버레이 / X / 확인)
  document.querySelectorAll(".ex-modal").forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", () => {
        modal.hidden = true;
      });
    });
  });

  // 실패 모달의 확인 → 교환 완료 페이지로 이동
  const failOk = failModal && failModal.querySelector(".ex-modal-ok");
  if (failOk) {
    failOk.addEventListener("click", () => {
      location.href = "complete.html";
    });
  }
})();
