import { defineStore } from "pinia";
import { getCookie } from "../stores/token";
export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: getCookie('accessToken') || sessionStorage.getItem("accessRole"),
        user: '',
        role:'',
        accessControl:'',
        login: false,
        
        toast: []
    }),
    actions: {
        setUser(data) {
            this.user = data;
        },
        getUser() {
            return this.user;
        },
        setRole(data) {
            this.role = data;
        },
        getRole() {
            return this.role;
        },
        setAccessControl(data) {
            this.accessControl = data;
        },
        getAccessControl() {
            return this.accessControl;
        },
        setLogin(data) {
            this.login = data;
        },
        setToken(data) {
            this.token = data;
        },
        getToken() {
            return this.token;
        },
      
        setToastSuccess(data) {
            this.toast.push(data);
        },
        getToastSuccess() {
            return this.toast;
        },
        clearToast() {
            this.toast = [];
        },

    },
});
