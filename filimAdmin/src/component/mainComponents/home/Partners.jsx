'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Logos go straight to Cloudinary from the browser (signed by the backend), so the
// hosting request-size limit never applies and the cloud name always comes from
// whatever the backend is actually configured with.
const uploadLogoToCloudinary = async (file) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) throw new Error('Backend URL is not configured');

  const signRes = await fetch(`${backendUrl}/api/cloudinary/sign`, {
    method: 'POST',
  });
  const signJson = await signRes.json();
  if (!signRes.ok || !signJson.success) {
    throw new Error(signJson.message || 'Failed to get upload signature');
  }

  const { signature, timestamp, apiKey } = signJson;
  const cloudName =
    signJson.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error('Cloudinary cloud name missing');

  const data = new FormData();
  data.append('file', file);
  data.append('api_key', apiKey);
  data.append('timestamp', timestamp);
  data.append('signature', signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: 'POST', body: data }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'Upload failed');
  return json.secure_url || json.url;
};

const emptyPartner = { name: '', link: '', logo: '' };

const Partners = () => {
  const [footerId, setFooterId] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer`
        );
        if (data.footer && data.footer.length > 0) {
          const footer = data.footer[0];
          setFooterId(footer._id);
          setPartners(
            Array.isArray(footer.partners)
              ? footer.partners.map((p) => ({
                  name: p.name || '',
                  link: p.link || '',
                  logo: p.logo || '',
                }))
              : []
          );
        }
      } catch (error) {
        toast.error('Error fetching partners');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const updateRow = (index, field, value) => {
    setPartners((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () => setPartners((prev) => [...prev, { ...emptyPartner }]);

  const removeRow = (index) =>
    setPartners((prev) => prev.filter((_, i) => i !== index));

  const moveRow = (index, direction) => {
    const target = index + direction;
    setPartners((prev) => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleLogoChange = async (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setUploadingIndex(index);
    try {
      const url = await uploadLogoToCloudinary(file);
      updateRow(index, 'logo', url);
      toast.success('Logo uploaded');
    } catch (error) {
      toast.error(error.message || 'Logo upload failed');
      console.error(error);
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!footerId) {
      toast.error('Footer not found - save the footer first');
      return;
    }
    const cleaned = partners
      .map((p) => ({
        name: (p.name || '').trim(),
        link: (p.link || '').trim(),
        logo: (p.logo || '').trim(),
      }))
      .filter((p) => p.name || p.logo);

    setSaving(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer/${footerId}/partners`,
        { partners: cleaned }
      );
      setPartners(cleaned);
      toast.success('Partners saved');
    } catch (error) {
      toast.error('Error saving partners');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='p-4 border mt-8'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-xl font-semibold'>Footer Partners</h2>
        <button
          type='button'
          onClick={addRow}
          className='bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-sm'
        >
          + Add Partner
        </button>
      </div>
      <p className='text-sm text-gray-600 mb-4'>
        These show up in the PARTNERS column of the website footer, left of FAQ.
        Each one opens in a new tab. The logo is optional - without one, just the
        name is shown.
      </p>

      {loading && <p className='text-gray-600'>Loading...</p>}

      {!loading && partners.length === 0 && (
        <p className='text-gray-600 mb-4'>
          No partners yet. Click &quot;+ Add Partner&quot; to add the first one.
        </p>
      )}

      <div className='space-y-3'>
        {partners.map((partner, index) => (
          <div
            key={index}
            className='border rounded-sm p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-start'
          >
            <div className='md:col-span-3'>
              <label className='block mb-1 text-sm'>Brand name</label>
              <input
                type='text'
                value={partner.name}
                onChange={(e) => updateRow(index, 'name', e.target.value)}
                className='border p-2 w-full'
                placeholder='e.g. Runway'
              />
            </div>
            <div className='md:col-span-4'>
              <label className='block mb-1 text-sm'>Website link</label>
              <input
                type='text'
                value={partner.link}
                onChange={(e) => updateRow(index, 'link', e.target.value)}
                className='border p-2 w-full'
                placeholder='https://partner-website.com'
              />
            </div>
            <div className='md:col-span-3'>
              <label className='block mb-1 text-sm'>Logo (optional)</label>
              <div className='flex items-center gap-3'>
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name || 'Partner logo'}
                    className='h-10 w-10 object-contain border bg-white'
                  />
                ) : null}
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleLogoChange(index, e)}
                  className='text-sm'
                />
              </div>
              {uploadingIndex === index && (
                <p className='text-sm text-gray-600 mt-1'>Uploading...</p>
              )}
              {partner.logo && (
                <button
                  type='button'
                  onClick={() => updateRow(index, 'logo', '')}
                  className='text-sm text-red-600 mt-1'
                >
                  Remove logo
                </button>
              )}
            </div>
            <div className='md:col-span-2 flex md:justify-end gap-2 md:pt-6'>
              <button
                type='button'
                onClick={() => moveRow(index, -1)}
                disabled={index === 0}
                className='border px-2 py-1 disabled:opacity-40'
                title='Move up'
              >
                &uarr;
              </button>
              <button
                type='button'
                onClick={() => moveRow(index, 1)}
                disabled={index === partners.length - 1}
                className='border px-2 py-1 disabled:opacity-40'
                title='Move down'
              >
                &darr;
              </button>
              <button
                type='button'
                onClick={() => removeRow(index)}
                className='bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded-sm'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-end mt-6'>
        <button
          type='button'
          onClick={handleSave}
          disabled={saving || uploadingIndex !== null}
          className='bg-blue-600 hover:bg-blue-800 text-white px-12 py-2 rounded-sm disabled:opacity-60'
        >
          {saving ? 'Saving...' : 'Save Partners'}
        </button>
      </div>
    </div>
  );
};

export default Partners;
