
import axios from 'axios'
import { BASE_URL, REFRESH_TOKEN } from './API'
import { token_storage } from '@store/storage';
import Toast from 'react-native-toast-message'
import { ToastAndroid } from 'react-native';

export const appAxios = axios.create({
    baseURL : BASE_URL,
});

export const socketAxios = axios.create({
    baseURL : BASE_URL
});

//request interceptors
appAxios.interceptors.request.use(async (config) => {
    const app_access_token = token_storage.getString('app_access_token');
    if(app_access_token){
        config.headers.Authorization = `Bearer ${app_access_token}`
    }
    return config;
});

socketAxios.interceptors.request.use(async (config) => {
    const socket_access_token = token_storage.getString('socket_access_token');
    if(socket_access_token){
        config.headers.Authorization = `Bearer ${socket_access_token}`
    }
    return config;
});

//response interceptors
appAxios.interceptors.response.use(
    response => response,
    async error => {
        if(error.response && error.response.status === 401){
            try {
                const newAccessToken = await refresh_token('app');
                if(newAccessToken){
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.log('Error refreshing token.');
            }
        }

        if(error.response && error.response.status != 401){
            const errorMessage = error.response.data.message || "Something went wrong!";
            ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
        }
        return Promise.resolve(error);
    }
)

socketAxios.interceptors.response.use(
    response => response,
    async error => {
        if(error.response && error.response.status === 401){
            try {
                const newAccessToken = await refresh_token('socket');
                if(newAccessToken){
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.log('Error refreshing token.');
            }
        }

        if(error.response && error.response.status != 401){
            const errorMessage = error.response.data.message || "Something went wrong!";
            ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
        }
        return Promise.resolve(error);
    }
)

export const refresh_token = async (
    type : string,
    stop ?: boolean,
    updateHook ?: () => void
) => {
    try {
        const refresh_token = token_storage.getString(`${type}_refresh_token`);

        const res = await axios.post(REFRESH_TOKEN,{
            type,
            refresh_token
        });

        const new_access_token = res.data.access_token;
        const new_refresh_token = res.data.refresh_token;

        token_storage.set(`${type}_access_token`,new_access_token);
        token_storage.set(`${type}_refresh_token`,new_refresh_token);

        if(type != "app" && updateHook){
            updateHook();
        }

        return new_access_token;

    } catch (error) {
        console.log("Refresh Token Expired");
        Toast.show({
            type : 'warningToast',
            props : {
                msg : "Due to some technical issue your session expired, login again."
            }
        })
    }
}