import axios from 'axios';

const instance = axios.create({
    // baseURL: 'https://mcmc-backend-1.onrender.com', 
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    withCredentials: true
});
export default instance;
