'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import slugify from 'slugify';
import { API_BASE_URL } from '@/utils/backend';

// Article addresses are built from the headline, so a retitled article moves.
// The juror holds the article's id and the address is worked out here, from
// whatever the headline says today - the link cannot go stale behind anyone's
// back. Same rule as everywhere else on the site, so the two agree.
const articlePath = (title) =>
  `/news/${slugify(String(title || ''), { lower: true, strict: true })}`;

const JurorPhotos = ({ mainTitle, items }) => {
  const [articlesById, setArticlesById] = useState(null);

  const linksToArticles = (items || []).some((juror) => juror?.articleId);

  useEffect(() => {
    if (!linksToArticles) return;

    let cancelled = false;
    axios
      .get(`${API_BASE_URL}/blog/getblog`)
      .then(({ data }) => {
        if (cancelled) return;
        const byId = {};
        (data.blogs || []).forEach((article) => {
          if (article?._id) byId[String(article._id)] = article.title;
        });
        setArticlesById(byId);
      })
      // A juror card that cannot resolve its article stays exactly as it was
      // before: a photo and a name. Nothing on this page depends on the
      // articles loading.
      .catch(() => setArticlesById({}));

    return () => {
      cancelled = true;
    };
  }, [linksToArticles]);

  if (!items || items.length === 0) return null;

  const hrefFor = (juror) => {
    if (juror?.articleId) {
      // Still loading, or the article has since been deleted.
      const title = articlesById?.[String(juror.articleId)];
      return title ? articlePath(title) : null;
    }
    const link = String(juror?.link || '').trim();
    return link || null;
  };

  return (
    <div className="w-full bg-black py-16 px-6 lg:px-20">
      {mainTitle && (
        <h2 className="text-center text-white text-4xl font-bold mb-12">
          {mainTitle}
        </h2>
      )}

      {/* Wraps onto a new line every 4 jurors, remaining ones stay centred.
                max-w = 4 cards (260px) + 3 gaps (24px) so the break point is exact. */}
      <div className="flex flex-wrap justify-center gap-6 mx-auto max-w-[1112px]">
        {items.map((juror, index) => {
          const href = hrefFor(juror);

          const card = (
            <div
              className={`flex flex-col bg-white w-full max-w-[300px] sm:w-[260px] h-full ${
                href ? 'group' : ''
              }`}
            >
              {/* Image */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={juror.image}
                  alt={juror.name}
                  className={
                    href
                      ? 'transition-transform duration-300 group-hover:scale-105'
                      : undefined
                  }
                  style={{
                    width: '100%',
                    height: '260px',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-1">
                <p
                  className={`text-black font-bold text-lg leading-snug ${
                    href ? 'group-hover:underline' : ''
                  }`}
                >
                  {juror.name}
                </p>
                <p className="text-sm mt-1" style={{ color: '#555' }}>
                  {juror.role}
                </p>
                {href && (
                  <span className="text-sm mt-2 font-semibold text-[#2D4A68]">
                    Read their profile →
                  </span>
                )}
              </div>
            </div>
          );

          const key = juror._id || index;

          // A juror with nothing to link to is left exactly as before, rather
          // than becoming a link that goes nowhere.
          if (!href) return <React.Fragment key={key}>{card}</React.Fragment>;

          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read the profile of ${juror.name}`}
              className="w-full max-w-[300px] sm:w-auto no-underline"
            >
              {card}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default JurorPhotos;
