"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// CSV download helper function
const downloadCSV = (forms) => {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Topic",
    "Message",
    "Date",
    "Time",
  ];

  const rows = forms.map((form) => {
    const date = form.createdAt
      ? new Date(form.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
    const time = form.createdAt
      ? new Date(form.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

    // Agar message mein comma ya quotes hain toh escape karo
    const escapeCSV = (val) => {
      if (!val) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escapeCSV(form.firstName),
      escapeCSV(form.lastName),
      escapeCSV(form.email),
      escapeCSV(form.phone),
      escapeCSV(form.topic),
      escapeCSV(form.message),
      escapeCSV(date),
      escapeCSV(time),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "form_submissions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Form = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteOne = async (id) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/deleteform/${id}`,
      );
      setForms((prev) => prev.filter((f) => f._id !== id)); // UI se hata do
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete form");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("No forms selected");
    if (!confirm(`Delete ${selectedIds.length} selected submission(s)?`))
      return;
    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/deleteforms`,
        { data: { ids: selectedIds } }, // axios DELETE mein body { data: {} } se bhejte hain
      );
      setForms((prev) => prev.filter((f) => !selectedIds.includes(f._id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("Failed to delete selected forms");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const fetchForms = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/getform`,
      );
      setForms(
        [...response.data.forms].sort((a, b) => {
          if (!a.createdAt) return 1; // a ka createdAt nahi → a ko end mein bhejo
          if (!b.createdAt) return -1; // b ka createdAt nahi → b ko end mein bhejo
          return new Date(b.createdAt) - new Date(a.createdAt); // latest pehle
        }),
      );
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="mb-12 mt-24 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-4">
          Form Submissions
        </h1>

        <div className="flex justify-end gap-3 mb-8">
          <button
            onClick={handleDeleteSelected}
            disabled={deleting || selectedIds.length === 0}
            className="bg-red-600 hover:bg-red-800 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition"
          >
            🗑 Delete Selected ({selectedIds.length})
          </button>
          <button
            onClick={() => downloadCSV(forms)}
            className="bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Download CSV
          </button>
        </div>

        <div className="mt-4 grid gap-8 md:gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-lg shadow-lg p-6 transition transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex justify-between items-center mb-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(form._id)}
                  onChange={() => toggleSelect(form._id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <button
                  onClick={() => handleDeleteOne(form._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  🗑 Delete
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">First Name:</span>{" "}
                  {form.firstName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Last Name:</span>{" "}
                  {form.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Topic:</span> {form.topic}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {form.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span>{" "}
                  {form.phone || "N/A"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Message:</span> {form.message}
                </p>

                {/* Date & Time — Yeh pehle se tha, ab correctly show hoga */}
                <div className="border-t pt-2 mt-2">
                  <p className="text-gray-500 text-sm">
                    <span className="font-semibold">Date:</span>{" "}
                    {form.createdAt
                      ? new Date(form.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <span className="font-semibold">Time:</span>{" "}
                    {form.createdAt
                      ? new Date(form.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Form;
