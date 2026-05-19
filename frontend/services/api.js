import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-curriculum.vercel.app',
});

export default api;