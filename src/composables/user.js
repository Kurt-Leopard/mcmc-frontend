
import { useAuthStore } from "@/stores/store";
import { decodeJWT } from "@/stores/token";
import instance from "../../axios";
import { getActivePinia } from 'pinia';

let store;
let data = "";

function initializeStore() {
    const pinia = getActivePinia();
    if (!pinia) {
        throw new Error('Pinia instance is not active.');
    }
    store = useAuthStore(pinia);

    if (store.token) {
        data = decodeJWT(store.token);
    }
}

export async function fetchUser() {
    if (!store) {
        initializeStore();
    }

    if (store.token && data && data.id) {
        try {
            instance.defaults.withCredentials = true;
            const response = await instance.get(`/user/${data.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (response.data.success) {
                store.setUser(response.data.user);
            }

        } catch (error) {
    
            document.cookie = `accessToken=; Max-Age=-99999999; path=/;`;
            if(error.response.status===403){

            }else{
                location.reload();
            }
        }
    }
}


export async function accessControl() {
    if (!store) {
        initializeStore();
    }

    if (store.token && data && data.id) {
        try {
            instance.defaults.withCredentials = true;
            const response = await instance.get(`/user/access-control/${data.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (response.data.success) {
                store.setAccessControl(response.data.user);
            }

        } catch (error) {
          
            document.cookie = `accessToken=; Max-Age=-99999999; path=/;`;
            if(error.response.status===403){
                
            }else{
                location.reload();
            }
        }
    }
}



export async function accessRole() {
    if (!store) {
        initializeStore();
    }

    if (store.token  && data && data.id) {
        try {
            instance.defaults.withCredentials = true;
            const response = await instance.get(`/user/access-role/${data.role}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (response.data.success) {
                store.setRole(response.data.user);
            }

        } catch (error) {
            // console.log("Error fetching user:", error);
            // when no server response apply this
            document.cookie = `accessToken=; Max-Age=-99999999; path=/;`;
            if(error.response.status===403){
                
            }else{
                location.reload();
            }
        }
    }
}
