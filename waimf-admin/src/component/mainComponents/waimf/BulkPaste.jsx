'use client';

import { useState } from 'react';
import { parseFilmList } from '@/utils/parseFilmList';

// Paste a whole list of films at once instead of adding them one row at a time.
//
// Francois: "we shall be able to paste the FINALIST list, and SELECTION list,
// because one by one it will take a decade". Two steps on purpose - read, then
// add - so he sees exactly what was understood, line by line, before anything
// joins the list. Lines that could not be read are shown, not dropped.
const BulkPaste = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [group, setGroup] = useState('Finalist');
  const [preview, setPreview] = useState(null);

  const read = () => setPreview(parseFilmList(text));

  const add = () => {
    if (!preview?.films?.length) return;
    onAdd(
      preview.films.map((f) => ({
        category: group === 'Official Selection' ? '' : group,
        title: f.title,
        director: f.director,
        duration: f.duration,
        youtubeUrl: f.youtubeUrl,
      })),
    );
    setText('');
    setPreview(null);
  };

  return (
    <div className='border border-gray-300 bg-gray-50 p-4 mb-8'>
      <h3 className='text-base font-semibold text-black'>Paste a list</h3>
      <p className='text-xs text-gray-600 mt-1 mb-3'>
        One film per line. Any of these work: <b>Title - Director</b>,{' '}
        <b>&apos;Title&apos; by Director</b>, or columns copied straight from a spreadsheet.
        A YouTube link or a running time anywhere on the line is picked up too.
      </p>

      <div className='flex flex-wrap items-center gap-3 mb-3'>
        <span className='text-sm text-black'>Add them as:</span>
        {['Finalist', 'Official Selection'].map((g) => (
          <label key={g} className='flex items-center gap-1.5 text-sm'>
            <input type='radio' name='bulk-group' checked={group === g} onChange={() => setGroup(g)} />
            {g}
          </label>
        ))}
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPreview(null);
        }}
        placeholder={"Azul Cobalto - Tomas Pena\n'The Last Span' by 2X LAB\nNoor\tNishtha Shailajan\thttps://youtu.be/..."}
        className='border border-black px-3 py-2 outline-0 w-full text-sm font-mono'
      />

      <div className='flex flex-wrap items-center gap-3 mt-3'>
        <button type='button' onClick={read} disabled={!text.trim()}
          className='text-sm px-4 py-2 border border-black disabled:opacity-40'>
          Read the list
        </button>
        {preview && (
          <button type='button' onClick={add} disabled={!preview.films.length}
            className='text-sm px-4 py-2 bg-black text-white disabled:opacity-40'>
            Add {preview.films.length} films as {group}
          </button>
        )}
      </div>

      {preview && (
        <div className='mt-4 text-sm'>
          <p className='text-gray-700 mb-2'>
            Understood {preview.films.length} films
            {preview.skipped.length > 0 && `, skipped ${preview.skipped.length} line(s)`}. They
            are added to the list below - press <b>Save this section</b> after.
          </p>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='text-[11px] uppercase text-gray-500'>
                <th className='py-1 pr-3'>Title</th><th className='py-1 pr-3'>Director</th>
                <th className='py-1 pr-3'>Length</th><th className='py-1'>YouTube</th>
              </tr>
            </thead>
            <tbody>
              {preview.films.map((f, i) => (
                <tr key={i} className='border-t border-gray-200'>
                  <td className='py-1 pr-3'>{f.title}</td>
                  <td className='py-1 pr-3'>{f.director || <span className='text-gray-400'>-</span>}</td>
                  <td className='py-1 pr-3'>{f.duration || <span className='text-gray-400'>-</span>}</td>
                  <td className='py-1'>{f.youtubeUrl ? 'yes' : <span className='text-gray-400'>-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.skipped.length > 0 && (
            <p className='text-xs text-gray-500 mt-2'>
              Skipped (headings or unreadable): {preview.skipped.join(' · ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkPaste;
