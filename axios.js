import axios from 'axios';

const instance = axios.create({
    // baseURL: 'https://wnh5c088-3000.asse.devtunnels.ms', 
    // baseURL: 'http://localhost:3000',
    baseURL: 'http://192.168.1.4:3000',
    timeout: 5000,
    withCredentials: true
});
export default instance;
