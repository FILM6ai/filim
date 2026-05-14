import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdAutoDelete } from 'react-icons/md';

const BlogsGetData = () => {
  const [bloges, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog`
        );
        if (data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        } else {
          console.error('Failed to fetch blogs:', data.message);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Open modal and set blog ID to delete
  const confirmDelete = (id) => {
    setBlogToDelete(id);
    setShowModal(true);
  };

  // Call delete API and update state
  const handleDelete = async () => {
    try {
      // Include the blog ID in the URL parameter
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getdelete/${blogToDelete}`
      );
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== blogToDelete)
      );
    } catch (err) {
      console.error('Error deleting blog:', err);
    } finally {
      setShowModal(false);
      setBlogToDelete(null);
    }
  };

  if (loading) {
    return <div className='text-center text-3xl text-red-600 pb-12'>Loading blogs...</div>;
  }

  return (
    <div className='mt-24 mb-12'>
      {bloges.map((blog) => (
        <div
          key={blog._id}
          className='p-4 border flex flex-wrap items-center justify-between gap-4 mt-8'
        >
          <div className='flex flex-wrap items-start gap-4'>
            <div>
              <img src={blog.image} alt={blog.title} className='w-28' />
            </div>
            <div>
              <h1 className='text-start text-lg font-semibold'>{blog.title}</h1>
              <p>{blog.author}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 flex-wrap'>
            <Link
              href={`/blog/${blog._id}`}
              className='cursor-pointer bg-blue-800 px-2.5 py-2 text-white rounded-sm'
            >
              <FaEdit />
            </Link>
            <span
              onClick={() => confirmDelete(blog._id)}
              className='cursor-pointer bg-red-600 hover:bg-red-700 px-2.5 py-2 text-white rounded-sm'
            >
              <MdAutoDelete />
            </span>
          </div>
        </div>
      ))}

      {/* Tailwind CSS styled modal */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          {/* Overlay */}
          <div className='fixed inset-0 bg-black opacity-50'></div>
          {/* Modal content */}
          <div className='bg-white rounded-lg shadow-lg p-6 z-10 max-w-lg w-full'>
            <h2 className='text-2xl font-bold mb-4'>Confirm Deletion</h2>
            <p className='mb-6 text-gray-700'>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setShowModal(false);
                  setBlogToDelete(null);
                }}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsGetData;
