/* 스토릿 - 폰 크기 대응(비율 스케일)
 * 375x812 고정 디자인 캔버스를 화면에 맞춰 비율 유지하며 확대/축소.
 * contain-fit: 가로/세로 중 작은 비율 사용 → 컴포넌트가 절대 잘리지 않고 항상 전체 표시.
 *   여백은 --bg(단색 페이지) 또는 페이지별 cover 배경(이미지 페이지)으로 채워 자연스럽게 이어짐.
 * head에서 동기 실행되어 첫 페인트 전에 --frame-scale을 설정(깜빡임 없음).
 */
(function () {
  var DESIGN_W = 375;
  var DESIGN_H = 812;
  var MAX_SCALE = 1.5; // 큰 화면(데스크톱)에서 과도한 확대 방지 — 폰 범위엔 영향 없음

  /* 세로 높이 기준 통일:
     CSS 의 100vh 는 "주소창이 숨겨졌다고 가정한" 큰 뷰포트라 실제 보이는 높이
     (window.innerHeight)와 다르다. 스케일은 innerHeight 로 잡는데 레이아웃은 100vh 로
     잡히면 프레임이 화면보다 큰 상자 안에서 중앙정렬되어 헤더가 아래로 밀린다.
     → 실측 높이를 --vh 로 발행하고 CSS 는 100vh 대신 이 값을 쓴다. */
  var lastW = 0;
  var lastH = 0;

  /* 키보드가 올라온 상태인지: 모바일(안드로이드 크롬 등)은 키보드가 뜨면
     innerHeight 가 확 줄어든다. 그대로 반영하면 타이핑 중 프레임 전체가 축소된다. */
  function keyboardOpen() {
    var el = document.activeElement;
    if (!el) return false;
    var tag = el.tagName;
    if (tag === "TEXTAREA") return true;
    if (tag !== "INPUT") return false;
    // 텍스트 입력 계열만 (버튼/체크박스 등은 키보드를 띄우지 않음)
    return !/^(button|submit|reset|checkbox|radio|file|range|image)$/i.test(
      el.type || "text"
    );
  }

  function apply() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // 가로폭은 그대로인데 높이만 줄었고 입력 요소에 포커스가 있으면 키보드로 보고
    // 직전 높이를 유지 (회전은 폭이 함께 바뀌므로 정상 반영됨)
    if (lastH && w === lastW && h < lastH && keyboardOpen()) h = lastH;
    lastW = w;
    lastH = h;

    var scale = Math.min(w / DESIGN_W, h / DESIGN_H);
    scale = Math.min(scale, MAX_SCALE);

    var root = document.documentElement.style;
    root.setProperty("--frame-scale", scale);
    root.setProperty("--vh", h + "px");
    // 프레임(중앙정렬)이 화면 높이를 다 못 채울 때 위쪽에 생기는 여백(화면 px).
    // 화면 상단에 붙는 고정 배경 바가 프레임 안 헤더와 아래변을 맞출 때 사용.
    root.setProperty(
      "--frame-top-gap",
      Math.max(0, (h - DESIGN_H * scale) / 2) + "px"
    );
  }

  apply();
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);
  // 주소창이 접히고 펴질 때 window resize 가 안 오는 브라우저(크롬 안드로이드 등) 대응
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", apply);
  }

  /* 모달 열림 감지: 프레임 안 딤 오버레이가 보이면 .has-open-modal 토글
     → base.css 가 프레임 클리핑을 풀어 딤이 좌우/상하 여백까지 덮게 함 */
  function initModalWatch() {
    var frame = document.querySelector(".frame");
    if (!frame || typeof MutationObserver === "undefined") return;

    function anyOverlayVisible() {
      // 딤 오버레이(-overlay) + 코치마크(-coach, box-shadow 스포트라이트 딤)
      // + 스포트라이트 딤(-spotlight, result 점수 설명 시트처럼 오버레이 요소가 따로 없는 경우)
      var os = frame.querySelectorAll(
        '[class*="-overlay"], [class*="-coach"], [class*="-spotlight"]',
      );
      for (var i = 0; i < os.length; i++) {
        // 보이는(레이아웃 박스가 있는) 요소가 하나라도 있으면 모달 열림
        if (os[i].getClientRects().length > 0) return true;
      }
      return false;
    }
    /* 모달 중에는 하단 네비를 프레임 안으로 옮긴다.
       프레임은 transform 때문에 자체 스택 컨텍스트라, 네비가 밖(body)에 있으면
       프레임 "전체보다 위/아래" 둘 중 하나뿐이라 본문에 가리거나 딤 위로 뜬다.
       프레임 안에 넣으면 본문 < 네비(z:10) < 딤·모달(z:50) 순서가 만들어진다.
       (전체 폭 유지 스타일은 base.css .frame.has-open-modal > .mn-nav) */
    function placeNav(open) {
      var nav = document.querySelector(".mn-nav");
      if (!nav) return;
      var target = open ? frame : document.body;
      if (nav.parentNode !== target) target.appendChild(nav);
    }

    function update() {
      var open = anyOverlayVisible();
      frame.classList.toggle("has-open-modal", open);
      placeNav(open);
    }
    new MutationObserver(update).observe(frame, {
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "style"],
    });
    update();
  }

  /* 하단 네비 / main 상단 헤더를 전체 폭 바로 만들기:
     프레임(375·contain) 밖 body 직속으로 옮겨 뷰포트 전체 폭에 내용이 펼쳐지도록 */
  function initFullWidthBars() {
    var nav = document.querySelector(".frame .mn-nav");
    if (nav) {
      document.body.appendChild(nav);
      document.body.classList.add("has-mn-nav");
    }
    // 헤더는 프레임 안에 유지한다.
    // (전에 body 로 옮겨 전체 폭 flex 로 폈더니, 모바일 뷰처럼 레이아웃 폭이
    //  보이는 폭보다 넓어지는 상황에서 헤더 우측 요소가 화면 밖으로 잘리는 문제가 있었음.
    //  프레임 안에 두면 프레임 스케일·중앙정렬을 그대로 타 어떤 폭에서도 안 잘리고
    //  본문과 정렬됨. 전체 폭 갈색 바는 body::before 가 담당.)
  }

  /* terms.html(약관 체크리스트) · sheet-page(referral·userinfo)의 뒤로가기 버튼을
     화면 좌상단 코너로: 이 페이지들은 375 스케일 프레임(중앙정렬)이라 프레임 안 백버튼이
     스케일(예: 50→52.4px)·오프셋되어, 전폭 문서(약관 상세) 백버튼과 크기·위치가 어긋난다.
     → body 직속으로 옮겨 언스케일 50px 로 뷰포트 좌상단에 고정(상세 페이지와 동일 좌표).
     단, .terms-doc(약관 상세: 이미 전폭)은 이동하지 않는다. */
  function initTermsBack() {
    if (document.querySelector(".terms-doc")) return;
    var back = document.querySelector(".frame .terms-back, .frame .sheet-back");
    if (back) {
      document.body.appendChild(back);
      document.body.classList.add("has-terms-back");
    }
  }

  function initDom() {
    initFullWidthBars();
    initTermsBack();
    initModalWatch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDom);
  } else {
    initDom();
  }
})();
