(function () {
  'use strict';

  var MEGA_MENU_HTML = '' +
    '<div class="mega-menu" aria-hidden="true">' +
    '  <div class="mega-menu__inner">' +
    '    <div class="mega-menu__col">' +
    '      <div class="mega-menu__heading">SPUTTER COATERS</div>' +
    '      <div class="mega-menu__list">' +
    '        <a href="/products/smc-22ts/" class="mega-menu__link"><strong>SMC-22TS</strong><em>Triple Gun Sputter</em></a>' +
    '        <a href="/products/smc-22ds/" class="mega-menu__link"><strong>SMC-22DS</strong><em>Dual Gun Sputter 쨌 2026</em></a>' +
    '        <a href="/products/smc-15s/" class="mega-menu__link"><strong>SMC-15S</strong><em>HV Sputter</em></a>' +
    '        <a href="/products/smc-10s/" class="mega-menu__link"><strong>SMC-10S</strong><em>Mini Sputter</em></a>' +
    '        <a href="/products/rs/" class="mega-menu__link"><strong>RS</strong><em>Rotary Sputter 쨌 2026</em></a>' +
    '        <a href="/products/rs-tf/" class="mega-menu__link"><strong>RS-TF</strong><em>Rotary Thin Film 쨌 2026</em></a>' +
    '      </div>' +
    '    </div>' +
    '    <div class="mega-menu__col">' +
    '      <div class="mega-menu__heading">CARBON COATERS</div>' +
    '      <div class="mega-menu__list">' +
    '        <a href="/products/smc-15e/" class="mega-menu__link"><strong>SMC-15E</strong><em>Auto Carbon Coater</em></a>' +
    '        <a href="/products/rs-carbon/" class="mega-menu__link"><strong>RS-Carbon</strong><em>Rotary Carbon 쨌 2026</em></a>' +
    '      </div>' +
    '    </div>' +
    '    <div class="mega-menu__col">' +
    '      <div class="mega-menu__heading">OSMIUM COATERS</div>' +
    '      <div class="mega-menu__list">' +
    '        <a href="/products/soc-12f/" class="mega-menu__link"><strong>SOC-12F</strong><em>Fume Integrated 쨌 Patented</em></a>' +
    '        <a href="/products/soc-12n/" class="mega-menu__link"><strong>SOC-12N</strong><em>Export Model</em></a>' +
    '      </div>' +
    '    </div>' +
    '    <div class="mega-menu__col">' +
    '      <div class="mega-menu__heading">GLOW DISCHARGE</div>' +
    '      <div class="mega-menu__list">' +
    '        <a href="/products/smc-10g/" class="mega-menu__link"><strong>SMC-10G</strong><em>Compact Plasma</em></a>' +
    '      </div>' +
    '    </div>' +
    '    <div class="mega-menu__col">' +
    '      <div class="mega-menu__heading">PLASMA CLEANERS</div>' +
    '      <div class="mega-menu__list">' +
    '        <a href="/products/plasma/" class="mega-menu__link"><strong>HPT Plasma Cleaner</strong><em>Coming Soon</em></a>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  function init() {
    var productsLink = document.querySelector('.primary-nav a[href="/products/"]');
    if (!productsLink) return;
    if (productsLink.closest('.primary-nav__group')) return;

    var group = document.createElement('div');
    group.className = 'primary-nav__group';

    productsLink.parentNode.insertBefore(group, productsLink);
    group.appendChild(productsLink);
    group.insertAdjacentHTML('beforeend', MEGA_MENU_HTML);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
