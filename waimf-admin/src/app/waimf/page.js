'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '@/utils/backend';
import { Field, Area, Repeater, ImageList, ImageField } from '@/component/mainComponents/waimf/Fields';

// The whole of waimf.org, editable.
//
// SAVED SECTION BY SECTION, never as one big form. The backend writes only the
// sections present in the request, so pressing Save under Winners cannot blank
// the Jury. That is deliberate: the older page endpoints on this project
// rebuild the entire document from whatever the form posts, which is how a
// half-filled form once wiped a page header.

const TABS = [
  { key: 'hero', label: 'Header' },
  { key: 'edition', label: 'Edition 2026' },
  { key: 'filmmakers', label: 'Top Filmmakers' },
  { key: 'selection', label: 'Official Selection' },
  { key: 'awards', label: 'Awards' },
  { key: 'jurors', label: 'Jury' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'rules', label: 'Rules' },
  { key: 'contact', label: 'Contact' },
];

export default function WaimfPage() {
  const [doc, setDoc] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [tab, setTab] = useState('hero');
  const [importing, setImporting] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/waimf/getwaimf`);
        setDoc(data?.waimf?.[0] || {});
      } catch (error) {
        console.error('Failed to load the WAIMF page:', error);
        toast.error('Could not load the WAIMF page');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Local edits only - nothing reaches the website until Save is pressed.
  const set = (section, value) =>
    setDoc((prev) => ({ ...prev, [section]: value }));

  const setField = (section, key, value) =>
    setDoc((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }));

  const save = async (section) => {
    setSaving(section);
    try {
      // ONE section per request. See the note at the top of this file.
      const { data } = await axios.put(`${BACKEND_URL}/api/waimf/updatewaimf`, {
        [section]: doc[section] || {},
      });
      if (data?.waimf) setDoc(data.waimf);
      toast.success('Saved');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(
        error?.response?.status === 401
          ? 'Your session has expired - sign in again'
          : 'Save failed',
      );
    } finally {
      setSaving('');
    }
  };

  // Loading the content in from FILM6 has to happen from in here, not from a
  // command I run: both endpoints require a signed-in account, and the panel
  // already sends the token with every request. It also means Francois can
  // re-run them himself whenever he likes.
  const runImport = async (what) => {
    setImporting(what);
    try {
      const url =
        what === 'content'
          ? `${BACKEND_URL}/api/waimf/seed`
          : `${BACKEND_URL}/api/waimf/seed-news`;
      const { data } = await axios.post(url);

      if (what === 'content') {
        if (data.seeded === false) {
          toast.info('Content is already loaded - nothing changed.');
        } else {
          const c = data.counts || {};
          toast.success(
            `Loaded: ${c.winners} winners, ${c.awards} awards, ${c.jurors} jury, ${c.rules} rules.`,
          );
          // Show what arrived without needing a manual refresh.
          const fresh = await axios.get(`${BACKEND_URL}/api/waimf/getwaimf`);
          setDoc(fresh.data?.waimf?.[0] || {});
        }
      } else {
        toast.success(
          data.copied > 0
            ? `${data.copied} articles copied. ${data.notCopied.length} left behind (film6 ones).`
            : 'Nothing new - those articles are already here.',
        );
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error(
        error?.response?.data?.message ||
          (error?.response?.status === 401
            ? 'Your session has expired - sign in again'
            : 'That did not work'),
      );
    } finally {
      setImporting('');
    }
  };

  if (loading) return <div className='pt-24 px-8 text-gray-600'>Loading...</div>;

  const SaveBar = ({ section }) => (
    <div className='flex items-center gap-4 border-t border-gray-200 pt-4 mt-2'>
      <button
        type='button'
        onClick={() => save(section)}
        disabled={saving === section}
        className='bg-black text-white px-6 py-2 disabled:opacity-50'
      >
        {saving === section ? 'Saving...' : 'Save this section'}
      </button>
      <span className='text-sm text-gray-500'>
        Saves only this section. The rest of the page is untouched.
      </span>
    </div>
  );

  const hero = doc.hero || {};
  const edition = doc.edition || {};
  const filmmakers = doc.filmmakers || {};
  const selection = doc.selection || {};
  const awards = doc.awards || {};
  const jurors = doc.jurors || {};
  const gallery = doc.gallery || {};
  const rules = doc.rules || {};
  const contact = doc.contact || {};

  return (
    <div className='pt-12 px-6 pb-24 max-w-[1100px]'>
      <ToastContainer position='top-right' autoClose={3000} />

      <h1 className='text-2xl font-semibold text-black'>waimf.org</h1>
      <p className='text-sm text-gray-600 mt-1 mb-6'>
        Everything on the festival website. Each section saves on its own
        button. A section left empty does not appear on the site at all.
      </p>

      {/* Shown always, because both are safe to press twice: the content one
          refuses if a record already exists, and the news one skips articles
          that are already here. */}
      <div className='border border-gray-300 bg-gray-50 p-4 mb-8'>
        <h2 className='text-sm font-semibold text-black'>Bring content over from FILM6</h2>
        <p className='text-xs text-gray-600 mt-1 mb-3'>
          One-off. Safe to press twice - neither will duplicate anything.
        </p>
        <div className='flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={() => runImport('content')}
            disabled={Boolean(importing)}
            className='text-sm px-4 py-2 border border-black disabled:opacity-50'
          >
            {importing === 'content' ? 'Loading...' : 'Load the festival content'}
          </button>
          <button
            type='button'
            onClick={() => runImport('news')}
            disabled={Boolean(importing)}
            className='text-sm px-4 py-2 border border-black disabled:opacity-50'
          >
            {importing === 'news' ? 'Copying...' : 'Copy the news articles'}
          </button>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 border-b border-gray-300 mb-8'>
        {TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px ${
              tab === t.key
                ? 'border-black text-black font-medium'
                : 'border-transparent text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <section>
          <Field label='Title' value={hero.title} onChange={(v) => setField('hero', 'title', v)} />
          <Field
            label='Dates line'
            hint='The ONLY place the dates appear on the whole site. Shown in gold above the title.'
            value={hero.dateline}
            onChange={(v) => setField('hero', 'dateline', v)}
          />
          <Area label='Sentence under the title' value={hero.description} rows={3}
            onChange={(v) => setField('hero', 'description', v)} />
          <Field label='Button text' value={hero.button} onChange={(v) => setField('hero', 'button', v)} />
          <Field label='Button link' placeholder='/top-filmmakers' value={hero.link}
            onChange={(v) => setField('hero', 'link', v)} />
          <ImageField
            label='Background picture or video'
            hint='Upload a picture, or an .mp4 to have it play behind the title.'
            value={Array.isArray(hero.bgImage) ? hero.bgImage.at(-1) : hero.bgImage}
            onChange={(v) => setField('hero', 'bgImage', v)}
          />
          <SaveBar section='hero' />
        </section>
      )}

      {tab === 'edition' && (
        <section>
          <Field label='Heading' value={edition.title} onChange={(v) => setField('edition', 'title', v)} />
          <Area label='Description' rows={10} value={edition.description}
            onChange={(v) => setField('edition', 'description', v)} />
          <Repeater
            label='Festival schedule'
            hint='Shown as a list beside the description.'
            items={edition.schedule}
            columns={[
              { key: 'when', label: 'When', placeholder: '8 Oct, 7-9:30pm' },
              { key: 'what', label: 'What', wide: true, placeholder: 'Ceremony and screening, Red Dog Cinema' },
            ]}
            newRow={{ when: '', what: '' }}
            onChange={(v) => setField('edition', 'schedule', v)}
          />
          <SaveBar section='edition' />
        </section>
      )}

      {tab === 'filmmakers' && (
        <section>
          <Field label='Heading' value={filmmakers.mainTitle}
            onChange={(v) => setField('filmmakers', 'mainTitle', v)} />
          <Area label='Intro line' rows={2} value={filmmakers.description}
            onChange={(v) => setField('filmmakers', 'description', v)} />
          <Repeater
            label='Winners'
            hint='One row per award. The order here is the order on the page. Paste a YouTube link and the winning film also appears as a video further down this page - that is where the winners play, not on the Official Selection page.'
            items={filmmakers.items}
            columns={[
              { key: 'award', label: 'Award', placeholder: 'Grand Prix' },
              { key: 'film', label: 'Film', placeholder: 'Azul Cobalto' },
              { key: 'filmmaker', label: 'Filmmaker', wide: true, placeholder: 'Tomas Pena' },
              { key: 'duration', label: 'Length', placeholder: '4 min' },
              { key: 'youtubeUrl', label: 'YouTube address', wide: true },
            ]}
            newRow={{ award: '', film: '', filmmaker: '', duration: '', youtubeUrl: '' }}
            onChange={(v) => setField('filmmakers', 'items', v)}
          />
          <SaveBar section='filmmakers' />
        </section>
      )}

      {tab === 'selection' && (
        <section>
          <Field label='Heading' value={selection.mainTitle}
            onChange={(v) => setField('selection', 'mainTitle', v)} />
          <Area label='Intro line' rows={2} value={selection.description}
            onChange={(v) => setField('selection', 'description', v)} />
          <Repeater
            label='Films'
            hint='Finalists and the wider official selection. The award winners do NOT go here - they are on the Top Filmmakers tab, so the films are spread across two pages. Type Finalist in the Group column to lift a film to the top with a gold laurel; leave it empty for the rest of the selection. Paste the YouTube address and the poster appears on its own.'
            items={selection.items}
            columns={[
              { key: 'category', label: 'Group', placeholder: 'Finalist' },
              { key: 'title', label: 'Title', wide: true },
              { key: 'director', label: 'Director' },
              { key: 'duration', label: 'Length', placeholder: '4 min' },
              { key: 'youtubeUrl', label: 'YouTube address', wide: true },
            ]}
            newRow={{ category: '', title: '', director: '', duration: '', youtubeUrl: '' }}
            onChange={(v) => setField('selection', 'items', v)}
          />
          <SaveBar section='selection' />
        </section>
      )}

      {tab === 'awards' && (
        <section>
          <Field label='Heading' value={awards.mainTitle}
            onChange={(v) => setField('awards', 'mainTitle', v)} />
          <Area label='Intro line' rows={2} value={awards.description}
            onChange={(v) => setField('awards', 'description', v)} />
          <Repeater
            label='Award categories'
            items={awards.cards}
            columns={[
              { key: 'title', label: 'Award', wide: true },
              { key: 'description', label: 'Description', area: true, wide: true },
            ]}
            newRow={{ title: '', description: '' }}
            onChange={(v) => setField('awards', 'cards', v)}
          />
          <SaveBar section='awards' />
        </section>
      )}

      {tab === 'jurors' && (
        <section>
          <Field label='Heading' value={jurors.mainTitle}
            onChange={(v) => setField('jurors', 'mainTitle', v)} />
          <Repeater
            label='Jury'
            hint='Photographs are resized automatically, so upload whatever you have.'
            items={jurors.items}
            columns={[
              { key: 'name', label: 'Name', wide: true },
              { key: 'role', label: 'Role', wide: true },
              { key: 'image', label: 'Photo', image: true, wide: true },
            ]}
            newRow={{ name: '', role: '', image: '' }}
            onChange={(v) => setField('jurors', 'items', v)}
          />
          <SaveBar section='jurors' />
        </section>
      )}

      {tab === 'gallery' && (
        <section>
          <Field label='Heading' value={gallery.mainTitle}
            onChange={(v) => setField('gallery', 'mainTitle', v)} />
          <ImageList
            label='Photographs'
            hint='Upload the ceremony pictures here. They go straight to Cloudinary, so there is no size limit to trip over.'
            images={gallery.images}
            onChange={(v) => setField('gallery', 'images', v)}
          />
          <SaveBar section='gallery' />
        </section>
      )}

      {tab === 'rules' && (
        <section>
          <Field label='Heading' value={rules.mainTitle}
            onChange={(v) => setField('rules', 'mainTitle', v)} />
          <Field label='Line under the heading' value={rules.subtitle}
            onChange={(v) => setField('rules', 'subtitle', v)} />
          <Repeater
            label='Rules'
            hint='Each one becomes a column on the Rules page. Line breaks are kept.'
            items={rules.items}
            columns={[
              { key: 'term', label: 'Heading', wide: true },
              { key: 'definition', label: 'Text', area: true, wide: true },
            ]}
            newRow={{ term: '', definition: '' }}
            onChange={(v) => setField('rules', 'items', v)}
          />
          <SaveBar section='rules' />
        </section>
      )}

      {tab === 'contact' && (
        <section>
          <Field label='Heading' value={contact.mainTitle}
            onChange={(v) => setField('contact', 'mainTitle', v)} />
          <Area label='Line underneath' rows={2} value={contact.description}
            onChange={(v) => setField('contact', 'description', v)} />
          <Field label='Button text' value={contact.buttonText}
            onChange={(v) => setField('contact', 'buttonText', v)} />
          <SaveBar section='contact' />
        </section>
      )}
    </div>
  );
}
