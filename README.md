# Joseph's Home — handoff, 2026-09-06

This package contains **new assets only**, not the full site. The 41-file
site package (`wrangler.jsonc` + `public/`) was delivered in an earlier
session and is not in this one. Unzip this into `public/` alongside the
existing files.

---

## 1. What is in this package

### Photos — real, EXIF and GPS stripped, web-sized

| File | Where it goes |
|---|---|
| `golf-carts.jpg` | golf section background (see `photo-placements.html`) |
| `golf-foursome.jpg` | golf section, paired |
| `golf-green.jpg` | golf section, paired |
| `jeff-york.jpg` | Jeff's section on the home page / Who we are |
| `lawn-care-rig.jpg` | top of the lawn care block on Hire Us |
| `house-brotherhood.jpg` | **HOLD — do not publish yet.** See section 4. |

### Shop product shots

| File | Notes |
|---|---|
| `shop-mugs-trio.jpg` | replaces the old mug shot; mockup caption cropped off |
| `shop-tumbler-engraved.jpg` | replaces the old tumbler shot |
| `shop-watch-engraved.jpg` | new — engraved stainless watch |

The signet ring and the Alumni Crest ring were deliberately cropped out of
the engraved stainless photo. The Alumni Crest is a restricted sub-mark:
signet ring only, never apparel, print, or the website.

### Footer social icons

`social-facebook.jpg`, `social-google-reviews.jpg`, `social-youtube.jpg`
— brushed metal on carbon, sized for the large-image footer.

Links:
- Facebook: https://www.facebook.com/thejosephhome
- Google Reviews: https://share.google/oe5oRDQpxMsSED0M7
- YouTube: https://youtube.com/@josephshome_ms

### Code

- `jh-updates.css` — append to `styles.css`
- `footer-snippet.html` — replacement footer markup for every page
- `photo-placements.html` — photo markup plus its CSS

### Book

- `restore-sample.pdf` — 7-page public teaser pulled from the 523-page
  RESTORE draft (title, foreword, how to use, January opener, one daily
  page, the Sabbath Debrief / Strategic Deployment spread). Footer on each
  page marks it as a sample.

---

## 2. Deploy is still broken

Cloudflare production builds have failed every time with:

```
Executing user build command: /
/bin/sh: 1: /: Permission denied
```

The dashboard's **Build command** field is literally set to `/`. Fix:

1. Workers & Pages → `josephshomemain` → Settings → Build
2. Clear the Build command field entirely (the site is static; there is
   nothing to build). If it refuses to save empty, use `echo "no build step"`.
3. Version command should be `npx wrangler versions upload`
4. Untick **Builds for non-production branches**
5. Retry the deployment

The Worker is still serving the Cloudflare starter
(`return new Response("Hello world")`) at version `d88cc588`, which means
**no successful deploy of the real site has ever landed**. Do not fix this
by editing `worker.js` in the dashboard editor — that would deploy the
Hello World file. It has to come through the git build.

Verify after: the version ID changes and the preview loads the real homepage.

---

## 3. Revision list not yet applied

These need `styles.css`, `index.html`, `faq.html`, `employment.html` and
`give.html`, which were not available in the session. Every selector in
`jh-updates.css` marked `[MATCH]` is a guess at the real class names and
must be checked before this goes live.

- [ ] **Footer** — reduce to social only, carbon criss-cross sheen
      background, large image social links, stacked logo. Markup in
      `footer-snippet.html`.
- [ ] **Hire Us forms** — text and placeholders too light; darker values
      in `jh-updates.css` section 2.
- [ ] **Lawn / movers flyers and QR code** — cropping off the right and
      bottom. Cause is `object-fit: cover`; fix is `contain`, section 3.
- [ ] **FAQ** — two "If tonight is the emergency" blocks on the page.
      Delete the older one.
- [ ] **Emergency section** — blue light wash with small red beacon dots,
      section 5.
- [ ] **Home page** — matte sand with metallic sheen on the section above
      "Who was Joseph Watts?". New tokens: Sand `#CFC4AC`,
      Sand Deep `#A6987C`, Sand Ink `#2A2419`.
- [ ] **give.html** — full rebuild around the approval-doc fundraising
      scheme: the three-tier ladder (Threshold / Watch / Foundation $900),
      the four angel-donor kits, the two channels, the kiosk, the golf
      tournament, in-kind needs. Swap in the three new product shots.

---

## 4. Two things held back deliberately

**The crisis block is static, not flashing.** The request was for a blue
light flash. The brand guide (and section 4.2 of the approval document)
says the emergency block is deliberately static, because a flashing element
on a crisis panel is a real seizure risk for photosensitive visitors and
reads as decoration on the one block that has to read as instruction. The
delivered CSS is a static blue wash with small red beacon dots. Adding the
pulse is one `@keyframes` block if the call goes the other way.

**`house-brotherhood.jpg` is commented out.** It shows identifiable men who
appear to be current residents. Section 6.9 of the approval document sets
the standard: written, specific, revocable consent, the option of a
pseudonym, and no current resident's story used while he is still in the
house and dependent on it for a bed. A face is the same thing as a story.
Uncomment once releases are signed.

**The ESV attribution stays in the footer.** The "social media only" cleanup
does not extend to it — the Crossway permission requires the attribution
line to be present.

---

## 5. Other open items carried forward

- `faq.html` still has eleven `[confirm: ...]` placeholders live: medication
  policy, response time, bed availability, program cost, packing list,
  phone/vehicle policy, address handling, daily schedule, drug-screen
  policy, visitation/leave policy, 501(c)(3)/EIN. These are content
  decisions for Jeff, not design decisions.
- Hire Us inquiry forms are not wired to a backend; they open an email.
  Test that every inquiry reaches the intended person.
- Contact email: `jeffyork@thejosephhome.org` is correct. The repo's
  employment forms use `jeff.york@josephshome.org`, which is wrong.
- Repo cleanup pending: delete `index-11.html`, `give-3.html`,
  `employment-3.html`, `1788638855907.jpg`, `README.txt`, `planner.jpg`.
  There is no `index.html` in the repo at all.
- Articles link to `church-and-celebrate-recovery.html`.
- Canonical web address is **theJosephHome.org** (mixed case, no www).
- RESTORE quotes NIV throughout; the website is ESV. Standardize on ESV and
  get the Crossway permission letter before the book is listed.

---

## 6. What to send at the start of the next session

`styles.css`, `index.html`, `faq.html`, `employment.html`, `give.html`
— or the whole repo zip. Everything in section 3 can be applied directly
once those are in hand.

## Final visual theme — Mockup #2
This package translates the approved second visual mockup into the production site while preserving existing copy and content. It uses the real Joseph's Home exterior, Joey Watts and Jeff York portraits, the supplied brotherhood image, and the supplied emergency artwork. The emergency artwork is the background for the crisis block sitewide.
