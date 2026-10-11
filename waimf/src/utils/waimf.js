// Reading the waimf.org content record.
//
// One fetch shape for every page, so a page component never has to know how
// the API answers. The endpoint returns an array to match the rest of this
// API; callers want the single document.

import axios from 'axios';
import { API_BASE_URL } from './backend';

export const fetchWaimf = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/waimf/getwaimf`);
  return Array.isArray(data?.waimf) ? data.waimf[0] || null : null;
};

export default fetchWaimf;
