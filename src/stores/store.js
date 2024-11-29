import { defineStore } from "pinia";
import { getCookie } from "../stores/token";
export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: getCookie('accessToken') || sessionStorage.getItem("accessRole"),
        user: '',
        role: '',
        accessControl: '',
        login: false,
        triggerMethod: null,
        allocation:null,
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

        setMethod(data) {
            this.triggerMethod = data;
        },
        getMethod() {
            return this.triggerMethod;  // Return the stored function
        },
        setAllocation(data) {
            this.allocation = data;
        },
        getAllocation() {
            return this.allocation;  // Return the stored function
        },
        setShowmenuAdmin(data) {
            this.showmenuAdmin = data;
        },
        getShowmenuAdmin() {
            return this.showmenuAdmin;  // Return the stored function
        },


    },
});
