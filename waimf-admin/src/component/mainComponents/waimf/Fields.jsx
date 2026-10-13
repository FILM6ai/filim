'use client';

import { useRef, useState } from 'react';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';

// Small building blocks for the WAIMF editor.
//
// Written so Francois can work out what to do without being told: every field
// says what it is and, where it is not obvious, what happens if it is left
// empty. A section that renders nothing when blank is far less alarming once
// the panel says so out loud.

export const Field = ({ label, hint, value, onChange, placeholder, type = 'text' }) => (
  <label className='block mb-4'>
    <span className='block text-sm font-medium text-black'>{label}</span>
    {hint && <span className='block text-xs text-gray-500 mt-0.5'>{hint}</span>}
    <input
      type={type}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className='border border-black px-3 py-2 mt-1.5 outline-0 w-full'
    />
  </label>
);

export const Area = ({ label, hint, value, onChange, rows = 5 }) => (
  <label className='block mb-4'>
    <span className='block text-sm font-medium text-black'>{label}</span>
    {hint && <span className='block text-xs text-gray-500 mt-0.5'>{hint}</span>}
    <textarea
      rows={rows}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className='border border-black px-3 py-2 mt-1.5 outline-0 w-full'
    />
  </label>
);

// A list of identical rows: winners, films, jury, awards, rules, schedule.
//
// One component for all six, because they differ only in their columns. Rows
// can be added, removed and reordered; order is what the website shows.
// The in-row version of ImageField: a thumbnail, a file picker and nothing
// else, because a repeater row has no space for more.
const RowImage = ({ value, onChange }) => {
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadToCloudinary(file));
    } catch (e) {
      console.error('Upload failed:', e);
      alert(`Upload failed: ${e?.message || 'unknown error'}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className='mt-1 flex items-center gap-2'>
      {value ? (
        <img src={value} alt='' className='w-14 h-14 object-cover border border-gray-300 shrink-0' />
      ) : (
        <div className='w-14 h-14 border border-dashed border-gray-300 shrink-0' />
      )}
      <input ref={input} type='file' accept='image/*' disabled={busy}
        onChange={(e) => pick(e.target.files?.[0])}
        className='block text-[11px] w-full' />
      {busy && <span className='text-[11px] text-gray-500'>...</span>}
    </div>
  );
};

export const Repeater = ({ label, hint, items, columns, onChange, newRow }) => {
  const rows = Array.isArray(items) ? items : [];

  const update = (index, key, value) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className='mb-8'>
      <div className='flex items-baseline justify-between mb-1'>
        <h3 className='text-base font-semibold text-black'>{label}</h3>
        <span className='text-xs text-gray-500'>{rows.length} entries</span>
      </div>
      {hint && <p className='text-xs text-gray-500 mb-3'>{hint}</p>}

      {rows.length === 0 && (
        <p className='text-sm text-gray-500 border border-dashed border-gray-300 p-4 mb-3'>
          Nothing here yet. While this list is empty the section does not appear
          on the website at all.
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className='border border-gray-300 p-3 mb-2 bg-gray-50'>
          <div className='flex flex-wrap gap-2'>
            {columns.map((col) => (
              <label key={col.key} className={col.wide ? 'flex-[2] min-w-[220px]' : 'flex-1 min-w-[150px]'}>
                <span className='block text-[11px] uppercase tracking-wide text-gray-500'>
                  {col.label}
                </span>
                {col.image ? (
                  <RowImage
                    value={row[col.key]}
                    onChange={(v) => update(index, col.key, v)}
                  />
                ) : col.area ? (
                  <textarea
                    rows={4}
                    value={row[col.key] || ''}
                    onChange={(e) => update(index, col.key, e.target.value)}
                    className='border border-gray-400 px-2 py-1.5 mt-1 outline-0 w-full text-sm'
                  />
                ) : (
                  <input
                    value={row[col.key] || ''}
                    placeholder={col.placeholder}
                    onChange={(e) => update(index, col.key, e.target.value)}
                    className='border border-gray-400 px-2 py-1.5 mt-1 outline-0 w-full text-sm'
                  />
                )}
              </label>
            ))}
          </div>
          <div className='flex gap-2 mt-2'>
            <button type='button' onClick={() => move(index, -1)} disabled={index === 0}
              className='text-xs px-2 py-1 border border-gray-400 disabled:opacity-40'>
              Move up
            </button>
            <button type='button' onClick={() => move(index, 1)} disabled={index === rows.length - 1}
              className='text-xs px-2 py-1 border border-gray-400 disabled:opacity-40'>
              Move down
            </button>
            <button type='button'
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className='text-xs px-2 py-1 border border-red-400 text-red-600 ml-auto'>
              Remove
            </button>
          </div>
        </div>
      ))}

      <button type='button' onClick={() => onChange([...rows, { ...newRow }])}
        className='text-sm px-4 py-2 border border-black mt-1'>
        Add
      </button>
    </div>
  );
};

// One picture, uploaded or pasted.
//
// Francois asked to be able to change the visuals from the panel, not just the
// words. Pasting an address still works for anything already on Cloudinary,
// but nobody should have to find an address to change a photograph.
export const ImageField = ({ label, hint, value, onChange, accept = 'image/*,video/mp4' }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);

  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadToCloudinary(file));
    } catch (e) {
      console.error('Upload failed:', e);
      setError(`Upload failed: ${e?.message || 'unknown error'}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(String(value || ''));

  return (
    <div className='mb-5'>
      <span className='block text-sm font-medium text-black'>{label}</span>
      {hint && <span className='block text-xs text-gray-500 mt-0.5'>{hint}</span>}

      <div className='flex flex-wrap items-start gap-4 mt-2'>
        {value ? (
          isVideo ? (
            <video src={value} muted className='w-44 h-28 object-cover border border-gray-300' />
          ) : (
            <img src={value} alt='' className='w-44 h-28 object-cover border border-gray-300' />
          )
        ) : (
          <div className='w-44 h-28 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400'>
            Nothing set
          </div>
        )}

        <div className='flex-1 min-w-[260px]'>
          <input ref={input} type='file' accept={accept} disabled={busy}
            onChange={(e) => pick(e.target.files?.[0])}
            className='block text-sm' />
          {busy && <p className='text-sm text-gray-600 mt-1'>Uploading...</p>}
          {error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
          <input
            value={value || ''}
            placeholder='...or paste an address'
            onChange={(e) => onChange(e.target.value)}
            className='border border-gray-400 px-2 py-1.5 mt-2 outline-0 w-full text-sm'
          />
          {value && (
            <button type='button' onClick={() => onChange('')}
              className='text-xs px-2 py-1 border border-red-400 text-red-600 mt-2'>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Uploads straight to Cloudinary from the browser.
//
// Not through our own API on purpose: Vercel rejects any request body over
// about 4.5MB at the edge, before the server sees it, which is what used to
// make photo uploads fail with no useful message. Going direct has no such
// ceiling.
// Takes the item at `from` out and puts it back at `to`.
const moveTo = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export const ImageList = ({ label, hint, images, onChange }) => {
  const list = Array.isArray(images) ? images : [];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);

  const add = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    try {
      const uploaded = [];
      // Sequential rather than all at once: a dozen large photographs uploaded
      // in parallel is how a slow connection times out halfway and leaves you
      // guessing which ones made it.
      for (const file of Array.from(files)) {
        uploaded.push(await uploadToCloudinary(file));
      }
      onChange([...list, ...uploaded]);
    } catch (e) {
      console.error('Upload failed:', e);
      // The real reason, not a generic line: "Cloudinary config missing on
      // server" and "api_secret mismatch" need different fixes.
      setError(`Upload failed: ${e?.message || 'unknown error'}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className='mb-8'>
      <div className='flex items-baseline justify-between mb-1'>
        <h3 className='text-base font-semibold text-black'>{label}</h3>
        <span className='text-xs text-gray-500'>{list.length} images</span>
      </div>
      {hint && <p className='text-xs text-gray-500 mb-3'>{hint}</p>}

      <input ref={input} type='file' accept='image/*' multiple disabled={busy}
        onChange={(e) => add(e.target.files)}
        className='block text-sm mb-3' />
      {busy && <p className='text-sm text-gray-600 mb-3'>Uploading...</p>}
      {error && <p className='text-sm text-red-600 mb-3'>{error}</p>}

      {list.length > 1 && (
        <p className='text-xs text-gray-500 mb-2'>
          The order here is the order on the website. Use the arrows under a
          picture to move it, then Save this section.
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        {list.map((src, i) => (
          <div key={`${src}-${i}`} className='relative w-32'>
            <img src={src} alt='' className='w-32 h-24 object-cover border border-gray-300' />
            <span className='absolute top-0 left-0 bg-black/70 text-white text-[11px] px-1.5 py-0.5'>
              {i + 1}
            </span>
            <button type='button'
              onClick={() => onChange(list.filter((_, index) => index !== i))}
              className='absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1'>
              X
            </button>
            <div className='flex mt-1 gap-1'>
              <button type='button' title='First' disabled={i === 0}
                onClick={() => onChange(moveTo(list, i, 0))}
                className='flex-1 text-xs py-0.5 border border-gray-400 disabled:opacity-30'>
                &laquo;
              </button>
              <button type='button' title='Move left' disabled={i === 0}
                onClick={() => onChange(moveTo(list, i, i - 1))}
                className='flex-1 text-xs py-0.5 border border-gray-400 disabled:opacity-30'>
                &lsaquo;
              </button>
              <button type='button' title='Move right' disabled={i === list.length - 1}
                onClick={() => onChange(moveTo(list, i, i + 1))}
                className='flex-1 text-xs py-0.5 border border-gray-400 disabled:opacity-30'>
                &rsaquo;
              </button>
              <button type='button' title='Last' disabled={i === list.length - 1}
                onClick={() => onChange(moveTo(list, i, list.length - 1))}
                className='flex-1 text-xs py-0.5 border border-gray-400 disabled:opacity-30'>
                &raquo;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
