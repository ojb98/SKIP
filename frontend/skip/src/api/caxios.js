import axios from "axios";

const host = "http://localhost:8080";

const caxios = axios.create({
    baseURL: host,
    withCredentials: true
});

export const refresh = async () => {
    const res = await axios.post(`${host}/user/refresh`, {}, { withCredentials: true }).then(res => res.data);
    return res;
}

caxios.interceptors.response.use(async res => {
    const config = res.config;
    if (!res.data.success && res.data.error === 'ERROR_ACCESS_TOKEN') {
        const refreshResponse = await refresh();
        if (refreshResponse.success) {
            console.log('연장합니다');
            const data = await axios(config);
            return data;
        }
    }
    return res;
});

export default caxios;