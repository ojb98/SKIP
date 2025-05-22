import axios from "axios";

const caxios = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

export const refresh = async () => {
    const res = await axios.post('http://localhost:8080/user/refresh', {}, { withCredentials: true }).then(res => res.data);
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