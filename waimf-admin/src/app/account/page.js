'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, getUser } from '@/utils/authClient';

const MIN_LENGTH = 10;

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setDone('');

    if (next.length < MIN_LENGTH) {
      setError(`Your new password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (next !== confirm) {
      setError('The two new passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      const updated = await changePassword(current, next);
      setUser(updated);
      setCurrent('');
      setNext('');
      setConfirm('');
      setDone('Password updated.');
      // Whoever arrived here because they were still on a temporary password
      // can now get on with the actual job.
      if (!updated.mustChangePassword) setTimeout(() => router.replace('/'), 900);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='p-8 max-w-xl'>
      <h2 className='text-2xl font-semibold mb-1'>Your account</h2>
      {user && (
        <p className='text-gray-500 mb-6'>
          Signed in as {user.name} ({user.email}) &mdash;{' '}
          {user.role === 'owner' ? 'owner' : 'editor'}
        </p>
      )}

      {user?.mustChangePassword && (
        <div className='mb-6 p-3 rounded border border-amber-200 bg-amber-50 text-amber-800 text-sm'>
          You are signed in with a temporary password. Please choose your own
          before carrying on &mdash; the temporary one stops working as soon as
          you do.
        </div>
      )}

      <form onSubmit={submit} className='flex flex-col gap-4 text-sm'>
        <label className='flex flex-col gap-1'>
          <span>Current password</span>
          <input
            type='password'
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete='current-password'
            className='border border-[#DADADA] rounded p-2 outline-none'
            required
          />
        </label>
        <label className='flex flex-col gap-1'>
          <span>New password</span>
          <input
            type='password'
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete='new-password'
            className='border border-[#DADADA] rounded p-2 outline-none'
            required
          />
          <span className='text-gray-400 text-xs'>
            At least {MIN_LENGTH} characters. A short phrase you will remember
            beats a short jumble you will not.
          </span>
        </label>
        <label className='flex flex-col gap-1'>
          <span>Confirm new password</span>
          <input
            type='password'
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete='new-password'
            className='border border-[#DADADA] rounded p-2 outline-none'
            required
          />
        </label>

        {error && <p className='text-red-500'>{error}</p>}
        {done && <p className='text-green-600'>{done}</p>}

        <button
          type='submit'
          disabled={busy}
          className='bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded cursor-pointer disabled:cursor-not-allowed self-start'
        >
          {busy ? 'Saving...' : 'Update password'}
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
