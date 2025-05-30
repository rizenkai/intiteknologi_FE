// API URL Configuration
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.com' // Ganti dengan URL backend yang sudah di-deploy
  : 'http://localhost:5000';

export default API_URL;
