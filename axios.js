import axios from 'axios';

const instance = axios.create({
    // baseURL: 'https://mcmc-backend-1.onrender.com', 
    baseURL: 'http://192.168.1.14:3000',
    timeout: 30000,
    withCredentials: true
});
export default instance;
