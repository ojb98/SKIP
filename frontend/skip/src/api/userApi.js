import axios from "axios";
import customAxios from "./customAxios";

const host = "http://localhost:8080";

export const signup = async req => {
    const data = await customAxios.post(`/user`, req).then(res => {
        return res.data;
    });

    return data;
}

export const isUser = async req => {
    const data = await customAxios.get(`/user/find/${req}`).then(res => {
        return res.data;
    });

    return data;
}

export const login = async req => {
    const data = await customAxios.post(`/user/login`, req).then(res => {
        return res.data;
    });

    return data;
}

export const getProfile = async () => {
    const data = await customAxios.get(`/user/profile`).then(res => {
        return res.data;
    });

    return data;
}