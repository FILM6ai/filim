// TEMPORARY one-off media restore endpoint.
// Replaces dead-Cloudinary (drh7q62eh) asset URLs with re-hosted copies on the
// client-owned cloud (rgwnsnby). Exact full-URL substring replacement only.
// Dry-run by default; ?apply=1 writes. REMOVE THIS FILE AFTER RUNNING.
import mongoose from "mongoose";

const TOKEN = "rs_media_7Kq2Vm9Xp4Lz8Nd";

const MAP = [
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1781435258/gpmqc3xidein8qlevima.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1782669595/acifi86gjt4thz8gjfxz.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1782689140/eusglg8a35whq92nbua6.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783903546/winxprqje79i0ja17frb.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_winxprqje79i0ja17frb.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1782687655/f9varef4ofusqfj1yi1m.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1782690725/hve64lajmqnwka4ej0qd.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_hve64lajmqnwka4ej0qd.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783905857/zbk8c9g1pc52xetw0j3g.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783937200/b0c5lrmkdsns0f0b1ixc.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_b0c5lrmkdsns0f0b1ixc.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778672189/uu2sbzzj1ezsg8kldtzn.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_uu2sbzzj1ezsg8kldtzn.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778758438/ehtdurrvoubzhuqc2mgl.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_ehtdurrvoubzhuqc2mgl.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1779053666/xucqvp5g9ump3wpsd2qw.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_xucqvp5g9ump3wpsd2qw.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1779053802/u9qhctfytrf8bzgi2epx.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/festival_u9qhctfytrf8bzgi2epx.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778047250/ukw6breq7cxgi0etosyx.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783898746/x5ownu0eomhmoyshyemc.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783899574/cwdyze9qtjlq7qggoqvh.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/home_cwdyze9qtjlq7qggoqvh.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783986040/inchpbl379xnsjzmcbfr.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/service_inchpbl379xnsjzmcbfr.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1776781105/w0shwceypc9zk1ovihqi.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778051128/b0gsj9irw7qubnxrcmfc.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_b0gsj9irw7qubnxrcmfc.jpg",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778051130/iravwowvscspfzrhkw5i.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_iravwowvscspfzrhkw5i.jpg",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778051187/cgtbucdresdyobhwthqv.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_cgtbucdresdyobhwthqv.webp",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778051131/jzgwndbtywbua3jsxidc.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778051131/pqujmxkgayxof7u3zofv.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1778051132/cwqjlhqbpf4b1h7tleer.webp",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783856008/owo0entmvui9eenkmblt.jpg",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_owo0entmvui9eenkmblt.jpg",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783856009/gilqccw9vftygiqyd6zl.jpg",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_gilqccw9vftygiqyd6zl.jpg",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783855647/xwn8xwecz1whnkjad0ya.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_xwn8xwecz1whnkjad0ya.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783857386/zxmimuqff4sugvtlxbvq.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_zxmimuqff4sugvtlxbvq.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1783857493/tminlw8rnyk1j686q8qj.jpg",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/studio_tminlw8rnyk1j686q8qj.jpg",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1779068988/rsi5fo5ecaohxeirwhen.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1779066858/rbjippuhwftmyuwsnbxe.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
  [
    "https://res.cloudinary.com/drh7q62eh/image/upload/v1776781719/aootixemposso2pxeqeq.png",
    "https://res.cloudinary.com/rgwnsnby/image/upload/f_auto,q_auto/site-restore/placeholder_film6.png",
  ],
];

const COLLECTIONS = [
  "studios",
  "festivals",
  "services",
  "homes",
  "blogs",
  "news",
  "contacts",
  "faqs",
  "footers",
  "navbars",
  "terms",
];

const isPlain = (v) =>
  v && typeof v === "object" && !(v instanceof Date) &&
  !(v instanceof mongoose.Types.ObjectId) && !Buffer.isBuffer(v);

const replaceDeep = (node, hits) => {
  if (typeof node === "string") {
    let out = node;
    for (const [from, to] of MAP) {
      if (out.includes(from)) {
        out = out.split(from).join(to);
        hits.push(from.split("/").pop());
      }
    }
    return out;
  }
  if (Array.isArray(node)) return node.map((v) => replaceDeep(v, hits));
  if (isPlain(node)) {
    const out = {};
    for (const k of Object.keys(node)) out[k] = replaceDeep(node[k], hits);
    return out;
  }
  return node;
};

export const restoreMedia = async (req, res) => {
  try {
    if (req.query.token !== TOKEN) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const apply = req.query.apply === "1";
    const db = mongoose.connection.db;
    const report = [];

    for (const name of COLLECTIONS) {
      let docs;
      try {
        docs = await db.collection(name).find({}).toArray();
      } catch (e) {
        report.push({ collection: name, error: e.message });
        continue;
      }
      for (const doc of docs) {
        const hits = [];
        const next = replaceDeep(doc, hits);
        if (!hits.length) continue;
        if (apply) {
          await db.collection(name).replaceOne({ _id: doc._id }, next);
        }
        report.push({
          collection: name,
          _id: String(doc._id),
          replaced: hits.length,
          assets: hits,
        });
      }
    }

    return res.status(200).json({
      success: true,
      mode: apply ? "APPLIED" : "DRY RUN (add &apply=1 to write)",
      mappings: MAP.length,
      documentsTouched: report.length,
      report,
    });
  } catch (error) {
    console.error("restoreMedia error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
