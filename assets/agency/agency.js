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


  /* Hero signature: drag the line to take something analog digital */
  document.querySelectorAll('[data-gd]').forEach(function (gd) {
    var stage = gd.querySelector('[data-gd-stage]'), range = gd.querySelector('[data-gd-range]'),
        desc = gd.querySelector('[data-gd-desc]'), touched = false;
    var DESC = {
      course: 'Before: a paper volunteer training binder with a lost DVD and a paper quiz. With the Agency: the same training as an online Canvas module with a video, a reading, and a quiz.',
      video: 'Before: an intake process scribbled on a whiteboard and explained by hand every time. With the Agency: a captioned training video with chapters.',
      podcast: 'Before: podcast ideas on a legal pad and a voice memo on a phone. With the Agency: a published episode live on three platforms.'
    };
    var setX = function (v) { gd.style.setProperty('--x', v); };
    range.addEventListener('input', function () { touched = true; setX(range.value); });
    gd.querySelectorAll('[data-gd-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.dataset.gdTab; gd.dataset.scene = s; desc.textContent = DESC[s];
        gd.querySelectorAll('[data-gd-tab]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      });
    });

    if (reduce) return;
    setX(88); range.value = 88;  /* start mostly 'before'; the sweep below shows the line moves */
    /* depth: pointer + hero scroll, eased; planes read --mx/--my/--sp at their own rates */
    var tx = 0, ty = 0, mx = 0, my = 0, sp = 0, raf = 0, visible = true;
    var tick = function () {
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      var r = gd.getBoundingClientRect(); sp = Math.max(0, Math.min(1, -r.top / (r.height || 1)));
      gd.style.setProperty('--mx', mx.toFixed(3)); gd.style.setProperty('--my', my.toFixed(3)); gd.style.setProperty('--sp', sp.toFixed(3));
      raf = (visible && (Math.abs(tx - mx) > .002 || Math.abs(ty - my) > .002)) ? requestAnimationFrame(tick) : 0;
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(tick); };
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2; kick();
    });
    stage.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    addEventListener('scroll', kick, { passive: true });

    /* one demonstration sweep when it first comes into view, unless the visitor got there first */
    if ('IntersectionObserver' in window) {
      var seen = false;
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (!visible || seen) return; seen = true;
        var from = 88, to = 50, t0 = performance.now(), dur = 1500;
        setTimeout(function () {
          t0 = performance.now();
          (function step(now) {
            if (touched) return;
            var k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
            var v = from + (to - from) * e; setX(v.toFixed(1)); range.value = Math.round(v);
            if (k < 1) requestAnimationFrame(step);
          })(t0);
        }, 500);
      }, { threshold: 0.4 }).observe(gd);
    }
  });

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
