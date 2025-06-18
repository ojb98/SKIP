import axios from "axios";

const host = __APP_BASE__;

// 인증이 필요한 경우 일반 axios 객체 말고 caxios(Custom Axios) 객체 사용해 주세요. (사용법 동일)
// 인증이 필요하지 않다면 일반 axios 사용하시면 됩니다.
const caxios = axios.create({
    baseURL: host,
    withCredentials: true
});

export const refresh = async () => {
    const res = await caxios.post(`${host}/user/refresh`, {}, { withCredentials: true }).then(res => res.data);
    return res;
}

caxios.interceptors.request.use(config => {    
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
        config.headers['X-Device-Id'] = deviceId;
    }

    return config;
});

caxios.interceptors.response.use(async res => {
    const config = res.config;

    if (config.url.includes('/user/refresh')) {
        return res;
    }

    if (!res.data.success && res.data.error === 'ERROR_ACCESS_TOKEN') {
        const refreshResponse = await refresh();
        if (refreshResponse.success) {
            console.log('연장합니다');
            const data = await caxios(config);
            return data;
        } else {
            console.log(refreshResponse.data);
        }
    }
    return res;
});

export default caxios;