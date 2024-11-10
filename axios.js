import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://mcmc-backend-1.onrender.com', 
    // baseURL: 'https://wnh5c088-3000.asse.devtunnels.ms',
    timeout: 5000,
    withCredentials: true
});
export default instance;
