/* Student Agency at CU Denver — design 2 interactions. No dependencies. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* Project finder: turns the three answers into a ready-to-send email */
  var finder = document.getElementById('finder');
  if (finder) finder.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = finder.elements, who = f.who.value, what = f.what.value, when = f.when.value;
    var lines = ['Hello,', '', "I'd like to set up a free project plan for a project."];
    if (who) lines.push('', "I'm with: " + who);
    if (what) lines.push('I need help with: ' + what);
    if (when) lines.push('Timing: ' + when);
    lines.push('', 'A little more about it:', '', '');
    location.href = 'mailto:learning.agency@ucdenver.edu?subject=' + encodeURIComponent('Free project plan' + (what ? ': ' + what : '')) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  });

  /* Black bar sticks to the top; once the white header scrolls away it shows the compact logo + menu */
  var topbar = document.getElementById('topbar'), header = document.querySelector('header.site');
  if (topbar && header && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var e = es[0]; topbar.classList.toggle('stuck', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: '-' + topbar.offsetHeight + 'px 0px 0px 0px' }).observe(header);
  }

  if (!('IntersectionObserver' in window)) { document.documentElement.classList.add('io-off'); return; }

  /* Gentle reveal for cards and section heads */
  var targets = document.querySelectorAll('.tla .sec-head, .tla .stats li, .tla .xcard, .tla .steps li, .tla .ncard, .tla .tiers, .tla .est, .tla .sec-body > *, .tla .feature-copy, .tla .feature-media');
  targets.forEach(function (t) {
    var i = t.parentElement ? Array.prototype.indexOf.call(t.parentElement.children, t) : 0;
    t.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
    t.classList.add('rv');
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target; t.classList.add('in'); io.unobserve(t);
      t.addEventListener('transitionend', function f(ev) {
        if (ev.target !== t || ev.propertyName !== 'opacity') return;
        t.classList.remove('rv'); t.removeEventListener('transitionend', f);
      });
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
  targets.forEach(function (t) { if (reduce) t.classList.add('in'); else io.observe(t); });

  /* Scrollspy for in-page nav links */
  var links = {};
  document.querySelectorAll('.mainnav a, .tb-main a').forEach(function (a) {
    var u; try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (u.pathname !== location.pathname || !u.hash) return;
    var id = u.hash.slice(1); (links[id] = links[id] || []).push(a);
  });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var a = links[e.target.id]; if (!a || !e.isIntersecting) return;
      Object.keys(links).forEach(function (k) { links[k].forEach(function (x) { x.classList.remove('on'); }); });
      a.forEach(function (x) { x.classList.add('on'); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
})();
