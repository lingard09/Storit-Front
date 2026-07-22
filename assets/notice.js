(function () {
  // ── 공지 데이터 ─────────────────────────────────
  // 최신순 정렬. 이전글 = 더 오래된 글(다음 인덱스), 다음글 = 더 최신 글(이전 인덱스).
  // 백엔드 연동 시 이 배열만 교체하면 됨.
  const NOTICES = [
    {
      id: 201,
      title: "스토릿에 오신 여러분을 환영합니다.",
      date: "2026.06.14 | 17:07",
      body: [
        "안녕하세요, 스토릿입니다.",
        "스토릿은 좋아하는 작품을 더 재미있게 즐길 수 있도록 만든 팬덤 퀴즈 커뮤니티입니다.",
        "작품을 읽고 퀴즈를 풀고, 포인트를 모으고, 랭킹에 도전해보세요. 앞으로 다양한 작품 퀴즈와 이벤트가 계속 업데이트될 예정입니다.",
        "스토릿에서 여러분만의 덕력을 마음껏 보여주세요!\n감사합니다.",
      ],
    },
    {
      id: 202,
      title: "서비스 안정화를 위한 점검이 진행됩니다.",
      date: "2026.06.10 | 10:00",
      body: [
        "안녕하세요, 스토릿입니다.",
        "더 안정적인 서비스 이용을 위해 아래 시간 동안 점검이 진행될 예정입니다.",
        "점검 시간 동안에는 일부 기능 이용이 제한될 수 있습니다.",
        "점검 일시: 2026.06.15 02:00 ~ 03:00\n점검 내용: 퀴즈 참여 및 포인트 시스템 안정화",
        "이용에 불편을 드려 죄송합니다. 더 나은 서비스로 보답하겠습니다.",
        "감사합니다.",
      ],
    },
    {
      id: 203,
      title: "상점 공지 관련 오류 개선사항입니다.",
      date: "2026.06.07 | 15:30",
      body: [
        "안녕하세요, 스토릿입니다.",
        "상점 이용 중 일부 상품이 정상적으로 표시되지 않던 오류를 개선했습니다.",
        "불편을 드려 죄송하며, 더 안정적인 이용 환경을 위해 계속 노력하겠습니다. 감사합니다.",
      ],
    },
    {
      id: 204,
      title: "스토릿에 오신 여러분을 환영합니다.",
      date: "2026.06.01 | 09:00",
      body: [
        "안녕하세요, 스토릿입니다.",
        "스토릿은 좋아하는 작품을 더 재미있게 즐길 수 있도록 만든 팬덤 퀴즈 커뮤니티입니다.",
        "작품을 읽고 퀴즈를 풀고, 포인트를 모으며 랭킹에 도전해보세요.",
        "스토릿에서 여러분만의 덕력을 마음껏 보여주세요!\n감사합니다.",
      ],
    },
  ];

  const escape = (s) =>
    String(s ?? "").replace(/[&<>"]/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    })[c]);

  // ?id=<공지 id>, 없으면 첫(최신) 공지
  const params = new URLSearchParams(location.search);
  const reqId = Number(params.get("id"));
  let index = NOTICES.findIndex((n) => n.id === reqId);
  if (index < 0) index = 0;
  const notice = NOTICES[index];

  // 제목 / 날짜
  document.querySelector(".nc-subject").textContent = notice.title;
  document.querySelector(".nc-date").textContent = notice.date;

  // 본문 (문단 사이 빈 줄, 문단 내 \n 은 줄바꿈)
  document.querySelector(".nc-content").innerHTML = notice.body
    .map((p) => escape(p).replace(/\n/g, "<br />"))
    .join("<br /><br />");

  // 이전글(더 오래됨) / 다음글(더 최신)
  const older = NOTICES[index + 1];
  const newer = NOTICES[index - 1];

  function setNav(selector, item, emptyText) {
    const el = document.querySelector(selector);
    const sub = el.querySelector(".nc-nav-sub");
    if (item) {
      sub.textContent = item.title;
      el.setAttribute("href", "notice.html?id=" + item.id);
    } else {
      sub.textContent = emptyText;
      el.removeAttribute("href");
      el.classList.add("is-disabled");
    }
  }

  setNav(".nc-prev", older, "이전 글이 없습니다.");
  setNav(".nc-next", newer, "다음 글이 없습니다.");
})();
