import axios from "axios";

const host = "http://localhost:8080";

export const signup = async req => {
    const data = await axios.post(`${host}/user`, req).then(res => {
        return res.data;
    });

    return data;
}

export const isUser = async req => {
    const data = await axios.get(`${host}/user/find/${req}`).then(res => {
        return res.data;
    });

    return data;
}