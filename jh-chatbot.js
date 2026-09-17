/* ==========================================================================
   Joseph's Home — site chatbot
   No API key, no backend, no network calls. Keyword matched against a fixed
   answer set below. Crisis detection runs FIRST and always overrides normal
   matching. Loaded on every page via <script src="jh-chatbot.js" defer>.
   To edit answers: change the ANSWERS array. Each entry needs `k` (keywords),
   `a` (answer HTML) and optionally `chips` (follow-up buttons).
   ========================================================================== */
(function () {
  "use strict";

  var PHONE = "228-669-4346";
  var TEL = "tel:+12286694346";
  var EMAIL = "mailto:jeffyork@thejosephhome.org";
  var APPLY = "https://app.onestepsoftware.com/forms/XuEfGXU";
  var RULES = "https://app.onestepsoftware.com/forms/7OSn580";
  var GOLF = "https://charitygolftoday.com/josephshomegolftournament";

  /* ---------- crisis detection: checked before anything else ---------- */
  var CRISIS = [
    "kill myself", "killing myself", "kill me", "suicide", "suicidal",
    "end my life", "end it all", "want to die", "wanna die", "better off dead",
    "hurt myself", "hurting myself", "self harm", "self-harm", "cut myself",
    "cutting myself", "overdose", "overdosing", "od'd", "took too many",
    "no reason to live", "cant go on", "can't go on", "give up on life",
    "not worth living", "hang myself", "shoot myself"
  ];

  var CRISIS_REPLY =
    '<p><b>Please do not wait on us tonight.</b></p>' +
    '<p>If you are in immediate danger, call <b>911</b>.</p>' +
    '<p>For free, confidential help at any hour, call or text <b>988</b> — the Suicide &amp; Crisis Lifeline.</p>' +
    '<p>For treatment referrals near you, SAMHSA&rsquo;s national helpline is <b>1-800-662-4357</b>.</p>' +
    '<p>I am a simple automated helper on a website. A real person is better than me right now. ' +
    'Please reach one of those numbers, and then call us in the morning at ' +
    '<a href="' + TEL + '">' + PHONE + '</a>.</p>';

  var CRISIS_CHIPS = [
    { t: "Call or text 988", u: "tel:988" },
    { t: "SAMHSA 1-800-662-4357", u: "tel:18006624357" }
  ];

  /* ---------- answers ---------- */
  var ANSWERS = [
    {
      id: "golf",
      k: ["golf", "tournament", "tee time", "scramble", "foursome", "grand bear", "november 7", "nov 7", "sponsor a hole", "hole sponsor"],
      a: '<p>The <b>11th Annual Joseph&rsquo;s Home Golf Tournament</b> is <b>Saturday, November 7, 2026</b> at ' +
         '<b>Grand Bear Golf Course</b> in Saucier, Mississippi.</p>' +
         '<p>It is our biggest fundraiser of the year. You can register a team, sponsor a hole, or donate a raffle item.</p>' +
         '<p>Registration is handled through Charity Golf Today. For sponsorships or questions, call ' +
         '<a href="' + TEL + '">' + PHONE + '</a>.</p>',
      chips: [{ t: "Register a team", u: GOLF }, { t: "Call about sponsoring", u: TEL }]
    },
    {
      id: "apply",
      k: ["apply", "application", "how do i get in", "get in", "intake", "admission", "admitted", "sign up", "enroll", "join", "bed", "space available", "openings"],
      a: '<p>The application is online and takes about an hour. You can save it and come back.</p>' +
         '<p>Before you start: you must be a man 18 or older who has <b>already completed a rehab program</b>. ' +
         'We are not a detox and we cannot supervise a withdrawal.</p>' +
         '<p>Tell the truth the first time. A hard past does not end an application. A dishonest one does.</p>' +
         '<p>If you would rather talk to a person first, call <a href="' + TEL + '">' + PHONE + '</a>.</p>',
      chips: [{ t: "Start the application", u: APPLY }, { t: "Am I eligible?", q: "am i eligible" }, { t: "House rules", u: RULES }]
    },
    {
      id: "eligible",
      k: ["eligible", "eligibility", "qualify", "do i qualify", "requirements", "who can apply", "felony", "felon", "record", "criminal", "probation", "parole", "woman", "women", "female", "wife", "daughter", "age", "how old"],
      a: '<p>We take <b>men 18 and older who have completed a rehab program</b>.</p>' +
         '<p>A criminal record does not automatically disqualify you. Being honest about it on the application matters ' +
         'far more than what is on it.</p>' +
         '<p>We are a men&rsquo;s home, so we cannot take women — but if you are a woman reading this, still reach out. ' +
         'We know the coast and we will help you find the right place.</p>',
      chips: [{ t: "Read the full page", u: "am-i-eligible.html" }, { t: "Start the application", u: APPLY }]
    },
    {
      id: "cost",
      k: ["cost", "price", "how much", "fee", "pay", "afford", "money", "expensive", "free", "insurance", "medicaid"],
      a: '<p>Program costs are handled case by case, and work is part of the program — men hold jobs with local ' +
         'employers while they live here.</p>' +
         '<p>For the current fee and what it covers, call <a href="' + TEL + '">' + PHONE + '</a>. ' +
         'Nobody here will be cagey with you about money.</p>',
      chips: [{ t: "Call " + PHONE, u: TEL }, { t: "Start the application", u: APPLY }]
    },
    {
      id: "length",
      k: ["how long", "length", "three year", "3 year", "twelve month", "12 month", "year", "duration", "stay", "commitment"],
      a: '<p><b>12 months living in the home</b> — working, in church, being discipled — followed by ' +
         '<b>2 years of self-directed mentorship</b> after you move out.</p>' +
         '<p>Ninety days was never going to do it. Most men arrive having spent ten or fifteen years building the ' +
         'thing they are trying to leave. Thirty days interrupts it. Three years replaces it.</p>',
      chips: [{ t: "The three-year plan", u: "the-three-year-plan.html" }, { t: "First thirty days", u: "first-thirty-days.html" }]
    },
    {
      id: "rehab",
      k: ["rehab", "detox", "withdrawal", "still using", "using now", "drunk", "high", "need treatment", "treatment center"],
      a: '<p>We are a sober living home, not a rehab facility. Men must complete a rehab program before they come here.</p>' +
         '<p>If you need treatment first, call <b>SAMHSA at 1-800-662-4357</b> — free, confidential, 24 hours — or call us ' +
         'at <a href="' + TEL + '">' + PHONE + '</a> and we will help you find a facility near the coast.</p>',
      chips: [{ t: "SAMHSA 1-800-662-4357", u: "tel:18006624357" }, { t: "Call us", u: TEL }]
    },
    {
      id: "give",
      k: ["give", "giving", "donate", "donation", "support", "contribute", "sponsor a man", "monthly", "tithe", "gift"],
      a: '<p>Monthly giving, at any amount, is the most useful thing you can do — it lets us plan.</p>' +
         '<p>You can also sponsor one man&rsquo;s first 30 days, cover a month in full, or become a ' +
         '<b>prayer partner</b>: sponsor a man for a year and pray for him by name.</p>' +
         '<p>There is no marketing department here. The distance between your gift and a man&rsquo;s bed is about as ' +
         'short as it gets, and you are welcome to drive over and see what you paid for.</p>',
      chips: [{ t: "Ways to give", u: "give.html" }, { t: "Volunteer instead", q: "volunteer" }]
    },
    {
      id: "volunteer",
      k: ["volunteer", "volunteering", "help out", "serve", "rides", "drive", "mentor", "mentoring", "meal", "cook", "in kind", "in-kind", "donate items", "bedding", "furniture"],
      a: '<p>Things we genuinely need:</p>' +
         '<ul><li><b>Rides to work</b> — many men do not have a vehicle yet</li>' +
         '<li><b>Mentors</b> and hosted meals</li>' +
         '<li><b>Household goods</b> when a man moves into his own place</li>' +
         '<li><b>Help at the golf tournament</b> and community events</li></ul>' +
         '<p>Current in-kind need: <b>twin XL bed-in-a-bag sets and pillows.</b></p>' +
         '<p>Call <a href="' + TEL + '">' + PHONE + '</a> before buying anything so we can tell you what is actually short this week.</p>',
      chips: [{ t: "Call " + PHONE, u: TEL }, { t: "See the needs list", u: "give.html" }]
    },
    {
      id: "hire",
      k: ["hire", "hiring", "lawn", "mow", "mowing", "landscap", "moving", "movers", "move", "labor", "crew", "quote", "employer", "staffing", "workers", "job for", "employ"],
      a: '<p>Our crews do <b>lawn care and landscaping</b>, <b>moving and labor</b>, and we place men with ' +
         '<b>employers</b> full-time or temp-to-full-time.</p>' +
         '<p>We sell accountability: structured supervision and regular random drug tests, with results shared under ' +
         'signed consent.</p>' +
         '<p>Work is part of the discipleship, not a way to pay us back.</p>',
      chips: [{ t: "Hire us / get a quote", u: "employment.html" }, { t: "Call " + PHONE, u: TEL }]
    },
    {
      id: "family",
      k: ["family", "my son", "my husband", "my brother", "my dad", "father", "mom", "wife", "visit", "visitation", "see him", "contact him", "worried about", "enable", "enabling", "rescue"],
      a: '<p>We are honest with families about what we can and cannot promise.</p>' +
         '<p>Two pages written specifically for you: what the next year actually looks like month by month, and how ' +
         'to love a man in recovery without rescuing him out of the very thing that is working.</p>' +
         '<p>The third-week phone call — the one where he wants to come home — is the most predictable event in this ' +
         'house. It happens to almost everybody.</p>',
      chips: [{ t: "What to expect", u: "for-families-what-to-expect.html" }, { t: "Loving without rescuing", u: "loving-without-rescuing.html" }]
    },
    {
      id: "church",
      k: ["church", "celebrate recovery", "cr ", "meeting", "meetings", "worship", "service", "bible study", "religion", "religious", "christian", "faith", "denomination", "have to believe", "12 step", "aa", "na"],
      a: '<p>Church and church activities are mandatory here, alongside <b>Celebrate Recovery</b> at Michael Memorial ' +
         'and the Grace Point Campus.</p>' +
         '<p>Across the Gulf Coast there is a CR meeting almost every day of the week — Gulfport, Ocean Springs, ' +
         'Pascagoula, Saucier, Wiggins, Biloxi, Vancleave, Picayune, Moss Point.</p>' +
         '<p>You do not have to be a resident to walk into one. Come, eat, sit, listen. Nobody will make you talk on ' +
         'your first night.</p>',
      chips: [{ t: "Meeting schedule", u: "church-and-celebrate-recovery.html" }]
    },
    {
      id: "restore",
      k: ["restore", "journal", "book", "devotional", "amazon", "prayer warrior", "bookmark", "magnet", "battle plan"],
      a: '<p><b>RESTORE: Prayer Warrior Journal &amp; Daily Battle Plan</b> is the book our men work through — a page ' +
         'a day from before sunrise to lights-out, a weekly reset, and a scripture index for the moments that decide things.</p>' +
         '<p>The <b>2027 edition is coming to Amazon</b> in paperback and for Kindle. The journal, plus a prayer ' +
         'partner bookmark and fridge magnet, is now part of the discipleship program.</p>' +
         '<p>No release date announced yet — ask us and we will tell you the day it goes live.</p>',
      chips: [{ t: "See what is inside", u: "give.html#restore" }, { t: "Email us", u: EMAIL }]
    },
    {
      id: "where",
      k: ["where", "location", "address", "directions", "saucier", "gulfport", "coast", "mississippi", "how far", "near"],
      a: '<p>We are in <b>Saucier, Mississippi</b>, on the Mississippi Gulf Coast.</p>' +
         '<p>For the street address and directions, call <a href="' + TEL + '">' + PHONE + '</a> — we do not publish the ' +
         'house address, for the sake of the men living in it.</p>',
      chips: [{ t: "Call " + PHONE, u: TEL }]
    },
    {
      id: "rules",
      k: ["rules", "house rules", "curfew", "phone policy", "car", "vehicle", "drug test", "testing", "kicked out", "relapse", "fall", "smoke", "smoking"],
      a: '<p>There is a schedule, chores, work, church, accountability, and men who are allowed to ask you anything.</p>' +
         '<p>The rules exist because a man who has spent years negotiating with himself needs something that does not ' +
         'negotiate back.</p>' +
         '<p>If a man falls, it is not automatically the end — but honesty about it is not optional.</p>',
      chips: [{ t: "Read the house rules", u: RULES }, { t: "Why there are rules", u: "why-there-are-rules.html" }, { t: "When a man falls", u: "when-a-man-falls.html" }]
    },
    {
      id: "contact",
      k: ["contact", "call", "phone", "number", "email", "talk to someone", "speak to", "reach", "jeff", "york", "who runs", "staff", "hours"],
      a: '<p>Call <a href="' + TEL + '"><b>' + PHONE + '</b></a> or email ' +
         '<a href="' + EMAIL + '">jeffyork@thejosephhome.org</a>.</p>' +
         '<p>Joseph&rsquo;s Home is a small operation on purpose. There is no intake department and no waiting queue — ' +
         'when you call, you are calling people who will know your name.</p>',
      chips: [{ t: "Call " + PHONE, u: TEL }, { t: "Email us", u: EMAIL }]
    },
    {
      id: "joey",
      k: ["joey", "joseph watts", "namesake", "named after", "who was joseph", "why joseph"],
      a: '<p>We are named for <b>Joseph Watts</b>. His family called him Joey.</p>' +
         '<p>He was a son, a brother, a fisherman, an outdoorsman, and a loyal friend. Addiction took him, and the ' +
         'people who loved him decided his name would mean something for other men.</p>' +
         '<p>Every man who walks through this door is here because of him.</p>',
      chips: [{ t: "Read his story", u: "index.html#who" }]
    }
  ];

  var GREETING =
    '<p>Hey — I&rsquo;m the Joseph&rsquo;s Home helper. I can answer questions about the golf tournament, applying, ' +
    'giving, and volunteering.</p>' +
    '<p>I am automated, so if you need a person, call <a href="' + TEL + '">' + PHONE + '</a>.</p>';

  var OPENING_CHIPS = [
    { t: "Golf tournament", q: "golf tournament" },
    { t: "Apply to the home", q: "how do i apply" },
    { t: "Give or volunteer", q: "how can i help" },
    { t: "Call " + PHONE, u: TEL }
  ];

  var FALLBACK =
    '<p>I did not catch that one. I can help with the <b>golf tournament</b>, <b>applying</b>, ' +
    '<b>giving</b>, <b>volunteering</b>, <b>hiring our crews</b>, or <b>Celebrate Recovery</b>.</p>' +
    '<p>For anything else, call <a href="' + TEL + '">' + PHONE + '</a> — a real person answers.</p>';

  /* ---------- matching ---------- */
  function normalize(s) {
    return (" " + s.toLowerCase().replace(/[^a-z0-9\s']/g, " ").replace(/\s+/g, " ") + " ");
  }

  function isCrisis(text) {
    var t = normalize(text);
    for (var i = 0; i < CRISIS.length; i++) {
      if (t.indexOf(CRISIS[i]) !== -1) return true;
    }
    return false;
  }

  function match(text) {
    var t = normalize(text), best = null, bestScore = 0;
    for (var i = 0; i < ANSWERS.length; i++) {
      var entry = ANSWERS[i], score = 0;
      for (var j = 0; j < entry.k.length; j++) {
        var kw = entry.k[j];
        if (t.indexOf(kw) !== -1) score += kw.length > 5 ? 3 : 2;
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return bestScore >= 2 ? best : null;
  }

  /* ---------- styles ---------- */
  var CSS = [
    '.jhb-launch{position:fixed;right:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:10px;',
    'font:700 15px/1 Archivo,Inter,system-ui,sans-serif;color:#08111A;border:0;cursor:pointer;padding:14px 20px;',
    'border-radius:999px;background:linear-gradient(180deg,#7FD3E8,#2F8199);',
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 8px 24px rgba(0,0,0,.45)}',
    '.jhb-launch:hover{transform:translateY(-1px)}',
    '.jhb-launch svg{width:20px;height:20px}',
    '.jhb-panel{position:fixed;right:18px;bottom:18px;z-index:9999;width:min(380px,calc(100vw - 24px));',
    'max-height:min(620px,calc(100vh - 32px));display:none;flex-direction:column;overflow:hidden;border-radius:16px;',
    'border:1px solid rgba(212,237,248,.28);background:linear-gradient(160deg,#22303F,#141F2A);',
    'box-shadow:0 24px 60px rgba(0,0,0,.6);font-family:Inter,system-ui,sans-serif}',
    '.jhb-panel.jhb-open{display:flex}',
    '.jhb-head{display:flex;align-items:center;gap:12px;padding:14px 16px;',
    'background:linear-gradient(120deg,#2F8199,#1F2C3C);border-bottom:1px solid rgba(212,237,248,.2)}',
    '.jhb-head img{width:38px;height:38px;border-radius:50%;flex:0 0 auto}',
    '.jhb-head b{display:block;color:#fff;font:700 15px/1.2 Archivo,Inter,sans-serif}',
    '.jhb-head span{display:block;color:#D4EDF8;font-size:12px;margin-top:3px}',
    '.jhb-x{margin-left:auto;background:none;border:0;color:#D4EDF8;font-size:24px;line-height:1;cursor:pointer;padding:4px 6px}',
    '.jhb-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}',
    '.jhb-msg{max-width:88%;padding:12px 14px;border-radius:14px;font-size:14.5px;line-height:1.55}',
    '.jhb-bot{align-self:flex-start;background:rgba(212,237,248,.12);color:#E7EEF4;',
    'border:1px solid rgba(212,237,248,.18);border-bottom-left-radius:4px}',
    '.jhb-me{align-self:flex-end;background:linear-gradient(180deg,#39A0BC,#256B80);color:#fff;border-bottom-right-radius:4px}',
    '.jhb-msg p{margin:0 0 8px}.jhb-msg p:last-child{margin:0}',
    '.jhb-msg ul{margin:6px 0 8px;padding-left:18px}.jhb-msg li{margin-bottom:4px}',
    '.jhb-msg a{color:#9FE0F1;font-weight:600}',
    '.jhb-alert{border-color:rgba(255,180,185,.5);background:linear-gradient(160deg,rgba(142,17,25,.55),rgba(63,169,245,.18))}',
    '.jhb-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px}',
    '.jhb-chip{font:600 13px/1 Inter,sans-serif;color:#D4EDF8;background:rgba(212,237,248,.1);',
    'border:1px solid rgba(212,237,248,.35);border-radius:999px;padding:9px 13px;cursor:pointer;text-decoration:none}',
    '.jhb-chip:hover{background:rgba(212,237,248,.2);color:#fff}',
    '.jhb-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(212,237,248,.16);background:rgba(9,16,23,.5)}',
    '.jhb-form input{flex:1;font:400 15px Inter,sans-serif;color:#fff;padding:11px 13px;border-radius:10px;',
    'border:1px solid rgba(212,237,248,.28);background:rgba(9,16,23,.6)}',
    '.jhb-form input::placeholder{color:#7F8F9E}',
    '.jhb-form input:focus{outline:2px solid #5FB6CE;outline-offset:1px}',
    '.jhb-send{border:0;border-radius:10px;padding:0 16px;cursor:pointer;color:#08111A;font:700 14px Archivo,sans-serif;',
    'background:linear-gradient(180deg,#7FD3E8,#2F8199)}',
    '.jhb-note{font-size:11px;color:#8C9AAA;text-align:center;padding:0 14px 10px;background:rgba(9,16,23,.5)}',
    '@media (max-width:520px){.jhb-panel{right:8px;left:8px;bottom:8px;width:auto;max-height:calc(100vh - 16px)}',
    '.jhb-launch{right:12px;bottom:12px;padding:12px 16px;font-size:14px}}',
    '@media (prefers-reduced-motion:reduce){.jhb-launch:hover{transform:none}}'
  ].join("");

  /* ---------- build ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function init() {
    var style = el("style"); style.textContent = CSS; document.head.appendChild(style);

    var launch = el("button", "jhb-launch");
    launch.type = "button";
    launch.setAttribute("aria-label", "Open the Joseph's Home help chat");
    launch.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-5A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>' +
      '<span>Questions?</span>';

    var panel = el("div", "jhb-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Joseph's Home help chat");

    panel.appendChild(el("div", "jhb-head",
      '<img src="logo-seal-white.png" alt="">' +
      '<span><b>Joseph&rsquo;s Home</b><span>Automated helper &middot; not a person</span></span>' +
      '<button class="jhb-x" type="button" aria-label="Close chat">&times;</button>'));

    var log = el("div", "jhb-log");
    log.setAttribute("aria-live", "polite");
    var chips = el("div", "jhb-chips");
    panel.appendChild(log);
    panel.appendChild(chips);

    var form = el("form", "jhb-form",
      '<input type="text" placeholder="Ask a question\u2026" aria-label="Type your question" autocomplete="off">' +
      '<button class="jhb-send" type="submit">Send</button>');
    panel.appendChild(form);
    panel.appendChild(el("div", "jhb-note",
      'Automated. For a person, call <a href="' + TEL + '" style="color:#9FE0F1">' + PHONE + '</a>.'));

    document.body.appendChild(launch);
    document.body.appendChild(panel);

    var input = form.querySelector("input");

    function say(html, who, alert) {
      var m = el("div", "jhb-msg " + (who === "me" ? "jhb-me" : "jhb-bot") + (alert ? " jhb-alert" : ""), html);
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    }

    function setChips(list) {
      chips.innerHTML = "";
      (list || []).forEach(function (c) {
        var b;
        if (c.u) {
          b = el("a", "jhb-chip", c.t);
          b.href = c.u;
          if (/^https?:/.test(c.u)) { b.target = "_blank"; b.rel = "noopener"; }
        } else {
          b = el("button", "jhb-chip", c.t);
          b.type = "button";
          b.addEventListener("click", function () { ask(c.q, c.t); });
        }
        chips.appendChild(b);
      });
    }

    function ask(text, label) {
      say(label || text, "me");
      setChips([]);
      window.setTimeout(function () {
        if (isCrisis(text)) {
          say(CRISIS_REPLY, "bot", true);
          setChips(CRISIS_CHIPS);
          return;
        }
        var hit = match(text);
        if (hit) { say(hit.a, "bot"); setChips(hit.chips || OPENING_CHIPS); }
        else { say(FALLBACK, "bot"); setChips(OPENING_CHIPS); }
      }, 260);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      input.value = "";
      ask(v);
    });

    var started = false;
    function open() {
      panel.classList.add("jhb-open");
      launch.style.display = "none";
      if (!started) { started = true; say(GREETING, "bot"); setChips(OPENING_CHIPS); }
      input.focus();
    }
    function close() {
      panel.classList.remove("jhb-open");
      launch.style.display = "";
      launch.focus();
    }

    launch.addEventListener("click", open);
    panel.querySelector(".jhb-x").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("jhb-open")) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
