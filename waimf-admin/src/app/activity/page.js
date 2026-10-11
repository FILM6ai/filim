'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/backend';
import { getUser } from '@/utils/authClient';

const PAGE_SIZE = 100;

const ActivityPage = () => {
  const [me, setMe] = useState(null);
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [onlyAnonymous, setOnlyAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setMe(getUser()), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/auth/activity`, {
        params: {
          page,
          limit: PAGE_SIZE,
          ...(onlyAnonymous ? { onlyUnauthenticated: 'true' } : {}),
        },
      });
      setEntries(data.entries || []);
      setTotal(data.total || 0);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load the activity log.');
    } finally {
      setLoading(false);
    }
  }, [page, onlyAnonymous]);

  useEffect(() => {
    load();
  }, [load]);

  if (me && me.role !== 'owner') {
    return (
      <div className='p-8 text-gray-500'>
        Only an owner can see the activity log.
      </div>
    );
  }

  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-semibold mb-1'>Activity log</h2>
      <p className='text-gray-500 mb-6 text-sm max-w-2xl'>
        Every change made through the admin panel, and every attempt to change
        something without signing in. Rows highlighted in red came from
        somewhere that was not signed in.
      </p>

      <div className='flex items-center gap-4 mb-4 text-sm'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={onlyAnonymous}
            onChange={(e) => {
              setPage(1);
              setOnlyAnonymous(e.target.checked);
            }}
          />
          Show only requests that were not signed in
        </label>
        <button
          onClick={load}
          className='text-blue-600 underline cursor-pointer'
        >
          Refresh
        </button>
        <span className='text-gray-400'>{total} entries</span>
      </div>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {loading ? (
        <p className='text-gray-500'>Loading...</p>
      ) : (
        <>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm'>
              <thead>
                <tr className='bg-black text-white text-left'>
                  <th className='py-2 px-4 border'>When</th>
                  <th className='py-2 px-4 border'>Who</th>
                  <th className='py-2 px-4 border'>What</th>
                  <th className='py-2 px-4 border'>Result</th>
                  <th className='py-2 px-4 border'>From</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry._id}
                    className={
                      entry.unauthenticated ? 'bg-red-50' : 'hover:bg-gray-50'
                    }
                  >
                    <td className='py-2 px-4 border whitespace-nowrap'>
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className='py-2 px-4 border'>
                      {/* On a failed sign-in the address is what someone
                          typed, not proof of who they were - worth saying so
                          plainly in a log people will read to assign blame. */}
                      {!entry.userEmail ? (
                        <span className='text-red-600'>not signed in</span>
                      ) : entry.unauthenticated ? (
                        <span className='text-red-700'>
                          tried as {entry.userEmail}
                        </span>
                      ) : (
                        entry.userEmail
                      )}
                    </td>
                    <td className='py-2 px-4 border'>
                      {entry.action}
                      <span className='block text-gray-400 text-xs'>
                        {entry.method} {entry.path}
                      </span>
                    </td>
                    <td className='py-2 px-4 border'>{entry.status || '-'}</td>
                    <td className='py-2 px-4 border text-xs text-gray-500'>
                      {entry.ip}
                      {entry.origin ? ` (${entry.origin})` : ''}
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className='py-6 text-center text-gray-400'>
                      Nothing recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className='flex items-center gap-3 mt-4 text-sm'>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className='border rounded px-3 py-1 disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed'
            >
              Previous
            </button>
            <span className='text-gray-500'>
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className='border rounded px-3 py-1 disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityPage;
