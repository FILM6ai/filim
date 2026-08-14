'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/utils/authClient';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const expired = useSearchParams().get('expired');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      // Checked by the backend against a hashed password. Nothing about the
      // credentials lives in this file, unlike the shared password this
      // replaced.
      const user = await login(email, password);
      router.replace(user.mustChangePassword ? '/account' : '/');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not sign in. Please check your connection and try again.',
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className='min-h-screen flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-blue-500'>Admin</span> Login
        </p>
        {expired && (
          <p className='w-full text-amber-600 bg-amber-50 border border-amber-200 rounded p-2'>
            Your session has ended. Please sign in again.
          </p>
        )}
        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-none'
            type='email'
            placeholder='Enter Email'
            autoComplete='username'
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-none'
            type='password'
            placeholder='Enter Password'
            autoComplete='current-password'
            required
          />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <button
          type='submit'
          disabled={busy}
          className='bg-blue-500 cursor-pointer hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white w-full py-2 rounded-md text-base'
        >
          {busy ? 'Signing in...' : 'Login'}
        </button>
      </div>
    </form>
  );
};

// useSearchParams needs a Suspense boundary to prerender.
const LoginAdmin = () => (
  <Suspense fallback={<div className='min-h-screen' />}>
    <LoginForm />
  </Suspense>
);

export default LoginAdmin;
