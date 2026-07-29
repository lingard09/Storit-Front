(function () {
  const p = new URLSearchParams(location.search);
  const status = p.get("status") || "approved";
  const title = p.get("title");
  const date = p.get("date");
  const thumb = p.get("thumb");

  const BADGE = {
    approved: { label: "승인완료", cls: "is-approved" },
    review: { label: "심사 중", cls: "is-review" },
    rejected: { label: "반려", cls: "is-rejected" },
  };
  const b = BADGE[status] || BADGE.approved;

  const badge = document.querySelector(".qd-badge");
  if (badge) {
    badge.textContent = b.label;
    badge.className = "qd-badge " + b.cls;
  }
  if (title) document.querySelector(".qd-quiz-title").textContent = title;
  if (date) document.querySelector(".qd-quiz-date").textContent = "등록일 " + date;
  if (thumb) document.querySelector(".qd-quiz-thumb").src = thumb;

  // 승인 상태에서만 유저 참여 현황 · 내 퀴즈 평가 노출
  if (status !== "approved") {
    document
      .querySelectorAll(".qd-approved-only")
      .forEach((el) => (el.hidden = true));
  }

  // 반려 상태: 반려 사유 노출 + 하단 버튼 "재등록하기"
  if (status === "rejected") {
    const reject = document.querySelector(".qd-reject");
    if (reject) reject.hidden = false;
    const reason = p.get("reason");
    if (reason) document.querySelector(".qd-reject-reason").textContent = reason;
    const btn = document.querySelector(".qd-btn");
    if (btn) {
      btn.textContent = "재등록하기";
      // 재등록하기 → 퀴즈 생성 페이지로 (기본 onclick 의 myquiz.html 대체)
      btn.onclick = () => (location.href = "quizcreate.html");
    }
  }
})();
