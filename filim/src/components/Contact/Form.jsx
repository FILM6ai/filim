"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";

const MAX_CHARS = 1000;

const Form = () => {
  // Initialize form state with default values.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });

  // Handle input changes for all form fields.
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "message" && value.length > MAX_CHARS) return;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Destructure required fields.
    const { firstName, lastName, email, topic, message } = formData;
    if (!firstName || !lastName || !email || !topic || !message) {
      toast.error("Please fill all the required fields.");
      return;
    }

    if (message.length > MAX_CHARS) {
      toast.error(`Message cannot exceed ${MAX_CHARS} characters.`);
      return;
    }
    try {
      // 1. Backend mein save karo (database ke liye)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/form/formRoute`,
        formData,
      );

      if (data.success === true) {
        // 2. EmailJS se client ko email bhejo
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || "N/A",
            topic: formData.topic,
            message: formData.message,
            to_email: "contact@film6.ai ",
            submitted_at: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Karachi",
              dateStyle: "full",
              timeStyle: "short",
            }),
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        );

        toast.success("Message Sent successfully.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          topic: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#DFEBF6] flex items-center justify-center mt-12 py-8 px-4">
      <div className="w-full max-w-6xl p-6 md:p-8">
        <form className="relative z-auto" onSubmit={handleSubmit}>
          {/* First and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Email and Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <input
                type="text"
                id="phone"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Select Topic */}
          <div className="w-full mt-4">
            <div>
              <select
                id="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">-- Select a topic --</option>
                <option value="general">general</option>
                <option value="inquiries">inquiries</option>
                <option value="partnership">partnership</option>
                <option value="press">press</option>
                <option value="production">production</option>
                <option value="submission">submission</option>
                <option value="support">support</option>
                <option value="token">token</option>
              </select>
            </div>
          </div>

          {/* Message */}
          {/* PURANA div hatao, YE NAYA likho: */}
          <div className="mt-4">
            <textarea
              id="message"
              rows="5"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleChange}
              maxLength={MAX_CHARS}
              className="w-full rounded-md border border-gray-300 px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                Max {MAX_CHARS} characters
              </span>
              <span
                className={`text-xs font-medium ${
                  formData.message.length > MAX_CHARS * 0.9
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {formData.message.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 md:mt-10 flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-8 py-2 shadow hover:bg-blue-900 transition"
            >
              Submit Now
            </button>
          </div>
        </form>
      </div>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Form;
