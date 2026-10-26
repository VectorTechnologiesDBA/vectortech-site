// Shared behaviour for every page on vectortech.dev.
// Each block checks for its own markup first, so this one file can be
// included on the home page and the project detail pages alike.

// ---------- always land at the top on load/refresh ----------
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', function () { window.scrollTo(0, 0); });

// ---------- latest purchases ----------
// Single source of truth. Add or remove entries here and both the home-page
// card and purchases.html follow automatically:
//   1 entry  -> card links straight to it (or shows the name, if it has no link)
//   2+ entries -> card links to purchases.html, labelled Part 1, Part 2, ...
//
// Each entry is either:
//   'https://...'                                          a plain URL
//   { name: 'Some item' }                                   no listing exists — name only, no link
//   { name: 'Some item', href: 'https://...' }               named item with its own link
//   { name: '...', href: '...', image: 'https://...' }       same, plus a thumbnail (shown on purchases.html only)
var LATEST_PURCHASES = [
];

// Normalizes any entry above to { name, href } (href is null when there's no listing).
function normalizePurchase(entry, i) {
  if (typeof entry === 'string') {
    return { name: 'Part ' + (i + 1), href: entry, image: null };
  }
  return {
    name: entry.name || ('Part ' + (i + 1)),
    href: entry.href || null,
    image: entry.image || null
  };
}

// ---------- terminal boot sequence (home page only) ----------
(function () {
  var termBody = document.getElementById('termBody');
  if (!termBody) return;

  var bootLines = [
    { html: '<span class="prompt">vt@boot</span><span class="dim">:~$</span> ./init.sh', delay: 0 },
    { html: '<span class="dim">VecBrowse — loading public modules...</span>', delay: 300 },
    { html: '', delay: 100 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">skim-it</span>         <span class="dim">mobile game, restored + modded</span>', delay: 500 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">vector-os</span>       <span class="dim">windows iso, preservation tooling</span>', delay: 250 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">beepbar</span>         <span class="dim">audible progress bar, beeps + tts</span>', delay: 250 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">victor-os</span>       <span class="dim">anki vector custom firmware</span>', delay: 250 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">vector-plus-plus</span> <span class="dim">anki vector app, wirepod-ready</span>', delay: 250 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">games</span>           <span class="dim">scratch games + prototypes</span>', delay: 250 },
    { html: '<span class="ok">[ OK ]</span> <span class="path">purchases</span>       <span class="dim">latest pickups</span>', delay: 250 },
    { html: '', delay: 150 },
    { html: '<span class="ok">[ OK ]</span> all modules loaded. <span class="cursor"></span>', delay: 300 }
  ];

  var cumulative = 0;
  bootLines.forEach(function (l) {
    cumulative += l.delay;
    var div = document.createElement('div');
    div.className = 'line';
    div.innerHTML = l.html;
    div.style.animationDelay = cumulative + 'ms';
    termBody.appendChild(div);
  });
})();

// ---------- project cards (home page only) ----------
(function () {
  var list = document.getElementById('projectList');
  if (!list) return;

  var projects = [
    {
      name: 'Skim It!',
      desc: 'Rock-skimming game by Flippin Pixels, preserved & rebuilt',
      longDesc: 'A 2013 mobile game by Flippin Pixels where you skim rocks across the water to sink boats. Levels are \"Days\" split into Morning, Day, Night and a Bonus Round, where you sink ducks for coins to spend on upgrades and revives. Delisted years ago — the original iOS and Android builds are archived on Archive.org, Remastered revives it for modern devices, and Skim It!+ adds a mod menu on top of Remastered.',
      note: 'Original runs on iOS 6–10 / Android 5/7 (or via emulation) — for modern devices use Remastered or Skim It!+.',
      links: [
        { label: 'More Info', href: 'skim-it.html' }
      ]
    },
    {
      name: 'Vector_OS!',
      desc: 'Custom Windows ISO loaded with preservation tools',
      longDesc: 'A custom Windows image that ships with the tools already installed — Wire-Pod for Anki Vector robots, Flashpoint for Flash content, an Android emulator set up for Skim It! and other old apps, and more. Registry tweaks are applied at the system level too, including the key combo for forcing a BSOD and verbose boot mode. Built mainly for people doing preservation and retro tinkering.',
      links: [
        { label: 'More Info', href: 'vector-os.html' }
      ]
    },
    {
      name: 'BeepBar',
      desc: 'Audible progress bar — beeps and speaks so you can hear progress',
      longDesc: 'BeepBar is an audible progress bar. Instead of only showing a bar on screen, it beeps as progress climbs and uses text-to-speech to announce where things stand — handy when you\'re not looking at the screen, or don\'t want to be. Built to make long-running tasks something you can track by ear.',
      links: [
        { label: 'More Info', href: 'beepbar.html' }
      ]
    },
    {
      name: 'Victor-OS',
      desc: 'Custom Anki Vector firmware built on WireOS',
      longDesc: 'Custom firmware for the Anki Vector robot, shipped as victorv*.ota (* being the version number) and built on top of WireOS. After Anki shut down, community firmware kept Vector running but drifted from how the robot originally behaved. Victor-OS aims to close that gap — getting WireOS back as close to stock Anki as possible while keeping the openness of custom firmware.',
      links: [
        { label: 'More Info', href: 'victor-os.html' }
      ]
    },
    {
      name: 'Vector++',
      desc: 'The original Anki Vector Android app, patched to work with WirePod',
      longDesc: 'A patched build of the original Anki Vector Android app (1.5.0), built by Hayes and beta tested by Jaceroo404!. The app\'s server calls are replaced so it talks to WirePod instead of Anki\'s long-gone cloud, and everything the old app did works.',
      links: [
        { label: 'More Info', href: 'vector-plus-plus.html' }
      ]
    },
    {
      name: 'Games',
      desc: 'Scratch projects, live and in progress',
      longDesc: 'A running collection of games and prototypes built in Scratch. Most games are built with keyboard and mouse in mind, though some are touch/mobile friendly — check each project\'s page for controls.',
      note: 'Most games need a keyboard + mouse — a few are mobile/touch friendly.',
      links: [
        { label: 'View Games', href: 'https://scratch.mit.edu/users/Jaceroo404' }
      ]
    },
    (function () {
      var n = LATEST_PURCHASES.length;
      var desc, links;
      if (n === 0) {
        desc = 'No recent purchases. Check back soon!';
        links = [];
      } else if (n === 1) {
        var only = normalizePurchase(LATEST_PURCHASES[0], 0);
        if (only.image) {
          // Has a thumbnail to show — route through purchases.html so the
          // image and full name are actually visible, rather than skipping
          // straight past them to the external listing.
          desc = 'Click here to view the listing';
          links = [{ label: 'View Listing', href: 'purchases.html' }];
        } else if (only.href) {
          desc = 'Click here to view the listing';
          links = [{ label: 'View Listing', href: only.href }];
        } else {
          desc = only.name + ' — no listing available';
          links = [];
        }
      } else {
        desc = 'Click here to view the listings';
        links = [{ label: 'View Listings', href: 'purchases.html' }];
      }
      return {
        name: 'Latest Purchase(s)',
        desc: desc,
        longDesc: 'Whatever\'s been picked up most recently — updated occasionally, mostly just for fun.',
        links: links
      };
    })()
  ];

  projects.forEach(function (p, i) {
    var row = document.createElement('div');
    row.className = 'project-card';
    var linkButtons = p.links.map(function (l) {
      return '<a class="btn" href="' + l.href + '">' + l.label + '</a>';
    }).join('');
    var detailId = 'project-detail-' + i;
    var noteHtml = p.note ? '<div class="project-note">' + p.note + '</div>' : '';
    row.innerHTML =
      '<div class="project-card-top">' +
        '<div class="project-card-heading">' +
          '<button class="flag" type="button" aria-expanded="false" aria-controls="' + detailId + '">\u203a</button>' +
          '<span class="project-name">' + p.name + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="project-desc">' + p.desc + '</div>' +
      '<div class="project-detail" id="' + detailId + '" hidden>' + p.longDesc + '</div>' +
      '<div class="project-links">' + linkButtons + '</div>' +
      noteHtml;

    var expandBtn = row.querySelector('.flag');
    var detail = row.querySelector('.project-detail');
    expandBtn.addEventListener('click', function () {
      var isOpen = expandBtn.getAttribute('aria-expanded') === 'true';
      expandBtn.setAttribute('aria-expanded', String(!isOpen));
      detail.hidden = isOpen;
      row.classList.toggle('expanded', !isOpen);
    });
    list.appendChild(row);
  });
})();

// ---------- fake BSOD -> glitch -> DOS format -> 403 ----------
var runCrashSequence = null;
(function () {
  var bsodOverlay = document.getElementById('bsodOverlay');
  if (!bsodOverlay) return;

  var crashOverlay = document.getElementById('crashOverlay');
  var dosOverlay = document.getElementById('dosOverlay');
  var forbiddenOverlay = document.getElementById('forbiddenOverlay');
  var crashTexts = [].slice.call(document.querySelectorAll('.crash-text'));

  function typeDosLines(lines, el, onDone) {
    var i = 0;
    el.textContent = '';
    (function next() {
      if (i >= lines.length) { if (onDone) onDone(); return; }
      el.textContent += lines[i] + '\n';
      i++;
      setTimeout(next, lines[i - 1].length === 0 ? 200 : 260);
    })();
  }

  function runFormatSequence() {
    dosOverlay.classList.add('active');
    var preLines = [
      'C:\\VT>format PUBLIC: /FS:VT /Q',
      '',
      'WARNING: ALL PROJECTS ON DRIVE PUBLIC: WILL BE LOST!',
      'Proceed with Format (Y/N)? Y',
      '',
      'Verifying 100%',
      'Clearing project index...',
      'Deleting cached assets...',
      'Deleting terminal buffer...'
    ];
    typeDosLines(preLines, dosOverlay, function () {
      var pctLine = document.createElement('div');
      dosOverlay.appendChild(pctLine);
      var pct = 0;
      var pctTimer = setInterval(function () {
        pct += Math.ceil(Math.random() * 14) + 4;
        if (pct >= 100) {
          pct = 100;
          clearInterval(pctTimer);
          pctLine.textContent = 'Formatting... ' + pct + '% complete';
          setTimeout(function () {
            var doneLine = document.createElement('div');
            doneLine.textContent = '\nFormat complete.\nVT-PUBLIC is now unreadable.';
            dosOverlay.appendChild(doneLine);
            setTimeout(function () {
              dosOverlay.classList.remove('active');
              forbiddenOverlay.classList.add('active');
            }, 900);
          }, 500);
        } else {
          pctLine.textContent = 'Formatting... ' + pct + '% complete';
        }
      }, 180);
    });
  }

  runCrashSequence = function () {
    bsodOverlay.hidden = true;
    document.body.classList.add('crashing');
    crashOverlay.classList.add('active');
    crashTexts.forEach(function (t) { t.classList.add('active'); });
    setTimeout(function () {
      document.body.classList.remove('crashing');
      crashOverlay.classList.remove('active');
      crashTexts.forEach(function (t) { t.classList.remove('active'); });
      runFormatSequence();
    }, 2800);
  };

  var continueBtn = document.getElementById('bsodContinue');
  if (continueBtn) continueBtn.addEventListener('click', runCrashSequence);

  if (document.documentElement.getAttribute('data-theme') === 'bsod') {
    bsodOverlay.hidden = false;
  }
})();

// ---------- dev test mode (pin: 404256) ----------
(function () {
  var uselessBtn = document.getElementById('uselessBtn');
  if (!uselessBtn) return;

  var pinOverlay = document.getElementById('pinOverlay');
  var pinInput = document.getElementById('pinInput');
  var pinError = document.getElementById('pinError');
  var testModeOverlay = document.getElementById('testModeOverlay');
  var bsodOverlay = document.getElementById('bsodOverlay');
  var crashOverlay = document.getElementById('crashOverlay');
  var dosOverlay = document.getElementById('dosOverlay');
  var forbiddenOverlay = document.getElementById('forbiddenOverlay');
  var crashTexts = [].slice.call(document.querySelectorAll('.crash-text'));
  var DEV_PIN = '404256';

  uselessBtn.addEventListener('click', function () {
    pinOverlay.hidden = false;
    pinInput.value = '';
    pinError.hidden = true;
    pinInput.focus();
  });

  document.getElementById('pinCancel').addEventListener('click', function () {
    pinOverlay.hidden = true;
  });

  function checkPin() {
    if (pinInput.value === DEV_PIN) {
      pinOverlay.hidden = true;
      testModeOverlay.hidden = false;
    } else {
      pinError.hidden = false;
      pinInput.value = '';
      pinInput.focus();
    }
  }
  document.getElementById('pinSubmit').addEventListener('click', checkPin);
  pinInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') checkPin();
  });

  document.getElementById('testModeClose').addEventListener('click', function () {
    testModeOverlay.hidden = true;
  });

  document.querySelectorAll('[data-theme-pick]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var picked = btn.getAttribute('data-theme-pick');

      // Gold Day variants force themselves for the session, then reload so
      // theme.js can apply them before paint (banner + confetti included).
      if (picked.indexOf('gold-') === 0) {
        try { sessionStorage.setItem('vt-gold-force', picked.slice(5)); } catch (e) {}
        location.reload();
        return;
      }
      try { sessionStorage.removeItem('vt-gold-force'); } catch (e) {}

      document.documentElement.setAttribute('data-theme', picked);
      document.documentElement.removeAttribute('data-gold');
      // keep the forced theme while clicking around the site
      try { sessionStorage.setItem('vt-theme', picked === 'bsod' ? 'red' : picked); } catch (e) {}
      testModeOverlay.hidden = true;

      // reset anything mid-sequence
      document.body.classList.remove('crashing');
      if (crashOverlay) crashOverlay.classList.remove('active');
      crashTexts.forEach(function (t) { t.classList.remove('active'); });
      if (dosOverlay) dosOverlay.classList.remove('active');
      if (forbiddenOverlay) forbiddenOverlay.classList.remove('active');
      if (bsodOverlay) bsodOverlay.hidden = picked !== 'bsod';
    });
  });
})();



// ---------- purchases page ----------
(function () {
  var list = document.getElementById('purchaseList');
  if (!list) return;

  if (!LATEST_PURCHASES.length) {
    list.innerHTML = '<p class="project-desc" style="margin-left:0;">No recent purchases. Check back soon!</p>';
    return;
  }

  LATEST_PURCHASES.forEach(function (entry, i) {
    var item = normalizePurchase(entry, i);
    var row = document.createElement('div');
    row.className = 'variant';
    var body = '<div class="variant-head">' +
        '<span class="variant-name">Part ' + (i + 1) + '</span>' +
      '</div>';
    if (item.image) {
      body += '<img class="purchase-thumb" src="' + item.image + '" alt="' + item.name + '">';
    }
    body += '<p style="margin-bottom:10px;">' + item.name + '</p>';
    if (item.href) {
      body += '<div class="project-links" style="margin-left:0;">' +
        '<a class="btn" href="' + item.href + '">View Listing</a>' +
      '</div>';
    } else {
      body += '<p class="project-desc" style="margin-left:0;">No listing available.</p>';
    }
    row.innerHTML = body;
    list.appendChild(row);
  });
})();

// ---------- Gold Day ----------
// Fires when theme.js has set data-theme="gold". data-gold says which flavour:
//   shopping -> 21st of any month, and Nov 15  (mentions Shopping Day)
//   holiday  -> Dec 25                          (never mentions Shopping Day)
(function () {
  var root = document.documentElement;
  if (root.getAttribute('data-theme') !== 'gold') return;

  var flavour = root.getAttribute('data-gold') || 'shopping';

  // --- banner, injected above the header so every page gets it ---
  var banner = document.createElement('div');
  banner.className = 'gold-banner';

  var text;
  if (flavour === 'shopping') {
    text = '\u2728 <strong>Shopping Day</strong> \u2014 everything\u2019s gold today \u2728';

    // Point people at the purchases, but only if there are any. On the home
    // page jump to the card; elsewhere link out to it.
    var n = (typeof LATEST_PURCHASES !== 'undefined') ? LATEST_PURCHASES.length : 0;
    if (n > 0) {
      var onHome = !!document.getElementById('projectList');
      var href = n === 1
        ? (onHome ? '#projects' : 'index.html#projects')
        : 'purchases.html';
      text += ' \u00b7 <a href="' + href + '">Take a look at my latest purchase'
            + (n > 1 ? 's' : '') + ' \u2192</a>';
    }
  } else {
    text = '\u2728 <strong>Merry Christmas</strong> from Vector Tech \u2728';
  }
  banner.innerHTML = text;

  var header = document.querySelector('header');
  if (header && header.parentNode) {
    header.parentNode.insertBefore(banner, header);
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // --- confetti ---
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var field = document.createElement('div');
  field.id = 'goldConfetti';
  document.body.appendChild(field);

  var golds = ['#ffcf4a', '#ffe382', '#d9a428', '#fff0b8', '#c8901c'];
  var COUNT = 44;
  for (var i = 0; i < COUNT; i++) {
    var bit = document.createElement('span');
    bit.className = 'gold-bit';
    bit.style.left = (Math.random() * 100).toFixed(2) + '%';
    bit.style.background = golds[Math.floor(Math.random() * golds.length)];
    bit.style.animationDuration = (5 + Math.random() * 6).toFixed(2) + 's';
    bit.style.animationDelay = (-Math.random() * 10).toFixed(2) + 's';
    var w = 5 + Math.random() * 6;
    bit.style.width = w.toFixed(1) + 'px';
    bit.style.height = (w * (1.2 + Math.random())).toFixed(1) + 'px';
    field.appendChild(bit);
  }
})();
