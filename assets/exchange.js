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

  submit.addEventListener("click", () => {
    if (submit.disabled) return;
    // TODO: 교환 신청 API 연동
    alert("교환 신청이 완료되었습니다!");
  });
})();
