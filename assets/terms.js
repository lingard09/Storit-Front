/**
 * 스토릿 - 이용약관 동의
 * 전체 동의 토글 + 필수 약관 충족 시 다음 버튼 활성화(노란색)
 */
(function () {
  const all = document.querySelector(".terms-all");
  const rows = [...document.querySelectorAll(".terms-row")];
  const cta = document.querySelector(".terms-cta");
  if (!all || !rows.length) return;

  const isOn = (el) => el.classList.contains("is-checked");

  function sync() {
    all.classList.toggle("is-checked", rows.every(isOn));

    const requiredOk = rows
      .filter((r) => r.querySelector('[data-required="true"]'))
      .every(isOn);

    if (cta) cta.classList.toggle("is-active", requiredOk);
  }

  all.addEventListener("click", () => {
    const next = !isOn(all);
    rows.forEach((r) => r.classList.toggle("is-checked", next));
    sync();
  });

  rows.forEach((row) => {
    row.querySelector(".terms-row-main").addEventListener("click", () => {
      row.classList.toggle("is-checked");
      sync();
    });
  });

  // 다음 버튼: 필수 약관이 모두 체크(is-active)됐을 때만 이동
  if (cta) {
    cta.addEventListener("click", () => {
      if (cta.classList.contains("is-active")) {
        location.href = "referral.html";
      }
    });
  }

  sync();
})();
