'use client';
import Sidebar from '@/component/sidebar/Sidebar';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  installAuth,
  getToken,
  getUser,
  fetchMe,
  clearSession,
} from '@/utils/authClient';

// Installed as the module loads rather than from an effect: a page's own data
// fetching runs before its parent's effects do, so waiting would let the first
// requests of every page go out without the signed-in person's token attached.
installAuth();

const Wrapper = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // 'checking' until we know whether the stored token is still good, so the
  // panel never flashes its contents at someone who is about to be sent to the
  // login screen.
  const [status, setStatus] = useState('checking');
  const [user, setUser] = useState(null);

  // Retrieve sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isOpen');
      if (saved !== null) {
        setIsOpen(JSON.parse(saved));
      }
    }
  }, []);

  // Update localStorage when isOpen changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOpen', JSON.stringify(isOpen));
    }
  }, [isOpen]);

  const verify = useCallback(async () => {
    if (!getToken()) {
      clearSession();
      setStatus('out');
      router.replace('/login');
      return;
    }

    // Show what we already know while the check runs, so navigation stays
    // instant instead of blanking on every page change.
    setUser(getUser());
    setStatus('in');

    try {
      const confirmed = await fetchMe();
      setUser(confirmed);
    } catch (error) {
      // A 401 is already handled globally (session cleared, redirect to login).
      // Anything else is the backend being unreachable, which should not throw
      // someone out of a page they are in the middle of editing.
      if (error?.response?.status === 401) setStatus('out');
    }
  }, [router]);

  useEffect(() => {
    if (pathname === '/login') {
      setStatus('out');
      return;
    }
    verify();
  }, [pathname, verify]);

  // Someone who was given a temporary password cannot use the panel until they
  // have chosen their own, so the temporary one stops being a working key.
  useEffect(() => {
    if (user?.mustChangePassword && pathname !== '/account' && pathname !== '/login') {
      router.replace('/account');
    }
  }, [user, pathname, router]);

  // If on the login page, render children without the sidebar.
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (status !== 'in') {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        Loading...
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} user={user} />
      <div
        className={`md:px-8 px-4 transition-width duration-300 ${
          isOpen ? 'ml-56' : 'ml-20'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
