/**
 * Product Page Interactions
 * - Sticky CTA visibility (appears after scrolling past hero)
 * - Tab navigation active state (scroll-spy)
 * - Smooth scroll to anchor on tab click
 */
(function() {
  'use strict';

  // ---- Sticky CTA: show after scrolling past hero ----
  const stickyCta = document.getElementById('sticky-cta');
  const hero = document.querySelector('.page-hero');

  if (stickyCta && hero) {
    const heroHeight = hero.offsetHeight;
    const toggleStickyCta = () => {
      if (window.scrollY > heroHeight * 0.6) {
        stickyCta.classList.add('is-visible');
      } else {
        stickyCta.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', toggleStickyCta, { passive: true });
    toggleStickyCta();
  }

  // ---- Tab navigation: scroll-spy active state ----
  const tabs = document.querySelectorAll('.product-tabs__link');
  if (tabs.length === 0) return;

  const sectionMap = new Map();
  tabs.forEach(tab => {
    const href = tab.getAttribute('href');
    if (href && href.startsWith('#')) {
      const id = href.slice(1);
      const section = document.getElementById(id);
      if (section) sectionMap.set(id, { tab, section });
    }
  });

  const updateActiveTab = () => {
    const scrollPos = window.scrollY + 200;
    let currentId = null;
    sectionMap.forEach(({ section }, id) => {
      if (section.offsetTop <= scrollPos) currentId = id;
    });
    sectionMap.forEach(({ tab }, id) => {
      if (id === currentId) tab.classList.add('is-active');
      else tab.classList.remove('is-active');
    });
  };

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab();

  // ---- Smooth scroll on tab click (accounting for sticky header) ----
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const href = tab.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      const offset = 120; // sticky header + tabs height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
