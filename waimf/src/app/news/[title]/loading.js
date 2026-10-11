import Loading from "@/components/faq/Loading";

// Shown the instant a navigation to an article starts, before the page
// component mounts. Without it the outgoing news listing stayed on screen for
// ~44ms while the router moved the scroll position 734px down it - a visible
// lurch before the article appeared. A short document cannot scroll that far.
export default function LoadingArticle() {
  return <Loading />;
}
