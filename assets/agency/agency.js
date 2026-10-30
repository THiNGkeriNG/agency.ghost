/* The Learning Agency — landing page interactions. No dependencies. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Copy email */
  var b = document.getElementById('copy-email'), el = document.getElementById('email');
  if (b && el) b.addEventListener('click', function () {
    function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); }
    function fallback() { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected'; }
    try { navigator.clipboard.writeText(el.textContent).then(done, fallback); } catch (e) { fallback(); }
  });

  /* Hours estimator: hours x flat rate */
  var est = document.querySelector('.est');
  if (est) {
    var rate = +est.dataset.rate, range = document.getElementById('est-hours'),
        h = document.getElementById('est-h'), tot = document.getElementById('est-total');
    var fmt = function (n) { return '$' + n.toLocaleString('en-US'); };
    var update = function () {
      var v = +range.value, pct = (v - range.min) / (range.max - range.min) * 100;
      h.textContent = v; tot.textContent = fmt(v * rate);
      range.style.setProperty('--p', pct + '%');
      range.setAttribute('aria-valuetext', v + ' hours, ' + fmt(v * rate));
    };
    range.addEventListener('input', update); update();
  }

  /* Header: condensed state + reading progress */
  var header = document.querySelector('header.site'), bar = document.querySelector('.progress i');
  var onScroll = function () {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    /* hysteresis: the header changes height when it condenses, so use separate on/off points to avoid flicker */
    if (header) { if (y > 90) header.classList.add('scrolled'); else if (y < 20) header.classList.remove('scrolled'); }
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!('IntersectionObserver' in window)) { document.documentElement.classList.add('io-off'); return; }

  /* Reveal sections and staggered children as they enter */
  var targets = document.querySelectorAll('.tla .sec-head, .tla .sec-body > *, .tla .svc article, .tla .plat > div, .tla .three > *, .tla .cols article, .tla .steps li, .tla .clients li, .tla .loop li, .tla .faq, .tla .fund, .tla .motto, .tla .quote');
  targets.forEach(function (t) {
    var sibs = t.parentElement ? Array.prototype.indexOf.call(t.parentElement.children, t) : 0;
    t.style.setProperty('--d', Math.min(sibs, 8) * 70 + 'ms');
    t.classList.add('rv');
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target; t.classList.add('in'); io.unobserve(t);
      /* once revealed, hand transitions back to hover styles */
      t.addEventListener('transitionend', function f(ev) {
        if (ev.target !== t || ev.propertyName !== 'opacity') return;
        t.classList.remove('rv'); t.removeEventListener('transitionend', f);
      });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach(function (t) { if (reduce) t.classList.add('in'); else io.observe(t); });

  /* Scrollspy for the main nav */
  var links = {};
  document.querySelectorAll('.mainnav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var a = links[e.target.id]; if (!a) return;
      if (e.isIntersecting) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('on'); });
        a.classList.add('on');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
})();
