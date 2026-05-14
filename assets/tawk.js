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

/* Attention bubble ("We Are Here!") 자동 숨김 — Tawk.to 대시보드 설정과 무관하게 강제 차단 */
(function hideAttentionBubble() {
  var attempts = 0;
  var maxAttempts = 40; // ~20초 동안 시도
  var interval = setInterval(function () {
    attempts++;
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function (f) {
      var title = (f.title || '').toLowerCase();
      var src = (f.src || '').toLowerCase();
      if (
        title.indexOf('grabber') > -1 ||
        title.indexOf('bubble') > -1 ||
        title.indexOf('we are') > -1 ||
        title.indexOf('attention') > -1 ||
        src.indexOf('attention') > -1 ||
        src.indexOf('grabber') > -1
      ) {
        f.style.display = 'none';
        f.style.visibility = 'hidden';
        f.style.pointerEvents = 'none';
      }
    });
    if (attempts >= maxAttempts) clearInterval(interval);
  }, 500);
})();

/* CSS로도 한 번 더 확실하게 차단 */
(function injectHideCSS() {
  var style = document.createElement('style');
  style.textContent =
    'iframe[title*="grabber" i],' +
    'iframe[title*="bubble" i],' +
    'iframe[title*="We Are Here" i],' +
    'iframe[title*="attention" i] { display: none !important; visibility: hidden !important; }';
  document.head.appendChild(style);
})();
