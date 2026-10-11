'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/backend';
import { getUser } from '@/utils/authClient';

const AccessDenied = () => (
  <div className='p-8 text-gray-500'>
    Only an owner can manage accounts. Ask whoever set up the site to change
    your role if you need access here.
  </div>
);

const TeamPage = () => {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [creating, setCreating] = useState(false);

  // Shown once and then gone: temporary passwords are stored only as a hash,
  // so this is the single opportunity to pass one on.
  const [issued, setIssued] = useState(null);

  useEffect(() => setMe(getUser()), []);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/auth/users`);
      setUsers(data.users || []);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load the accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/auth/users`, {
        name,
        email,
        role,
      });
      setIssued({ email: data.user.email, password: data.temporaryPassword });
      setName('');
      setEmail('');
      setRole('editor');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create the account.');
    } finally {
      setCreating(false);
    }
  };

  const update = async (id, patch) => {
    setError('');
    try {
      await axios.patch(`${BACKEND_URL}/api/auth/users/${id}`, patch);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update the account.');
    }
  };

  const resetPassword = async (user) => {
    if (
      !window.confirm(
        `Give ${user.name} a new temporary password? Their current one stops working immediately.`,
      )
    )
      return;
    setError('');
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/users/${user.id}/reset-password`,
      );
      setIssued({ email: user.email, password: data.temporaryPassword });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not reset the password.');
    }
  };

  const remove = async (user) => {
    if (
      !window.confirm(
        `Delete the account for ${user.name}? Disabling it instead keeps the activity log readable.`,
      )
    )
      return;
    setError('');
    try {
      await axios.delete(`${BACKEND_URL}/api/auth/users/${user.id}`);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete the account.');
    }
  };

  if (me && me.role !== 'owner') return <AccessDenied />;

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-semibold mb-1'>Who can edit the site</h2>
      <p className='text-gray-500 mb-6 text-sm max-w-2xl'>
        Everyone gets their own login. That is what makes the activity log worth
        anything &mdash; with one shared password, every change looks like it
        came from the same person.
      </p>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {issued && (
        <div className='mb-6 p-4 rounded border border-blue-200 bg-blue-50 text-sm'>
          <p className='font-semibold mb-1'>Temporary password for {issued.email}</p>
          <code className='block text-base bg-white border rounded px-3 py-2 my-2 select-all'>
            {issued.password}
          </code>
          <p className='text-gray-600'>
            Send this to them however you normally would. They will be asked to
            choose their own password the first time they sign in, and this one
            stops working then. It cannot be shown again.
          </p>
          <button
            onClick={() => setIssued(null)}
            className='mt-2 text-blue-600 underline cursor-pointer'
          >
            Done
          </button>
        </div>
      )}

      <form
        onSubmit={create}
        className='flex flex-wrap gap-3 items-end mb-8 text-sm'
      >
        <label className='flex flex-col gap-1'>
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border border-[#DADADA] rounded p-2 outline-none'
            required
          />
        </label>
        <label className='flex flex-col gap-1'>
          <span>Email</span>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#DADADA] rounded p-2 outline-none'
            required
          />
        </label>
        <label className='flex flex-col gap-1'>
          <span>Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='border border-[#DADADA] rounded p-2 outline-none'
          >
            <option value='editor'>Editor &mdash; can edit the site</option>
            <option value='owner'>Owner &mdash; can also manage accounts</option>
          </select>
        </label>
        <button
          type='submit'
          disabled={creating}
          className='bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded cursor-pointer'
        >
          {creating ? 'Adding...' : 'Add person'}
        </button>
      </form>

      {loading ? (
        <p className='text-gray-500'>Loading accounts...</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm'>
            <thead>
              <tr className='bg-black text-white text-left'>
                <th className='py-2 px-4 border'>Name</th>
                <th className='py-2 px-4 border'>Email</th>
                <th className='py-2 px-4 border'>Role</th>
                <th className='py-2 px-4 border'>Last signed in</th>
                <th className='py-2 px-4 border'>Status</th>
                <th className='py-2 px-4 border'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = me && user.id === me.id;
                return (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='py-2 px-4 border'>
                      {user.name}
                      {isSelf && <span className='text-gray-400'> (you)</span>}
                    </td>
                    {/* Editable in place: the first account was created with a
                        placeholder address, and being stuck with it would mean
                        deleting and recreating the account to fix a typo. */}
                    <td className='py-2 px-4 border'>
                      <input
                        defaultValue={user.email}
                        type='email'
                        onBlur={(e) => {
                          const next = e.target.value.trim().toLowerCase();
                          if (next && next !== user.email) {
                            update(user.id, { email: next });
                          } else {
                            e.target.value = user.email;
                          }
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                        className='border border-transparent hover:border-gray-300 focus:border-gray-400 rounded p-1 w-full outline-none'
                      />
                    </td>
                    <td className='py-2 px-4 border'>
                      <select
                        value={user.role}
                        disabled={isSelf}
                        onChange={(e) => update(user.id, { role: e.target.value })}
                        className='border rounded p-1 disabled:text-gray-400'
                      >
                        <option value='editor'>Editor</option>
                        <option value='owner'>Owner</option>
                      </select>
                    </td>
                    <td className='py-2 px-4 border'>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : 'Never'}
                    </td>
                    <td className='py-2 px-4 border'>
                      {user.disabled ? (
                        <span className='text-red-600'>Disabled</span>
                      ) : user.mustChangePassword ? (
                        <span className='text-amber-600'>Temporary password</span>
                      ) : (
                        <span className='text-green-600'>Active</span>
                      )}
                    </td>
                    <td className='py-2 px-4 border'>
                      <div className='flex gap-3'>
                        <button
                          onClick={() => resetPassword(user)}
                          className='text-blue-600 underline cursor-pointer'
                        >
                          Reset password
                        </button>
                        {!isSelf && (
                          <>
                            <button
                              onClick={() =>
                                update(user.id, { disabled: !user.disabled })
                              }
                              className='text-amber-700 underline cursor-pointer'
                            >
                              {user.disabled ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              onClick={() => remove(user)}
                              className='text-red-600 underline cursor-pointer'
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
