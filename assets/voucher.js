(function () {
  const copyBtn = document.querySelector(".vc-barcode-copy");
  const numEl = document.querySelector(".vc-barcode-num");
  const toast = document.querySelector(".vc-toast");
  if (!copyBtn || !numEl) return;

  let hideTimer = null;

  const showToast = () => {
    if (!toast) return;
    toast.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  };

  copyBtn.addEventListener("click", () => {
    const code = numEl.textContent.replace(/\s+/g, "");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    showToast();
  });

  // 오버레이 클릭 시 즉시 닫기
  if (toast) {
    toast.querySelectorAll("[data-toast-close]").forEach((el) => {
      el.addEventListener("click", () => {
        clearTimeout(hideTimer);
        toast.hidden = true;
      });
    });
  }
})();
