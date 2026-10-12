'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/utils/backend';

// First-run setup: creating the one owner account in an empty database.
//
// This page exists because there is a chicken-and-egg problem. A brand new
// WAIMF database has no account, and every route that creates an account
// requires being signed in. Without this, the panel deploys perfectly and
// nobody can get into it.
//
// It is a PAGE rather than something I run with a command, so the setup token
// and the password Francois chooses never have to travel through a chat
// message. He types them straight into his own site.
//
// The backend does the real guarding: it refuses once any account exists, and
// it refuses unless SETUP_TOKEN matches. This form is just the way in.
export default function SetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/setup`, form);
      setDone(true);
    } catch (err) {
      // The backend's messages are written to be read by a person, so they are
      // shown as-is rather than replaced with something vaguer.
      setError(
        err?.response?.data?.message ||
          'Could not reach the backend. Check the address in this project’s settings.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className='min-h-screen flex items-center justify-center px-6 bg-gray-50'>
        <div className='w-full max-w-md bg-white border border-gray-300 p-8'>
          <h1 className='text-xl font-semibold text-black'>Account created</h1>
          <p className='text-sm text-gray-600 mt-3'>
            You can sign in now. Two things to do afterwards, and tell me when
            they are done:
          </p>
          <ol className='text-sm text-gray-600 mt-3 list-decimal pl-5 space-y-1'>
            <li>Remove SETUP_TOKEN from this project&rsquo;s settings in Vercel.</li>
            <li>Tell me, and I will delete this page entirely.</li>
          </ol>
          <button
            type='button'
            onClick={() => router.replace('/login')}
            className='bg-black text-white px-6 py-2 mt-6'
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-6 bg-gray-50'>
      <form onSubmit={submit} className='w-full max-w-md bg-white border border-gray-300 p-8'>
        <h1 className='text-xl font-semibold text-black'>Set up the WAIMF panel</h1>
        <p className='text-sm text-gray-600 mt-2 mb-6'>
          This creates your account, once. It stops working the moment an
          account exists.
        </p>

        {[
          { key: 'name', label: 'Your name', type: 'text', hint: '' },
          { key: 'email', label: 'Email address', type: 'email', hint: 'This is what you sign in with.' },
          { key: 'password', label: 'Choose a password', type: 'password', hint: 'At least 10 characters.' },
          { key: 'token', label: 'Setup token', type: 'text', hint: 'The SETUP_TOKEN you put in Vercel.' },
        ].map((field) => (
          <label key={field.key} className='block mb-4'>
            <span className='block text-sm font-medium text-black'>{field.label}</span>
            {field.hint && (
              <span className='block text-xs text-gray-500 mt-0.5'>{field.hint}</span>
            )}
            <input
              type={field.type}
              required
              value={form[field.key]}
              onChange={set(field.key)}
              className='border border-black px-3 py-2 mt-1.5 outline-0 w-full'
            />
          </label>
        ))}

        {error && <p className='text-sm text-red-600 mb-4'>{error}</p>}

        <button
          type='submit'
          disabled={busy}
          className='bg-black text-white px-6 py-2 w-full disabled:opacity-50'
        >
          {busy ? 'Creating...' : 'Create my account'}
        </button>
      </form>
    </div>
  );
}
