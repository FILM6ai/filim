'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Email = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getemail`
        );

        if (data.success) {
          setEmails(data.emails);
        } else {
          setError('Failed to load emails');
        }
      } catch (err) {
        setError('Something went wrong while fetching emails');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const downloadCSV = () => {
    // Create CSV header row
    const csvRows = ['Index,Email,Date,Time'];

    // Add rows for each email
    emails.forEach((email, index) => {
      const date = new Date(email.createdAt);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();

      // Wrap email in quotes in case it contains commas
      csvRows.push(`${index + 1},"${email.email}",${dateStr},${timeStr}`);
    });

    const csvString = csvRows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.csv';
    a.click();

    // Cleanup the URL object
    window.URL.revokeObjectURL(url);
  };

  if (loading)
    return <p className='text-center text-gray-500'>Loading emails...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-semibold mb-4'>Subscribed Emails</h2>
      <button
        onClick={downloadCSV}
        className=' cursor-pointer mb-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
      >
        Download CSV
      </button>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <thead>
            <tr className='bg-black text-white'>
              <th className='py-2 px-4 border'>#</th>
              <th className='py-2 px-4 border'>Email</th>
              <th className='py-2 px-4 border'>Date</th>
              <th className='py-2 px-4 border'>Time</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, index) => {
              const date = new Date(email.createdAt);
              return (
                <tr key={email._id} className='text-center hover:bg-gray-50'>
                  <td className='py-2 px-4 border'>{index + 1}</td>
                  <td className='py-2 px-4 border'>{email.email}</td>
                  <td className='py-2 px-4 border'>
                    {date.toLocaleDateString()}
                  </td>
                  <td className='py-2 px-4 border'>
                    {date.toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Email;
