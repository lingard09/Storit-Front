/**
 * 스토릿 - 메인 화면
 * TODO: 백엔드 연동 시 목록 API 응답으로 교체
 */
(function () {
  // creator: 유저 제작 퀴즈면 제작자명(없으면 공식) / url: 원작 보러가기 링크(네이버웹툰 검색)
  // TODO: 백엔드 연동 시 각 퀴즈의 실제 작품 URL(titleId 직링크)로 교체
  const WEBTOONS = [
    { title: "66666년 만에 환생한 흑마법사", thumb: 1, platform: 1, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기", creator: "무케대왕", url: "https://comic.naver.com/search?keyword=66666%EB%85%84%20%EB%A7%8C%EC%97%90%20%ED%99%98%EC%83%9D%ED%95%9C%20%ED%9D%91%EB%A7%88%EB%B2%95%EC%82%AC" },
    { title: "첫정", thumb: 2, platform: 2, tags: ["로맨스", "설렘폭발"], cta: "퀴즈\n풀기", url: "https://comic.naver.com/search?keyword=%EC%B2%AB%EC%A0%95" },
    { title: "A.I. 닥터", thumb: 5, platform: 3, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기", url: "https://comic.naver.com/search?keyword=A.I.%20%EB%8B%A5%ED%84%B0" },
    { title: "서포터가 다 해먹음", thumb: 3, platform: 1, tags: ["판타지", "마법"], cta: "퀴즈\n풀기", creator: "불꽃소녀", url: "https://comic.naver.com/search?keyword=%EC%84%9C%ED%8F%AC%ED%84%B0%EA%B0%80%20%EB%8B%A4%20%ED%95%B4%20%EB%A8%B9%EC%9D%8C" },
    { title: "회귀자의 은퇴 라이프", thumb: 4, platform: 1, tags: ["사이다", "사이다"], cta: "퀴즈\n풀기", url: "https://comic.naver.com/search?keyword=%ED%9A%8C%EA%B7%80%EC%9E%90%EC%9D%98%20%EC%9D%80%ED%87%B4%20%EB%9D%BC%EC%9D%B4%ED%94%84" },
  ];

  // 이미 푼 작품의 응시 기록 (quiz.js 가 작품 제목을 키로 저장)
  // TODO: 백엔드 연동 시 응시 이력 API 응답으로 교체
  const DONE_CTA = "결과\n보기";
  const quizRecords = (function () {
    let r;
    try {
      r = JSON.parse(localStorage.getItem("storit.quizResults") || "{}");
    } catch (e) {
      r = null;
    }
    return r && typeof r === "object" && !Array.isArray(r) ? r : {};
  })();

  const list = document.querySelector(".mn-list");
  if (list) {
    list.innerHTML = WEBTOONS.map((w, i) => {
      const done = Boolean(quizRecords[w.title]);
      return `
      <article class="mn-card">
        <img class="mn-card-thumb" src="assets/webtoon_${w.thumb}.png" alt="" />
        <div class="mn-card-main">
          <h3 class="mn-card-title">${w.title}</h3>
          <div class="mn-card-meta">
            <img src="assets/platform_${w.platform}.png" alt="" />
            ${w.tags.map((t) => `<span class="mn-tag">${t}</span>`).join("")}
          </div>
        </div>
        <button type="button" class="mn-card-cta${done ? " is-done" : ""}" data-idx="${i}">${(done ? DONE_CTA : w.cta).replace("\n", "<br>")}</button>
      </article>`;
    }).join("");

    // 퀴즈 풀기 → 퀴즈 화면 / 이미 푼 작품이면 결과 보기 → 결과 화면
    // (둘 다 제목·제작자·원작 링크를 전달)
    list.querySelectorAll(".mn-card-cta").forEach((btn) => {
      btn.addEventListener("click", () => {
        const w = WEBTOONS[Number(btn.dataset.idx)];
        sessionStorage.setItem("storit.quizTitle", w.title);
        if (w.creator) sessionStorage.setItem("storit.quizCreator", w.creator);
        else sessionStorage.removeItem("storit.quizCreator");
        if (w.url) sessionStorage.setItem("storit.quizUrl", w.url);
        else sessionStorage.removeItem("storit.quizUrl");

        const done = quizRecords[w.title];
        if (done) {
          // 저장된 기록을 결과 화면이 읽는 자리에 복원.
          // 재열람이므로 경험치 재지급·획득 팝업은 뜨지 않게 표시(result.js 가 소비)
          sessionStorage.setItem("storit.lastScore", String(done.score));
          sessionStorage.setItem("storit.quizTotal", String(done.total));
          sessionStorage.setItem("storit.quizElapsed", String(done.elapsed));
          sessionStorage.setItem("storit.resultReview", "1");
          window.location.href = "result.html";
          return;
        }
        window.location.href = "quiz.html";
      });
    });
  }

  // ── 오늘의 응원 한마디 (읽기 전용 피드) ──────────────────
  // 응원 "입력"은 퀴즈 완료 후 결과 화면에서만. 메인은 커뮤니티 응원을 보여주기만 함.
  (function initCheer() {
    const section = document.querySelector(".mn-cheer");
    if (!section) return;
    const listEl = section.querySelector(".mn-cheer-list");
    if (!listEl) return;

    // 커뮤니티 응원 (백엔드 연동 시 목록 API 응답으로 교체)
    // ?cheer=none 프리뷰: 응원이 하나도 없는 빈 상태 확인용
    const noCheer =
      new URLSearchParams(location.search).get("cheer") === "none";
    const COMMUNITY = noCheer
      ? []
      : [
          { msg: "오늘 내가 1등한데 오천냥 냠~", who: "불꽃소녀" },
          { msg: "미쳣다 오늘 왜이렄에 어려움", who: "행복전도사" },
          { msg: "행운의 쿠키 제발..", who: "열정베이커" },
        ];

    const nickname = localStorage.getItem("storit.nickname") || "나";
    const esc = (s) =>
      s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    // 결과 화면에서 남긴 내 응원이 있으면 맨 위(강조)에, 그 뒤 커뮤니티 응원
    const saved = localStorage.getItem("storit.myCheer");
    const rows = saved
      ? [{ msg: saved, who: nickname, mine: true }, ...COMMUNITY]
      : COMMUNITY;

    if (rows.length === 0) {
      // 응원이 하나도 없을 때: 첫 응원 유도 카드 (mn-cheer-empty)
      listEl.hidden = true;
      let empty = section.querySelector(".mn-cheer-empty");
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "mn-cheer-empty";
        empty.innerHTML =
          `<span class="mn-cheer-empty-msg">오늘의 첫 응원을 기다리고 있어요<br>` +
          `퀴즈를 풀고 작품에 첫 응원을 남겨보세요!</span>` +
          `<button type="button" class="mn-cheer-empty-tag">스토릿</button>`;
        section.appendChild(empty);
      }
      empty.hidden = false;
      return;
    }
    listEl.innerHTML = rows
      .map(
        (r) => `
        <div class="mn-cheer-row${r.mine ? " is-mine" : ""}">
          <span class="mn-cheer-msg">${esc(r.msg)}</span>
          <span class="mn-cheer-who">${esc(r.who)}</span>
        </div>`,
      )
      .join("");
    listEl.hidden = false;
  })();

  // ── 첫날(가입 24시간) 하트 무제한 이벤트 ──────────────────
  // welcome → main 첫 진입 시점을 기준으로 24시간. 재방문에도 유지되도록
  // 종료 시각을 localStorage 에 굽는다. 헤더 하트와 "오늘의 퀴즈" 바가 함께 이 상태를 따른다.
  // 미리보기: ?hearts=inf
  const HEARTS_PARAM = new URLSearchParams(location.search).get("hearts");
  const UNLIMITED_HEARTS = (function () {
    const FIRST_DAY_MS = 24 * 60 * 60 * 1000;
    if (
      sessionStorage.getItem("storit.showMainCoach") === "1" &&
      !localStorage.getItem("storit.firstDayEnd")
    ) {
      localStorage.setItem(
        "storit.firstDayEnd",
        String(Date.now() + FIRST_DAY_MS),
      );
    }
    const end = Number(localStorage.getItem("storit.firstDayEnd")) || 0;
    //return HEARTS_PARAM === "inf" || Date.now() < end;
    if (HEARTS_PARAM !== null) {
      return HEARTS_PARAM === "inf";
    }

return Date.now() < end;
  })();

  // 무제한 이벤트 중에는 "무료 기회 N회" 대신 "보유 하트 ∞"
  (function initQuizbarFree() {
    if (!UNLIMITED_HEARTS) return;
    
    const free = document.querySelector(".mn-quizbar-free");
    const sub = document.querySelector(".mn-quizbar-sub");
    if (!free || !sub) return;

    free.classList.add("is-unlimited");
    // 텍스트를 span 으로 감싸 아이콘과 동등한 flex 아이템으로 → 세로 중심 정렬
    free.innerHTML =
      `<span class="mn-quizbar-free-text">보유 하트</span>` +
      `<img class="mn-quizbar-inf" src="assets/bar_infinite.svg" alt="무제한" />`;
    // 실제 첫날 종료 시각 사용.
    // ?hearts=inf 미리보기에 저장값 없을 수 있어 24시간 기본값으로 표시 HH:MM 카운트 다운
    const storedEnd =
      Number(localStorage.getItem("storit.firstDayEnd")) || 0;
      
      const end =
        storedEnd > Date.now()
          ? storedEnd
          : Date.now() + 24 * 60 * 60 * 1000;

      function updateUnlimitedTime() {
        const totalMinutes = Math.max(
          0,
          Math.ceil((end - Date.now()) / (60 * 1000)),
        );

        if(totalMinutes >= 60) {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          sub.textContent = `무제한 종료까지 ${hours}시간 ${minutes}분`;
        }else {
          sub.textContent = `무제한 종료까지 ${totalMinutes}분`;
        }
      }
      updateUnlimitedTime();
      setInterval(updateUnlimitedTime, 60 * 1000);
  })();

  // ── 헤더 하트 / 리필 타이머 ──────────────────
  // MAX 이면 "하트 MAX!!", 하트가 줄면 채운+빈 하트 + 작은 하트 + "MM:SS 남음" 카운트다운
  (function initHearts() {
    const wrap = document.querySelector(".mn-hearts");
    if (!wrap) return;
    const row = wrap.querySelector(".mn-hearts-row");
    const pill = wrap.querySelector(".mn-hearts-pill");
    if (!row || !pill) return;

    const MAX = 2;
    const REFILL_SEC = 30 * 60; // 하트 1개 리필 30분

    // 현재 하트 값 우선순위:
    //   1) URL 쿼리 ?hearts=N  — 상태별 모습 미리보기용(예: main.html?hearts=0)
    //   2) localStorage "storit.hearts" — 백엔드/저장값 연동
    //   3) 미설정 시 데모로 줄어든 상태(1)
    const paramHearts = HEARTS_PARAM;
    const storedHearts = localStorage.getItem("storit.hearts");
    let hearts;
    if (paramHearts !== null) hearts = Number(paramHearts);
    else if (storedHearts !== null) hearts = Number(storedHearts);
    else hearts = 1;
    if (!Number.isFinite(hearts)) hearts = 1;
    hearts = Math.max(0, Math.min(MAX, hearts)); // 0 ~ MAX(2)

    const unlimited = UNLIMITED_HEARTS;
    // 일반 하트 상태의 오늘의 퀴즈 바 표시
    if (!unlimited) {
      const quizbarHeart = document.querySelector(".mn-quizbar-free");
     const quizbarSub = document.querySelector(".mn-quizbar-sub");

     if (quizbarHeart) {
       quizbarHeart.classList.remove("is-unlimited");
       quizbarHeart.textContent = `보유 하트 ${hearts}/${MAX}`;
     }

     if (quizbarSub) {
       quizbarSub.textContent = "30분마다 하트 1개 충전";
     }
   }

    function renderHearts() {
      // 무제한: 하트 만땅 + 두 번째 하트 가운데에 무한대 마크, 충전(+) 없음
      if (unlimited) {
        row.innerHTML =
          `<img src="assets/icon_heart.svg" alt="" />` +
          `<span class="mn-heart-inf">` +
          `<img src="assets/icon_heart.svg" alt="" />` +
          `<img class="mn-heart-inf-mark" src="assets/header_infinite.svg" alt="무제한" />` +
          `</span>`;
        return;
      }
      let html = "";
      for (let i = 0; i < MAX; i++) {
        const src = i < hearts ? "assets/icon_heart.svg" : "assets/icon_heart_empty.svg";
        html += `<img src="${src}" alt="" />`;
      }
      // 줄어든 상태: 하트 충전(+) 버튼 표시
      if (hearts < MAX) {
        html += `<button type="button" class="mn-heart-add" aria-label="하트 충전"><img src="assets/icon_heart_plus.svg" alt="" /></button>`;
      }
      row.innerHTML = html;
    }

    // 충전(+) 버튼 클릭 → 하트 충전 모달
    row.addEventListener("click", (e) => {
      if (e.target.closest(".mn-heart-add")) openHeartModal();
    });

    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const ss = s % 60;
      return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    };

    let remain = 28 * 60 + 45; // 시안값 28:45 (데모). 실제로는 서버 리필 시각 기준
    let timer = null;

    function showMax() {
      pill.textContent = "하트 MAX!!";
      pill.classList.remove("is-timer");
    }

    function tick() {
      if (hearts >= MAX) {
        showMax();
        if (timer) clearInterval(timer);
        return;
      }
      pill.classList.add("is-timer");
      pill.textContent = `${fmt(remain)} 남음`;
      if (remain <= 0) {
        hearts = Math.min(MAX, hearts + 1);
        renderHearts();
        remain = REFILL_SEC;
      } else {
        remain -= 1;
      }
    }

    // ── 하트 충전 모달 ──
    const modal = document.querySelector(".mn-heart-modal");
    function openHeartModal() {
      if (!modal) return;
      // 모달 하트는 헤더(메인)의 현재 하트 개수와 동일하게 — 채움/빈 표시
      const hh = modal.querySelector(".mn-hm-hearts");
      if (hh) {
        let html = "";
        for (let i = 0; i < MAX; i++) {
          const src =
            i < hearts ? "assets/heart_fill.svg" : "assets/heart_outline.svg";
          html += `<img src="${src}" alt="" />`;
        }
        hh.innerHTML = html;
      }
      modal.hidden = false;
    }
    function closeHeartModal() {
      if (modal) modal.hidden = true;
    }
    if (modal) {
      modal
        .querySelectorAll("[data-close-heart]")
        .forEach((el) => el.addEventListener("click", closeHeartModal));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) closeHeartModal();
      });
    }

    renderHearts();
    if (unlimited) {
      // 리필 카운트다운 없음 — 소모 자체가 없으므로
      pill.textContent = "첫날 무제한!";
      pill.classList.remove("is-timer");
    } else if (hearts >= MAX) {
      showMax();
    } else {
      tick();
      timer = setInterval(tick, 1000);
    }
  })();

  // 첫 진입 튜토리얼 코치 (welcome 에서 넘어온 경우 표시)
  const coach = document.querySelector(".mn-coach");
  if (coach && sessionStorage.getItem("storit.showMainCoach") === "1") {
    sessionStorage.removeItem("storit.showMainCoach");

    // 하이라이트 링·말풍선을 실제 "퀴즈 풀기" 버튼(첫 카드)에 맞춰 배치.
    // 버튼은 JS로 동적 생성되므로 좌표 하드코딩 대신 실측해서 감싼다.
    // (프레임이 --frame-scale 로 스케일되므로 스케일을 나눠 프레임 기준 좌표로 환산)
    const placeCoach = () => {
      const ring = coach.querySelector(".mn-coach-ring");
      const tip = coach.querySelector(".mn-coach-tip");
      const frame = document.querySelector(".frame");
      const btn = document.querySelector(".mn-list .mn-card-cta");
      if (!ring || !frame || !btn) return;
      const scale =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--frame-scale",
          ),
        ) || 1;
      const fr = frame.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const pad = 6; // 버튼과 링 사이 간격
      const x = (br.left - fr.left) / scale - pad;
      const y = (br.top - fr.top) / scale - pad;
      const w = br.width / scale + pad * 2;
      const h = br.height / scale + pad * 2;
      ring.style.left = x + "px";
      ring.style.top = y + "px";
      ring.style.width = w + "px";
      ring.style.height = h + "px";
      // 버튼 모서리 곡률에 맞춰 감싸기
      const radius = parseFloat(getComputedStyle(btn).borderRadius) || 10;
      ring.style.borderRadius = radius + pad + "px";
      // 말풍선: 링 위쪽, 화살표(75% 지점)가 링 중앙을 가리키도록
      if (tip) {
        const ringCx = x + w / 2;
        tip.style.left = ringCx - 0.75 * tip.offsetWidth + "px";
        tip.style.top = y - tip.offsetHeight - 18 + "px";
      }
    };

    coach.hidden = false;
    placeCoach();
    window.addEventListener("resize", placeCoach);
    coach.querySelector(".mn-sheet-cta").addEventListener("click", () => {
      coach.hidden = true;
      window.removeEventListener("resize", placeCoach);
      openFirstModal();
    });
  }

  // ── 첫 방문 하트 무제한 모달 ──
  // 코치 시트 "알겠어요!" 를 누르면 이어서 표시
  const firstModal = document.querySelector(".mn-first");
  function openFirstModal() {
    if (firstModal) firstModal.hidden = false;
  }
  if (firstModal) {
    firstModal.querySelectorAll("[data-close-first]").forEach((el) => {
      el.addEventListener("click", () => {
        firstModal.hidden = true;
      });
    });
    // "퀴즈 풀러 가기" → 첫 카드의 퀴즈 풀기와 동일 동작
    // (제목·제작자·원작 링크 저장 후 quiz.html 이동 로직을 그대로 재사용)
    const goBtn = firstModal.querySelector(".mn-first-cta");
    if (goBtn) {
      goBtn.addEventListener("click", () => {
        firstModal.hidden = true;
      });
    }

    // 프리뷰: main.html?first → 모달 바로 표시 (디자인 확인용)
    if (new URLSearchParams(location.search).has("first")) openFirstModal();
  }

  // 경험치 획득 모달 (쿠키 획득 완료 화면에서 "홈으로 가기" 로 넘어온 경우)
  const expModal = document.querySelector(".mn-exp");
  const expGain = sessionStorage.getItem("storit.showExpModal");
  if (expModal && expGain) {
    sessionStorage.removeItem("storit.showExpModal");
    const amt = expModal.querySelector(".mn-exp-amount");
    if (amt) amt.textContent = `+ ${expGain} EXP`;
    expModal.hidden = false;
    expModal.querySelectorAll("[data-close-exp]").forEach((el) => {
      el.addEventListener("click", () => {
        expModal.hidden = true;
      });
    });
  }

  // 레벨업 모달 — ?levelup 프리뷰 / 실제 레벨업 시 open
  // 실제 연동: openLevelUp(newLevel) 로 호출하면 동적으로 표시됨
  const lvModal = document.querySelector(".mn-levelup");
  const openLevelUp = (newLevel) => {
    if (!lvModal) return;
    const to = Number(newLevel);
    const from = to - 1;
    const setTxt = (sel, v) => {
      const e = lvModal.querySelector(sel);
      if (e) e.textContent = v;
    };
    setTxt(".mn-levelup-lv--from", `LV ${from}`);
    setTxt(".mn-levelup-lv--to", `LV ${to}`);
    // 매 5레벨 달성 시에만 보너스 쿠키 문구 + 캐릭터 양옆 쿠키 아이콘 노출
    const isBonusLevel = to % 5 === 0;
    const bonus = lvModal.querySelector(".mn-levelup-bonus");
    if (bonus) bonus.hidden = !isBonusLevel;
    lvModal.querySelectorAll(".mn-levelup-cookie").forEach((c) => {
      c.hidden = !isBonusLevel;
    });
    lvModal.hidden = false;
    lvModal.querySelectorAll("[data-close-levelup]").forEach((el) => {
      el.addEventListener("click", () => {
        lvModal.hidden = true;
      });
    });
  };
  const lvParams = new URLSearchParams(location.search);
  if (lvModal && lvParams.has("levelup")) {
    // ?levelup=N → 새 레벨 N (없으면 헤더 현재 레벨 +1)
    const curMatch = (
      document.querySelector(".mn-level-name")?.textContent || ""
    ).match(/(\d+)/);
    const curLevel = curMatch ? parseInt(curMatch[1], 10) : 8;
    openLevelUp(parseInt(lvParams.get("levelup"), 10) || curLevel + 1);
  }

  // 헤더 알림(종) → 알림 페이지로 이동
  const bell = document.querySelector(".mn-bell");
  if (bell) {
    bell.addEventListener("click", () => {
      window.location.href = "notifications.html";
    });
  }

  // 하단 네비게이션
  const navItems = [...document.querySelectorAll(".mn-nav-item")];
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 상점 → 상점 페이지로 이동
      if (btn.classList.contains("mn-nav-item--shop")) {
        window.location.href = "shop.html";
        return;
      }
      navItems.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      // TODO: 랭킹 / 마이페이지 페이지로 이동
    });
  });

  // 요일 탭
  // "전체" 와 오늘 이외의 요일은 아직 열리지 않은 회차 →
  // 카드 CTA 를 "N요일 오픈" 비활성 버튼으로 바꾼다.
  const days = [...document.querySelectorAll(".mn-day")];

  // 실제 오늘 요일로 초기 탭을 맞춘다 (마크업의 is-active 는 JS 미실행 시 폴백)
  const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
  const todayLabel = DAY_LABELS[new Date().getDay()];
  const todayBtn = days.find((b) => b.textContent.trim() === todayLabel);
  if (todayBtn) {
    days.forEach((b) => b.classList.remove("is-active"));
    todayBtn.classList.add("is-active");
  }

  function applyDayLock(label) {
    const locked = label !== "전체" && label !== todayLabel;
    document.querySelectorAll(".mn-list .mn-card-cta").forEach((btn) => {
      btn.classList.toggle("is-locked", locked);
      btn.disabled = locked;
      if (locked) {
        // 퀴즈 풀기와 같은 60x60 박스라 "퀴즈/풀기" 처럼 두 줄로 끊는다
        btn.innerHTML = `${label}요일<br>오픈`;
      } else {
        // 원래 라벨로 복귀 (이미 푼 작품이면 "결과 보기")
        const w = WEBTOONS[Number(btn.dataset.idx)];
        const done = Boolean(quizRecords[w.title]);
        btn.innerHTML = (done ? DONE_CTA : w.cta).replace("\n", "<br>");
      }
    });
  }

  days.forEach((btn) => {
    btn.addEventListener("click", () => {
      days.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyDayLock(btn.textContent.trim());
      // TODO: 선택 요일로 목록 필터링
    });
  });

  // 퀵 메뉴 타일
  const tiles = [...document.querySelectorAll(".mn-tile")];
  const invite = document.querySelector(".mn-invite");

  function openInvite() {
    if (invite) invite.hidden = false;
  }
  function closeInvite() {
    if (invite) invite.hidden = true;
  }

  tiles.forEach((tile) => {
    const label = tile.textContent.trim();
    tile.addEventListener("click", () => {
      if (label.includes("친구 초대")) openInvite();
      else if (label.includes("출석체크")) window.location.href = "checkin.html";
      // TODO: 오늘의 미션 / 내 퀴즈 연결
    });
  });

  // 친구 초대 모달 닫기 (딤/X)
  if (invite) {
    invite.querySelectorAll("[data-close-invite]").forEach((el) => {
      el.addEventListener("click", closeInvite);
    });

    // 초대 코드 복사 → 완료 토스트
    const codeBtn = invite.querySelector(".mn-iv-code");
    const codeText = invite.querySelector(".mn-iv-code-text");
    const toast = document.querySelector(".mn-toast");
    let toastTimer;
    function showToast() {
      if (!toast) return;
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.hidden = true;
      }, 1000);
    }
    // 복사되는 초대 메시지 (설치 링크는 배포 시 실제 URL 로 교체)
    const INSTALL_LINK = "";
    function inviteMessage(code) {
      return (
        "친구가 웹툰 퀴즈 리워드 커뮤니티 스토릿으로 초대했어요 🎁\n\n" +
        "웹툰 퀴즈를 풀고 쿠키 리워드를 받아보세요! 가입할 때 아래 초대코드를 입력하면 초대 보상도 받을 수 있어요.\n\n" +
        "초대코드: " + code + "\n\n" +
        "스토릿 시작하기 설치 링크: " + INSTALL_LINK
      );
    }
    if (codeBtn && codeText) {
      codeBtn.addEventListener("click", () => {
        const code = codeText.textContent.trim();
        const msg = inviteMessage(code);
        if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(() => {});
        showToast();
      });
    }

    // 친구 초대 별도 보상 보기 → 보상 안내 팝업
    const rewardLink = invite.querySelector(".mn-iv-reward");
    const rewardGuide = document.querySelector(".mn-reward-guide");
    if (rewardLink && rewardGuide) {
      rewardLink.addEventListener("click", () => {
        rewardGuide.hidden = false;
      });
      rewardGuide.querySelectorAll("[data-close-rg]").forEach((el) => {
        el.addEventListener("click", () => {
          rewardGuide.hidden = true;
        });
      });
    }
  }
})();
