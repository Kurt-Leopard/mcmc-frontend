import axios from 'axios';

const instance = axios.create({
    // baseURL: 'https://mcmc-backend-1.onrender.com', 
    baseURL: 'http://192.168.1.8:3000',
    // baseURL:'https://wnh5c088-3000.asse.devtunnels.ms',
    timeout: 30000,
    withCredentials: true
});
export default instance;
