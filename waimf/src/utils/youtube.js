// Subtitles were switching themselves on inside the embeds, even for viewers who
// have captions turned off on their own YouTube account.
//
// The account preference never reaches an embed: a YouTube player on another
// site runs in a signed-out, cookie-restricted context, so it cannot see who is
// watching and falls back to its own default. On a video that has captions
// available - including the auto-generated ones YouTube adds by itself - that
// default can be "on".
//
// cc_load_policy=0 asks the player not to load captions by default. The CC
// button is untouched, so anyone who wants subtitles can still switch them on,
// and a viewer who has them forced on in their own settings still gets them.
//
// Applied at every iframe src on the site rather than in one component, because
// each section builds its own embed URL and the behaviour has to be the same
// everywhere. Non-YouTube sources are returned untouched - Hero renders plain
// video files through the same prop, and appending a query string to a hosted
// file URL is a good way to break it.
export const playerSrc = (url) => {
  const src = String(url || "");
  if (!src.includes("youtube.com/embed") && !src.includes("youtube-nocookie.com/embed")) {
    return url;
  }

  const [withoutHash, hash = ""] = src.split("#");
  const [base, query = ""] = withoutHash.split("?");
  const params = new URLSearchParams(query);

  // An explicit value in the stored URL wins - if someone deliberately wants
  // captions on for one video, this must not quietly override them.
  if (!params.has("cc_load_policy")) params.set("cc_load_policy", "0");

  const rebuilt = `${base}?${params.toString()}`;
  return hash ? `${rebuilt}#${hash}` : rebuilt;
};

export default playerSrc;
