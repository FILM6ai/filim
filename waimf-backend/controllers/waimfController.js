import waimfSchema from "../modles/waimf.js";
import blogSchema from "../modles/blog.js";

// The FILM6 festival page, read ONCE over its public API to seed this site.
//
// Deliberately an HTTP call and not a mongoose model: this backend has its own
// database and must not be able to reach FILM6's. Importing a festival model
// here would mean this "separate" backend held a live handle on FILM6's data,
// which is the coupling that separating the two was meant to remove. Over the
// wire, the copy happens once and then the two are genuinely independent.
const FILM6_FESTIVAL_URL =
  process.env.FILM6_FESTIVAL_URL ||
  "https://filim-six.vercel.app/api/festival/getfestival";

const FILM6_BLOG_URL =
  process.env.FILM6_BLOG_URL ||
  "https://filim-six.vercel.app/api/blog/getblog";

// waimf.org content.
//
// Every write here is FIELD-SCOPED. Nothing in this file rebuilds the document
// from the request body, which is the trap the older page controllers on this
// project fall into: they assemble `updateData = {hero, advance, toplist, ...}`
// and `$set` the lot, so a form that posts one section blanks every section it
// did not know about. Here a save that carries one section touches one section.

export const getWaimf = async (req, res) => {
  try {
    const doc = await waimfSchema.findOne();
    // An array, to match the shape every other page endpoint on this API
    // returns, so the front end reads it the same way.
    return res.status(200).json({ success: true, waimf: doc ? [doc] : [] });
  } catch (error) {
    console.error("Error fetching waimf page:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch the WAIMF page" });
  }
};

// The sections a caller is allowed to write, so an unexpected key in the body
// cannot create a stray field on the document.
const SECTIONS = new Set([
  "hero",
  "edition",
  "filmmakers",
  "selection",
  "awards",
  "jurors",
  "gallery",
  "rules",
  "contact",
  "advance",
  "seo",
]);

export const updateWaimf = async (req, res) => {
  try {
    const body = req.body || {};
    const set = {};

    // Only sections actually present in the request are written. An absent key
    // leaves what is stored alone - that is the whole point of this shape.
    for (const [key, value] of Object.entries(body)) {
      if (SECTIONS.has(key) && value !== undefined) set[key] = value;
    }

    if (Object.keys(set).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update - no known section in the request",
      });
    }

    const existing = await waimfSchema.findOne();
    const updated = existing
      ? await waimfSchema.findByIdAndUpdate(
          existing._id,
          { $set: set },
          { new: true },
        )
      : await waimfSchema.create(set);

    return res.status(200).json({ success: true, waimf: updated });
  } catch (error) {
    console.error("Error updating waimf page:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update the WAIMF page" });
  }
};

// ---------------------------------------------------------------------------
// One-time seed from the FILM6 festival page.
// ---------------------------------------------------------------------------
//
// waimf.org starts life saying what the festival page already says, then the
// two go their own way. This COPIES; it does not read through. Running it twice
// will not duplicate the document, and it refuses to overwrite a record that
// has already been edited unless explicitly told to.
//
// Reshaped on the way across, because the festival page stores the winners as
// one block of text inside a popup and this site needs them as a list.
const parseWinners = (text) => {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = [];
  const skipped = [];

  for (const line of lines) {
    // Drop the leading trophy emoji and any other non-letter decoration.
    const cleaned = line.replace(/^[^A-Za-z]+/, "").trim();
    if (!cleaned) continue;

    // Split on the FIRST hyphen that is followed by whitespace.
    //
    // Two traps live in this one expression, both present in the real data:
    //   - "BEST ANIMATION AWARD- 'Little Mes'" has no space BEFORE the hyphen,
    //     so requiring one silently dropped that winner entirely.
    //   - "BEST THRILLER-HORROR AWARD - '...'" has a hyphen inside the category
    //     name, so splitting on any hyphen would cut in the wrong place.
    // Requiring whitespace AFTER but not before satisfies both.
    const parts = cleaned.match(/^(.*?)\s*[-–—]\s+(.*)$/);
    if (!parts) {
      skipped.push(line);
      continue;
    }

    const award = parts[1].replace(/\s*AWARD\s*$/i, "").trim();
    const remainder = parts[2].trim();

    // 'Film Title' by Someone - quotes may be curly or straight.
    const titled = remainder.match(/[‘’'"“”](.+?)[‘’'"“”]\s*by\s+(.+)$/i);
    const film = titled ? titled[1].trim() : remainder;
    // One line in the source reads "by by Name" - a typo in the CMS, stripped
    // here rather than printed on the website.
    const filmmaker = titled ? titled[2].replace(/^by\s+/i, "").trim() : "";

    if (!award || !film) {
      skipped.push(line);
      continue;
    }
    rows.push({ award, film, filmmaker });
  }

  // Returned, not swallowed. A winners list quietly missing a winner is the
  // worst possible failure for this particular page.
  return { rows, skipped };
};

export const seedWaimf = async (req, res) => {
  try {
    const force = req.query.force === "1";
    const existing = await waimfSchema.findOne();
    if (existing && !force) {
      return res.status(200).json({
        success: true,
        seeded: false,
        message:
          "A WAIMF record already exists. Pass force=1 to overwrite it - note that this discards any edits made in the panel.",
        id: existing._id,
      });
    }

    let festival = null;
    try {
      const response = await fetch(FILM6_FESTIVAL_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      festival = Array.isArray(json?.festival) ? json.festival[0] : null;
    } catch (error) {
      return res.status(502).json({
        success: false,
        message: `Could not read the FILM6 festival page to seed from: ${error.message}`,
      });
    }
    if (!festival) {
      return res
        .status(404)
        .json({ success: false, message: "No festival page to seed from" });
    }

    const glossary = festival.glossary || {};
    const { rows: winners, skipped: skippedWinners } = parseWinners(
      festival?.toplist?.popup?.description,
    );

    const seeded = {
      hero: {
        // The still Francois approved in the draft, not the festival page's
        // video header - that one is FILM6's and this site has its own look.
        // Swappable from the panel like everything else.
        bgImage:
          "https://res.cloudinary.com/rgwnsnby/image/upload/v1785709282/en3bsvadp4uqk7lku9fh.png",
        alt: "World AI Movie Festival",
        title: "World AI Movie Festival",
        dateline: "Puerto Banús, Marbella · 7–8 October 2026",
        description:
          "The 2026 award winners have been revealed. Eleven films, chosen from over a thousand submissions by an international jury.",
        button: "See the winners",
        link: "/top-filmmakers",
      },
      edition: {
        title: "The first edition",
        description:
          (glossary.items || []).find((i) => /PRESENTATION/i.test(i.term || ""))
            ?.definition || "",
        schedule: [
          { when: "7 Oct, 8pm", what: "Filmmakers meet-up, Puerto Banús" },
          {
            when: "8 Oct, 7–9:30pm",
            what: "Ceremony and screening, Red Dog Cinema",
          },
          { when: "8 Oct, 10pm", what: "After party, Puerto Banús" },
        ],
      },
      filmmakers: {
        mainTitle: "Top Filmmakers 2026",
        description:
          "The films and filmmakers awarded at the inaugural ceremony in Marbella.",
        items: winners,
      },
      selection: {
        mainTitle: "Official Selection",
        description:
          "Films chosen by the programming team and jury for the 2026 edition.",
        // Deliberately EMPTY. The award winners live on Top Filmmakers, not
        // here - Francois split them so the videos are spread across two
        // pages instead of piled onto one. This page is for the finalists and
        // the wider selection, which he adds in the panel.
        items: [],
      },
      awards: {
        mainTitle: festival?.cardSection?.mainTitle || "Festival Awards",
        description:
          "Winners receive official WAIMF laurels, a winner certificate and promotion across the WAIMF and FILM6 channels.",
        cards: (festival?.cardSection?.cards || []).map((c) => ({
          title: c.title,
          description: c.description,
          image: c.image,
        })),
      },
      jurors: {
        mainTitle: festival?.jurors?.mainTitle || "WAIMF Jury",
        items: (festival?.jurors?.items || []).map((j) => ({
          name: j.name,
          role: j.role,
          image: j.image,
          articleId: j.articleId || "",
          link: j.link || "",
        })),
      },
      gallery: {
        mainTitle: festival?.gallery?.mainTitle || "Gallery",
        images: festival?.gallery?.images || [],
      },
      rules: {
        mainTitle: "Rules",
        subtitle: "Eligibility, terms and screening rights.",
        items: (glossary.items || [])
          .filter((i) => !/PRESENTATION/i.test(i.term || ""))
          .map((i) => ({ term: i.term, definition: i.definition })),
      },
      contact: {
        mainTitle: "Get in touch",
        description: "Press, partnerships, submissions and everything else.",
        buttonText: "Send",
      },
    };

    const doc = existing
      ? await waimfSchema.findByIdAndUpdate(
          existing._id,
          { $set: seeded },
          { new: true },
        )
      : await waimfSchema.create(seeded);

    return res.status(200).json({
      success: true,
      seeded: true,
      id: doc._id,
      counts: {
        winners: seeded.filmmakers.items.length,
        // Non-empty means a line in the source did not parse and is NOT on the
        // site. Always check this after seeding.
        winnersSkipped: skippedWinners,
        awards: seeded.awards.cards.length,
        jurors: seeded.jurors.items.length,
        rules: seeded.rules.items.length,
        galleryImages: seeded.gallery.images.length,
      },
    });
  } catch (error) {
    console.error("Error seeding waimf page:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to seed the WAIMF page" });
  }
};


// ---------------------------------------------------------------------------
// Bring the WAIMF news articles across from FILM6.
// ---------------------------------------------------------------------------
//
// The articles about the festival were written in the FILM6 panel and live in
// FILM6's database. This site has its own, so they have to be COPIED - after
// which the two are unrelated and editing one does nothing to the other.
//
// Matching is by title, and what it matched is REPORTED rather than assumed:
// the response lists every article taken and every one left behind, so a wrong
// filter is visible immediately instead of showing up as a thin news page
// nobody can explain.
// Francois: "take the news content from film6/news article from June 30 only".
//
// 30 June 2026 is the day the first WAIMF article was published - "Inaugural
// Edition of the World AI Movie Festival". Everything before it is AI-model
// news (Veo, Sora, Kling, Seedance) which belongs to FILM6, not the festival.
// So the rule is a DATE, not a keyword: a subject filter would keep guessing
// at which articles count, where the cutoff is exactly what he asked for.
const DEFAULT_CUTOFF = "2026-06-30";

// Articles carry an editorial `date` ("June 30, 2026") which is what a visitor
// sees, and a createdAt which is when the record happened to be typed. The two
// disagree on several articles, so the displayed date wins and createdAt is
// only the fallback - otherwise an article would be filed by a date nobody can
// see on the page.
const articleDate = (article) => {
  const shown = Date.parse(String(article?.date || "").trim());
  if (!Number.isNaN(shown)) return new Date(shown);
  const created = Date.parse(article?.createdAt || "");
  return Number.isNaN(created) ? null : new Date(created);
};

export const seedNews = async (req, res) => {
  try {
    const all = req.query.all === "1";
    // ?from=YYYY-MM-DD moves the cutoff without a redeploy.
    const cutoff = new Date(`${req.query.from || DEFAULT_CUTOFF}T00:00:00Z`);
    if (Number.isNaN(cutoff.getTime())) {
      return res.status(400).json({
        success: false,
        message: "from must look like 2026-06-30",
      });
    }

    let articles = [];
    try {
      const response = await fetch(FILM6_BLOG_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      articles = Array.isArray(json?.blogs) ? json.blogs : [];
    } catch (error) {
      return res.status(502).json({
        success: false,
        message: `Could not read the FILM6 articles: ${error.message}`,
      });
    }

    const wanted = [];
    const left = [];
    const undated = [];
    for (const article of articles) {
      if (all) {
        wanted.push(article);
        continue;
      }
      const when = articleDate(article);
      if (!when) {
        // Never silently dropped: an article with no readable date is listed
        // back so it can be dealt with deliberately.
        undated.push(article.title);
        left.push(article);
        continue;
      }
      (when >= cutoff ? wanted : left).push(article);
    }

    // Re-running must not produce duplicates, so an article already here by
    // title is skipped rather than added again.
    const existing = new Set(
      (await blogSchema.find({}, { title: 1 })).map((b) =>
        String(b.title || "").trim().toLowerCase(),
      ),
    );

    const copied = [];
    const alreadyHere = [];
    for (const article of wanted) {
      const key = String(article?.title || "").trim().toLowerCase();
      if (!key) continue;
      if (existing.has(key)) {
        alreadyHere.push(article.title);
        continue;
      }
      await blogSchema.create({
        title: article.title,
        alt: article.alt || "",
        author: article.author || "",
        content: article.content || "",
        image: article.image || "",
        date: article.date || "",
        youtubeUrl: article.youtubeUrl || "",
      });
      existing.add(key);
      copied.push(article.title);
    }

    return res.status(200).json({
      success: true,
      copied: copied.length,
      copiedTitles: copied,
      alreadyHere,
      // The ones deliberately NOT taken. Read this - it is how a filter that
      // is too narrow gets noticed.
      from: cutoff.toISOString().slice(0, 10),
      // Left behind on purpose. Read this - it is how a wrong cutoff gets
      // noticed instead of showing up later as a thin news page.
      notCopied: left.map((a) => a.title),
      // Had no readable date at all, so could not be judged either way.
      undated,
      hint: "?from=YYYY-MM-DD moves the cutoff. ?all=1 copies everything.",
    });
  } catch (error) {
    console.error("Error copying news:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to copy the news articles" });
  }
};
