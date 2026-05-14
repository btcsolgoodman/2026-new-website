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

/* "We Are Here!" attention bubble 강제 숨김 — Tawk.to CDN 캐시 우회 */
(function injectHideCSS() {
  var style = document.createElement('style');
  style.textContent =
    'iframe[title*="grabber" i],' +
    'iframe[title*="bubble" i],' +
    'iframe[title*="We Are Here" i],' +
    'iframe[title*="attention" i],' +
    'iframe[title*="proactive" i] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }';
  document.head.appendChild(style);
})();

(function hideAttentionBubble() {
  var attempts = 0;
  var maxAttempts = 60;
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
        title.indexOf('proactive') > -1 ||
        src.indexOf('grabber') > -1 ||
        src.indexOf('attention') > -1 ||
        src.indexOf('proactive') > -1
      ) {
        f.style.cssText = 'display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;';
      }
    });
    if (attempts >= maxAttempts) clearInterval(interval);
  }, 500);
})();
