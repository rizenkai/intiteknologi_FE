// API URL Configuration
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://intiteknologibe-production.up.railway.app' // URL backend di Railway
  : 'http://localhost:5000';

export default API_URL;
