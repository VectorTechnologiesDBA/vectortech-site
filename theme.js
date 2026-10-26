// Theme picker — runs before paint to avoid a flash of the wrong theme.
//
// Gold Day overrides everything: on the 21st of any month, on Nov 15, and on
// Dec 25, the whole site goes gold. The first two are Shopping Day; Dec 25 is
// gold too but never mentions Shopping Day.
//
// One-time exception: Sept 24-28, 2026 is also Shopping Day. This is a single
// event, not a yearly rule — it checks the year, so it will never fire again
// after 2026. Safe to delete this block once that window has passed.
//
// Otherwise a theme is rolled and kept in sessionStorage, so navigating
// between pages doesn't re-roll (and can't re-trigger the BSOD mid-session).
(function () {
  var themePool = [
    { name: 'red', weight: 32.67 },
    { name: 'aqua', weight: 32.67 },
    { name: 'skeuomorphic', weight: 32.66 },
    { name: 'bsod', weight: 2 }
  ];

  function roll() {
    var total = themePool.reduce(function (s, t) { return s + t.weight; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < themePool.length; i++) {
      if (r < themePool[i].weight) return themePool[i].name;
      r -= themePool[i].weight;
    }
    return themePool[0].name;
  }

  // Returns 'shopping', 'holiday', or null. Uses the viewer's local date.
  function goldDay(d) {
    var day = d.getDate();
    var month = d.getMonth(); // 0-indexed: 10 = Nov, 11 = Dec
    var year = d.getFullYear();

    // One-time: Sept 24-28, 2026 only. Year-gated so it can't recur.
    if (year === 2026 && month === 8 && day >= 24 && day <= 28) return 'shopping';

    if (month === 11 && day === 25) return 'holiday';
    if (day === 21) return 'shopping';
    if (month === 10 && day === 15) return 'shopping';
    return null;
  }

  // Test Mode can force a gold variant for the session.
  var forced = null;
  try { forced = sessionStorage.getItem('vt-gold-force'); } catch (e) {}

  var gold = forced || goldDay(new Date());

  if (gold) {
    document.documentElement.setAttribute('data-theme', 'gold');
    document.documentElement.setAttribute('data-gold', gold);
    return;
  }

  var stored = null;
  try { stored = sessionStorage.getItem('vt-theme'); } catch (e) {}

  var chosen;
  if (stored) {
    chosen = stored;
  } else {
    chosen = roll();
    // If BSOD comes up, show it on this page only — park a normal theme
    // for the rest of the session so it doesn't fire on every navigation.
    try { sessionStorage.setItem('vt-theme', chosen === 'bsod' ? 'red' : chosen); } catch (e) {}
  }

  document.documentElement.setAttribute('data-theme', chosen);
})();
