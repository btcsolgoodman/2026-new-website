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

/* "We Are Here!" attention bubble 강제 숨김 — iframe + div + ID 패턴 다중 차단 */

/* Tawk attention bubble은 iframe이 아니라 div로 추가되며 inline style로 강제됨.
   div ID 패턴 (예: aclp7oj6424c1778725184889) 도 같이 차단. */

function tawkHideMatch(node) {
  if (!node || node.nodeType !== 1) return false;
  var id = node.id || '';
  var tag = node.tagName;

  // 1. Tawk.to 무작위 ID 패턴 (aclp로 시작 + 알파숫자) — div도 잡힘
  if (/^aclp[a-z0-9]+$/i.test(id)) return true;

  // 2. iframe — title / src 키워드
  if (tag === 'IFRAME') {
    var title = (node.title || '').toLowerCase();
    var src = (node.src || '').toLowerCase();
    if (
      title.indexOf('grabber') > -1 ||
      title.indexOf('bubble') > -1 ||
      title.indexOf('we are') > -1 ||
      title.indexOf('attention') > -1 ||
      title.indexOf('proactive') > -1 ||
      title.indexOf('greeting') > -1 ||
      src.indexOf('proactive') > -1 ||
      src.indexOf('attention') > -1 ||
      src.indexOf('grabber') > -1
    ) return true;
  }

  // 3. div 내부 텍스트 검사 — "We are here" 등
  if (tag === 'DIV') {
    var html = (node.innerHTML || '').toLowerCase();
    if (
      html.indexOf('we are here') > -1 ||
      html.indexOf("we're here") > -1 ||
      html.indexOf('attention-grabber') > -1
    ) return true;
  }

  return false;
}

function tawkForceHide(node) {
  node.style.cssText = 'display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;width:0 !important;height:0 !important;';
  node.setAttribute('data-hidden-by-semian', 'true');
}

/* 1. CSS — ID 패턴 + title/src 키워드 */
(function injectHideCSS() {
  var style = document.createElement('style');
  style.textContent =
    'div[id^="aclp"],' +
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

/* 2. 폴링 100ms (60초간) */
(function pollHide() {
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    document.querySelectorAll('div, iframe').forEach(function (n) {
      if (tawkHideMatch(n)) tawkForceHide(n);
    });
    if (attempts >= 600) clearInterval(interval);
  }, 100);
})();

/* 3. MutationObserver — childList + attributes 둘 다 감시 (style 재설정도 잡음) */
(function observeMutations() {
  if (typeof MutationObserver === 'undefined') return;
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      // 새 노드 추가
      if (m.addedNodes) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (tawkHideMatch(node)) tawkForceHide(node);
          if (node.querySelectorAll) {
            node.querySelectorAll('div, iframe').forEach(function (f) {
              if (tawkHideMatch(f)) tawkForceHide(f);
            });
          }
        });
      }
      // 기존 노드의 style/class 변경 (Tawk이 다시 보이게 하려고 시도)
      if (m.type === 'attributes' && m.target) {
        if (tawkHideMatch(m.target) && !m.target.hasAttribute('data-hidden-by-semian')) {
          tawkForceHide(m.target);
        } else if (m.target.hasAttribute('data-hidden-by-semian')) {
          // 이미 숨겼는데 style이 다시 바뀜 → 다시 강제 숨김
          tawkForceHide(m.target);
        }
      }
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
})();
