(function () {
  // ── 알림 데이터 ──────────────────────────────────
  // 백엔드 연동 시 이 배열만 교체하면 됨.
  // tab: "new"(새 소식) | "done"(확인 완료) | "notice"(공지사항)
  // 썸네일: assets/id<id>.svg (Figma 원본, 카드의 65×59 박스에 중앙 정렬)
  const NOTIFICATIONS = [
    { id: 1, tab: "new", title: "오늘의 퀴즈가 오픈됐어요!", desc: "새로운 쿠키를 구워볼 시간이에요.", time: "방금 전" },
    { id: 2, tab: "new", title: "새로운 웹툰이 등록되었어요!", desc: "퀴즈에 참여하고 쿠키를 받아가세요.", time: "방금 전" },
    { id: 3, tab: "new", title: "하트가 모두 충전됐어요!", desc: "아직 참여 가능한 퀴즈가 남아 있어요.", time: "방금 전" },
    { id: 4, tab: "new", title: "오늘의 미션이 남아 있어요!", desc: "자정 전에 참여하고 쿠키를 받아가세요.", time: "방금 전" },
    { id: 5, tab: "new", title: "아직 출석체크를 하지 않았어요!", desc: "자정 전에 참여하고 보상을 받아보세요.", time: "방금 전" },
    { id: 6, tab: "new", title: "TOP30 까지 12점 남았어요!", desc: "퀴즈에 참여하고 쿠키를 노려보세요.", time: "3분 전" },
    { id: 7, tab: "new", title: "오늘의 랭킹이 발표됐어요!", desc: "내 순위와 보상결과를 확인해보세요.", time: "3분 전" },
    { id: 8, tab: "new", title: "이번 시즌이 곧 종료돼요!", desc: "현재 순위와 참여 조건을 확인해보세요.", time: "3분 전" },
    { id: 9, tab: "new", title: "일간 랭킹 1등 보상을 받았어요!", desc: "1등을 기록해 쿠키 50개를 받았어요.", time: "10분 전" },
    { id: 10, tab: "new", title: "일간 TOP 30 보상을 받았어요!", desc: "보상으로 쿠키 1개를 받았어요.", time: "10분 전" },
    { id: 11, tab: "new", title: "오늘의 행운 등수에 당첨됐어요!", desc: "보상으로 쿠키 20개를 받았어요.", time: "10분 전" },
    { id: 12, tab: "new", title: "시즌 랭킹 보상을 받았어요!", desc: "1등을 기록해 쿠키 50개를 받았어요.", time: "10분 전" },
    { id: 13, tab: "new", title: "시즌 랭킹 보상을 받았어요!", desc: "2등을 기록해 쿠키 30개를 받았어요.", time: "10분 전" },
    { id: 14, tab: "new", title: "시즌 랭킹 보상을 받았어요!", desc: "3등을 기록해 쿠키 20개를 받았어요.", time: "10분 전" },
    { id: 15, tab: "new", title: "시즌 랭킹 보상을 받았어요!", desc: "5%를 기록해 쿠키 5개를 받았어요.", time: "10분 전" },
    { id: 16, tab: "new", title: "시즌 랭킹 보상을 받았어요!", desc: "10%를 기록해 쿠키 3개를 받았어요.", time: "10분 전" },
    { id: 17, tab: "new", title: "시즌 랭킹 보상을 받았어요!", desc: "20%를 기록해 쿠키 2개를 받았어요.", time: "10분 전" },
    { id: 18, tab: "new", title: "친구 초대 보상을 받았어요!", desc: "친구 가입으로 쿠키 2개를 받았어요.", time: "10분 전" },
    { id: 19, tab: "new", title: "친구 초대 보상을 받았어요!", desc: "코드 입력으로 쿠키 2개를 받았어요.", time: "10분 전" },
    { id: 20, tab: "new", title: "신규 이벤트가 시작됐어요!", desc: "7일 연속 출석 시 쿠키 3개 지급!", time: "3시간 전" },
    { id: 21, tab: "new", title: "문의에 답변이 도착했어요!", desc: "등록 이메일의 메일함을 확인해보세요.", time: "21시간 전" },
    { id: 22, tab: "new", title: "상품 기한이 얼마 남지 않았어요.", desc: "기한 전에 사용해주세요.", time: "7/1" },
    { id: 23, tab: "new", title: "퀴즈가 승인되었어요!", desc: "내 퀴즈가 세상 밖으로 나왔어요.", time: "6/10" },
    { id: 24, tab: "new", title: "퀴즈가 반려되었어요!", desc: "이유를 확인하고, 재등록해보세요.", time: "6/7" },

    // ── 확인 완료 ─────────────────────────────
    // thumb: 재사용할 원본 에셋 id (제목 매칭)
    { id: 101, tab: "done", thumb: 6, title: "TOP30 까지 12점 남았어요!", desc: "퀴즈 1개만 더 풀면 진입 가능!", time: "8/8" },
    { id: 102, tab: "done", thumb: 1, title: "오늘의 퀴즈가 오픈됐어요!", desc: "새로운 쿠키를 구워볼 시간이에요.", time: "8/9" },
    { id: 104, tab: "done", thumb: 20, title: "신규 이벤트가 시작됐어요!", desc: "7일 연속 출석 시 쿠키 3개 지급!", time: "5/3" },
    { id: 105, tab: "done", thumb: 23, title: "퀴즈가 승인되었어요!", desc: "내 퀴즈가 세상 밖으로 나왔어요.", time: "3/3" },
    { id: 106, tab: "done", thumb: 24, title: "퀴즈가 반려되었어요!", desc: "이유를 확인하고, 재등록 하세요.", time: "2/3" },

    // ── 공지사항 ─────────────────────────────
    // 시각 배지 대신 "확인하기" 버튼(action) 표시. 썸네일은 메가폰(id20)
    { id: 201, tab: "notice", thumb: 20, pinned: true, noticeId: 201, title: "새 공지사항이 등록되었어요!", desc: "스토릿에 오신 여러분을 환영합니다.", action: "확인하기" },
    { id: 202, tab: "notice", thumb: 20, noticeId: 202, title: "새 공지사항이 등록되었어요!", desc: "서비스 안정화를 위한 점검이 진행됩니다.", action: "확인하기" },
    { id: 203, tab: "notice", thumb: 20, noticeId: 203, title: "새 공지사항이 등록되었어요!", desc: "상점 공지 관련 오류 개선사항입니다.", action: "확인하기" },
    { id: 204, tab: "notice", thumb: 20, noticeId: 204, title: "새 공지사항이 등록되었어요!", desc: "스토릿에 오신 여러분을 환영합니다.", action: "확인하기" },
  ];

  const listEl = document.querySelector(".nt-list");
  const emptyEl = document.querySelector(".nt-empty");
  const tabs = [...document.querySelectorAll(".nt-tab")];
  if (!listEl) return;

  const VALID_TABS = ["new", "done", "notice"];

  // 빈 상태 미리보기 라우트: notifications.html?empty  (특정 탭: ?empty=notice)
  // empty 로 지정된 탭은 데이터가 있어도 강제로 빈 상태로 렌더한다.
  const params = new URLSearchParams(location.search);
  const emptyParam = params.get("empty"); // null | "" | "new"|"done"|"notice"
  const forceEmpty =
    emptyParam === null
      ? null // 파라미터 없음 → 일반 동작
      : VALID_TABS.includes(emptyParam)
        ? emptyParam // 특정 탭만 빈 상태
        : "all"; // ?empty (값 없음/기타) → 모든 탭 빈 상태

  // ?empty=<탭> 이면 해당 탭을 활성으로 시작
  let current = VALID_TABS.includes(emptyParam) ? emptyParam : "new";

  const escape = (s) =>
    String(s ?? "").replace(/[&<>"]/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    })[c]);

  function cardHTML(n) {
    // thumb 이 있으면 해당 에셋 재사용, 없으면 자기 id 에셋 사용
    const thumbId = n.thumb ?? n.id;
    // action 이 있으면 버튼(공지사항), 없으면 시각 배지
    const right = n.action
      ? `<button type="button" class="nt-card-btn">${escape(n.action)}</button>`
      : `<span class="nt-card-time">${escape(n.time)}</span>`;
    // 고정(핀) 공지면 우측 상단에 핀 아이콘
    const pin = n.pinned
      ? `<img class="nt-card-pin" src="assets/icon_pin.svg" alt="고정" />`
      : "";
    // noticeId 가 있으면 카드 전체가 상세 페이지로 이동
    const link = n.noticeId
      ? ` data-link="notice.html?id=${n.noticeId}"`
      : "";
    const clickable = n.noticeId ? " is-clickable" : "";
    return `<div class="nt-card${n.pinned ? " is-pinned" : ""}${clickable}"${link}>
      <div class="nt-card-thumb"><img src="assets/id${thumbId}.svg" alt="" /></div>
      <div class="nt-card-body">
        <p class="nt-card-title">${escape(n.title)}</p>
        <p class="nt-card-desc">${escape(n.desc)}</p>
      </div>
      ${right}
      ${pin}
    </div>`;
  }

  function render() {
    // 빈 상태 라우트에서 강제로 비울 탭이면 항목 없음 처리
    const isForcedEmpty = forceEmpty === "all" || forceEmpty === current;
    // 고정(핀) 공지를 목록 맨 위로 (동일 순위는 원래 순서 유지)
    const items = isForcedEmpty
      ? []
      : NOTIFICATIONS.filter((n) => n.tab === current).sort(
          (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
        );
    listEl.innerHTML = items.map(cardHTML).join("");
    if (emptyEl) emptyEl.hidden = items.length > 0;
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      current = btn.dataset.tab;
      render();
    });
  });

  // 카드 내 링크 버튼(확인하기 등) → 해당 페이지로 이동
  listEl.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (link) window.location.href = link.dataset.link;
  });

  // 시작 탭이 기본(new)과 다르면 활성 표시 동기화
  if (current !== "new") {
    tabs.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === current));
  }

  render();
})();
