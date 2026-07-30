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

  function apply() {
    var scale = Math.min(
      window.innerWidth / DESIGN_W,
      window.innerHeight / DESIGN_H
    );
    scale = Math.min(scale, MAX_SCALE);
    document.documentElement.style.setProperty("--frame-scale", scale);
  }

  apply();
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);

  /* 모달 열림 감지: 프레임 안 딤 오버레이가 보이면 .has-open-modal 토글
     → base.css 가 프레임 클리핑을 풀어 딤이 좌우/상하 여백까지 덮게 함 */
  function initModalWatch() {
    var frame = document.querySelector(".frame");
    if (!frame || typeof MutationObserver === "undefined") return;

    function anyOverlayVisible() {
      // 딤 오버레이(-overlay) + 코치마크(-coach, box-shadow 스포트라이트 딤)도 포함
      var os = frame.querySelectorAll('[class*="-overlay"], [class*="-coach"]');
      for (var i = 0; i < os.length; i++) {
        // 보이는(레이아웃 박스가 있는) 요소가 하나라도 있으면 모달 열림
        if (os[i].getClientRects().length > 0) return true;
      }
      return false;
    }
    function update() {
      frame.classList.toggle("has-open-modal", anyOverlayVisible());
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
