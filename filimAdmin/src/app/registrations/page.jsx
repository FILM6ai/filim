"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
// React icons
import { MdEmail } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { HiDownload } from "react-icons/hi";
import { AiOutlineReload } from "react-icons/ai";

const RegistrationsPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Emails fetch karo backend se
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getregistration`,
      );
      if (data.success) {
        setEmails(data.emails);
      } else {
        setError("Failed to load registrations");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // CSV download
  const downloadCSV = () => {
    const csvRows = ["#,Email,Date,Time"];
    emails.forEach((item, index) => {
      const date = new Date(item.createdAt);
      csvRows.push(
        `${index + 1},"${item.email}",${date.toLocaleDateString()},${date.toLocaleTimeString()}`,
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Loading screen
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );

  // Error screen
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="p-8">
      {/* ---- Heading Row ---- */}
      <div className="flex justify-between items-center mb-8">
        {/* Title + total count */}
        <div>
          <h2 className="text-2xl font-bold">Pre-Registrations</h2>
          <p className="text-gray-500 mt-1">
            Total: {emails.length} registrations
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Reload button */}
          <button
            onClick={fetchEmails}
            className="flex items-center gap-2 border border-black py-2 px-4 hover:bg-gray-100 transition-colors"
          >
            <AiOutlineReload />
            Refresh
          </button>

          {/* CSV Download button */}
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors"
          >
            <HiDownload />
            Download CSV
          </button>
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          {/* Table Header */}
          <thead>
            <tr className="bg-black text-white">
              <th className="py-3 px-6 text-left">#</th>

              <th className="py-3 px-6 text-left">
                <div className="flex items-center gap-2">
                  <MdEmail />
                  Email
                </div>
              </th>

              <th className="py-3 px-6 text-left">
                <div className="flex items-center gap-2">
                  <BsCalendarDate />
                  Date
                </div>
              </th>

              <th className="py-3 px-6 text-left">
                <div className="flex items-center gap-2">
                  <BiTime />
                  Time
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {emails.length === 0 ? (
              // Koi registration nahi hai toh yeh dikhao
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-400">
                  No registrations yet
                </td>
              </tr>
            ) : (
              // Har email ki row
              emails.map((item, index) => {
                const date = new Date(item.createdAt);
                return (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {/* Number */}
                    <td className="py-3 px-6 text-gray-500">{index + 1}</td>

                    {/* Email */}
                    <td className="py-3 px-6 font-medium">{item.email}</td>

                    {/* Date */}
                    <td className="py-3 px-6 text-gray-600">
                      {date.toLocaleDateString()}
                    </td>

                    {/* Time */}
                    <td className="py-3 px-6 text-gray-600">
                      {date.toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrationsPage;
