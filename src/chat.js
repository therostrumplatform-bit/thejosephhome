/**
 * Joseph's Home — chat backend.
 *
 * DESIGN RULE, NON-NEGOTIABLE
 * Crisis detection runs on the server BEFORE any model call, and a crisis
 * message is never sent to the model at all. The response is a fixed string
 * written by a human. A language model must never be the thing deciding what
 * to say to a man who just typed "I want to die" at two in the morning.
 *
 * Everything else is grounded in FACTS below. The model is instructed to say
 * it does not know rather than guess, because a wrong answer about medication
 * policy or eligibility costs somebody a bed.
 */

/* ------------------------------------------------------------------ */
/* 1. CRISIS INTERCEPTION — runs first, always                         */
/* ------------------------------------------------------------------ */

const CRISIS_TERMS = [
  "kill myself", "killing myself", "kill me", "suicide", "suicidal",
  "end my life", "end it all", "want to die", "wanna die", "better off dead",
  "hurt myself", "hurting myself", "self harm", "self-harm", "cut myself",
  "cutting myself", "overdose", "overdosing", "took too many", "took a bunch",
  "no reason to live", "cant go on", "can't go on", "give up on life",
  "not worth living", "hang myself", "shoot myself", "end things",
  "dont want to be here", "don't want to be here", "nothing left",
  "cant do this anymore", "can't do this anymore",
];

const CRISIS_REPLY =
  "<p><b>Please do not wait on us tonight.</b></p>" +
  "<p>If you are in immediate danger, call <b>911</b>.</p>" +
  "<p>For free, confidential help at any hour, call or text <b>988</b> — " +
  "the Suicide &amp; Crisis Lifeline.</p>" +
  "<p>For treatment referrals near you, SAMHSA&rsquo;s national helpline is " +
  "<b>1-800-662-4357</b>.</p>" +
  "<p>I am a simple automated helper on a website. A real person is better " +
  "than me right now. Please reach one of those numbers, and then call us in " +
  "the morning at <a href=\"tel:+12286694346\">228-669-4346</a>.</p>";

const CRISIS_CHIPS = [
  { t: "Call or text 988", u: "tel:988" },
  { t: "SAMHSA 1-800-662-4357", u: "tel:18006624357" },
  { t: "Call Joseph's Home", u: "tel:+12286694346" },
];

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isCrisis(text) {
  const t = normalize(text);
  return CRISIS_TERMS.some((term) => t.includes(term));
}

/* ------------------------------------------------------------------ */
/* 2. GROUNDING — the only facts the model may state                   */
/* ------------------------------------------------------------------ */

const FACTS = `
WHO
Joseph's Home is a faith-based sober living home for men in Saucier,
Mississippi. Founder and sole contact: Jeff York. Phone 228-669-4346.
Email jeffyork@thejosephhome.org. Website theJosephHome.org.
Named for Joseph "Joey" Watts.

WHAT IT IS NOT
Joseph's Home is NOT a rehab, NOT a detox, NOT a medical provider, and cannot
supervise a withdrawal. Men must complete a rehab program before applying.
It does not provide medical, legal, or clinical advice of any kind.

MISSION
"We exist to disciple men to become who God created them to be."
Identity line: "A man is not his worst year."
Anchor scripture: Psalm 46:10 (ESV) — "Be still, and know that I am God."

FOUR CORE PILLARS
Faith-Centered Discipleship. Dignified Accountability.
Restoration of Wholeness. Enduring Brotherhood.

FOUR STEPS TO APPLY, IN THIS ORDER
1. Complete a rehab program.
2. Dedicate yourself to discipleship.
3. Fill out the application at https://app.onestepsoftware.com/forms/XuEfGXU
4. Pray. (Matthew 19:26, ESV)
Honesty on the application matters: a hard past does not end an application,
but dishonesty can.

THE THREE-YEAR WALK
Phase 1, Transition — 12 months in-house, built on the RESTORE journal.
Phase 2, Mentorship — 24 months, built on the Supporting Restoration journal.
Phase 2 tracks: Track A Gulf Coast, Track B Long-Distance,
Track C Hands-On / Step-Down.
Prayer Partner Pod — 3 to 5 adults from a man's home or sponsoring church.
Do NOT describe this as a generic "Phase 1/2/3 over 12 months".

LIFE IN THE HOUSE
Church attendance and church activities are required from the first week.
Residents attend Celebrate Recovery. Work is part of the program.

HIRE US
The men run a lawn care crew, a moving and labor crew, and are available for
employer staffing. Inquiries go to Jeff at 228-669-4346.

GIVING
Current planning levels shown on the Give page include $50 monthly for Steady
Ground, $150 monthly for Work and Mobility, $500 monthly as a Room Partner,
$1,500 once for a man's first 30 days, $5,000 yearly as an Annual Mission
Partner, and $10,000 or more as an Angel Partner. These are flexible planning
guides, not promises that a gift is restricted to a specific expense. Current
household needs include the bed set and pillows linked on the Give page.
Merchandise shown on the site is concept work; availability and pricing are not
yet final.

GOLF
11th Annual Joseph's Home Golf Tournament. Saturday, November 7, 2026.
8:00 a.m. shotgun start. Four-person scramble at Grand Bear Golf Course,
12040 Grand Way Blvd, Saucier, MS 39574.
Register: https://charitygolftoday.com/josephshomegolftournament

FIND HELP (for people Joseph's Home cannot take yet)
FindTreatment.gov — federal treatment locator.
SAMHSA national helpline — 1-800-662-4357, free, 24/7.
Mississippi Department of Mental Health helpline — 1-877-210-8513, 24/7.
Home of Grace, Vancleave MS — (228) 826-5283.
988 — Suicide & Crisis Lifeline, call or text.

PAGES
/ home, /stories.html, /find-help.html, /golf.html, /employment.html,
/faq.html, /give.html

NOT YET PUBLISHED — you do NOT know these. Say so and give the phone number:
the program fee, the daily schedule, the drug-testing policy, current bed
availability, the medication policy, the street address, the visitation
policy, what to pack, the phone and vehicle policy, application response
time, and 501(c)(3) or EIN details.
`.trim();

const SYSTEM = `You are the automated assistant on the Joseph's Home website.

VOICE
Plain, unhurried, honest. Short sentences. No marketing language, no recovery
jargon, no exclamation marks. Warmth comes from directness. A man in his first
week of sobriety should be able to read every sentence you write.

HARD RULES
- Answer ONLY from the FACTS below. If the answer is not there, say you do not
  know and give the phone number 228-669-4346. Never guess. Never invent a
  policy, a price, a date, or an address.
- Never give medical, clinical, legal, or financial advice. Never comment on
  medications, dosages, tapering, or withdrawal. Direct those to a doctor.
- Never promise admission, a bed, a timeline, or an outcome. Only Jeff decides
  who is admitted.
- Never diagnose anyone or characterise anyone's condition.
- Say plainly that you are an automated helper if asked, and whenever it
  matters.
- Do not ask for or repeat anyone's personal details. If someone volunteers
  them, do not echo them back.
- Keep replies under 90 words. Two short paragraphs at most.
- Write plain text. No markdown, no headings, no bullet characters.

If someone sounds like they are struggling but not in danger, be kind, be
brief, and point them to a person: Jeff at 228-669-4346, or the Find help page.

FACTS
${FACTS}`;

/* ------------------------------------------------------------------ */
/* 3. OUTPUT GUARDRAIL                                                 */
/* ------------------------------------------------------------------ */

// Phrases a model should never produce on this site, regardless of prompt.
const FORBIDDEN = [
  /\byou (will|would|can) (be admitted|get a bed|be accepted)\b/i,
  /\bguarantee\b/i,
  /\b(mg|milligram|dosage|taper|tapering)\b/i,
  /\byou should stop taking\b/i,
  /\bi am a (doctor|therapist|counselor|clinician)\b/i,
  /\bdiagnos(e|ed|is)\b/i,
];

const SAFE_FALLBACK =
  "I am not able to answer that one accurately. Please call Jeff at " +
  "228-669-4346 — he answers the phone himself and will give you a straight " +
  "answer.";

function guard(text) {
  const t = String(text || "").trim();
  if (!t) return SAFE_FALLBACK;
  if (FORBIDDEN.some((re) => re.test(t))) return SAFE_FALLBACK;
  if (t.length > 900) return t.slice(0, 900) + "…";
  return t;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toHtml(text) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((p) => "<p>" + p.replace(/\n/g, " ").trim() + "</p>")
    .join("");
}

/* ------------------------------------------------------------------ */
/* 4. RATE LIMITING                                                    */
/* ------------------------------------------------------------------ */

const WINDOW_SECONDS = 60;
const MAX_PER_WINDOW = 12;

async function rateLimited(request, env) {
  if (!env.CHAT_KV) return false; // no KV bound — skip rather than fail open loudly
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const bucket = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
  const key = `rl:${ip}:${bucket}`;
  const current = parseInt((await env.CHAT_KV.get(key)) || "0", 10);
  if (current >= MAX_PER_WINDOW) return true;
  await env.CHAT_KV.put(key, String(current + 1), {
    expirationTtl: WINDOW_SECONDS * 2,
  });
  return false;
}

/* ------------------------------------------------------------------ */
/* 5. HANDLER                                                          */
/* ------------------------------------------------------------------ */

const MAX_CHARS = 600;
const MAX_TURNS = 8;

export async function handleChat(request, env, ctx) {
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > 8192) return json({ error: "Request too large" }, 413);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const message = String(body.message || "").slice(0, MAX_CHARS).trim();
  if (!message) return json({ error: "Empty message" }, 400);

  // --- crisis check comes before everything, including rate limiting, so a
  // --- person in crisis is never throttled or delayed.
  if (isCrisis(message)) {
    return json({ reply: CRISIS_REPLY, chips: CRISIS_CHIPS, source: "crisis" });
  }

  if (await rateLimited(request, env)) {
    return json({
      reply:
        "You have sent a lot of messages quickly. Give it a minute, or call " +
        "us at 228-669-4346.",
      source: "rate-limit",
    });
  }

  if (!env.ANTHROPIC_API_KEY) {
    // No key configured: tell the client to fall back to its built-in answers.
    return json({ reply: null, source: "unconfigured" });
  }

  // Conversation history, trimmed. Crisis terms are stripped from history too.
  const history = Array.isArray(body.history) ? body.history.slice(-MAX_TURNS) : [];
  const messages = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
    .map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, MAX_CHARS),
    }));
  messages.push({ role: "user", content: message });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.CHAT_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 300,
      temperature: 0.3,
      system: SYSTEM,
      messages,
    }),
  });

  if (!res.ok) {
    console.error("anthropic", res.status, await res.text().catch(() => ""));
    return json({ reply: null, source: "upstream-error" });
  }

  const data = await res.json();
  const raw = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  // The model's own output is checked for crisis language as well: if it is
  // talking about self-harm for any reason, the human-written reply wins.
  if (isCrisis(raw)) {
    return json({ reply: CRISIS_REPLY, chips: CRISIS_CHIPS, source: "crisis" });
  }

  return json({ reply: toHtml(guard(raw)), source: "model" });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
