var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/6a049859de615d1c36e51ed3/default';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();

/* "We Are Here!" attention bubble 강제 숨김 — Tawk.to 대시보드/CDN 무관 */

/* 1. CSS 즉시 차단 — title/src 키워드 기반 */
(function injectHideCSS() {
  var style = document.createElement('style');
  style.textContent =
    'iframe[title*="grabber" i],' +
    'iframe[title*="bubble" i],' +
    'iframe[title*="We Are Here" i],' +
    'iframe[title*="attention" i],' +
    'iframe[title*="proactive" i],' +
    'iframe[title*="greeting" i],' +
    'iframe[src*="proactive" i],' +
    'iframe[src*="attention" i],' +
    'iframe[src*="grabber" i] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; }';
  document.head.appendChild(style);
})();

/* 2. iframe 핸들러 — title/src 키워드 검사 */
function tawkHideMatch(node) {
  if (!node || node.tagName !== 'IFRAME') return false;
  var title = (node.title || '').toLowerCase();
  var src = (node.src || '').toLowerCase();
  return (
    title.indexOf('grabber') > -1 ||
    title.indexOf('bubble') > -1 ||
    title.indexOf('we are') > -1 ||
    title.indexOf('attention') > -1 ||
    title.indexOf('proactive') > -1 ||
    title.indexOf('greeting') > -1 ||
    src.indexOf('grabber') > -1 ||
    src.indexOf('attention') > -1 ||
    src.indexOf('proactive') > -1
  );
}
function tawkForceHide(node) {
  node.style.cssText = 'display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;width:0 !important;height:0 !important;';
}

/* 3. 즉시 폴링 (100ms) — DOM에 추가되는 즉시 잡기 */
(function pollHide() {
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    document.querySelectorAll('iframe').forEach(function (f) {
      if (tawkHideMatch(f)) tawkForceHide(f);
    });
    if (attempts >= 300) clearInterval(interval); // 30초 폴링
  }, 100);
})();

/* 4. MutationObserver — Tawk.to가 동적으로 iframe 추가하는 순간 잡기 */
(function observeMutations() {
  if (typeof MutationObserver === 'undefined') return;
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes && m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (tawkHideMatch(node)) tawkForceHide(node);
        // 자식 iframe도 검사
        if (node.querySelectorAll) {
          node.querySelectorAll('iframe').forEach(function (f) {
            if (tawkHideMatch(f)) tawkForceHide(f);
          });
        }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
