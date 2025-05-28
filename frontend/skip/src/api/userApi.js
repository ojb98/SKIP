import axios from "axios";
import caxios from "./caxios";

const host = "http://192.168.80.14:8080";

export const signup = async req => {
    const data = await caxios.post(`/user`, req).then(res => {
        return res.data;
    });

    return data;
}

export const isUser = async req => {
    const data = await caxios.get(`/user/find/${req}`).then(res => {
        return res.data;
    });

    return data;
}

export const verifyEmail = async req => {
    return caxios.post(`/user/email/verify`, req).then(res => res.data);
}

export const confirmCode = async req => {
    const data = await caxios.post(`/user/email/confirm`, req).then(req => req.data);

    return data;
}

export const login = async req => {
    const data = await caxios.post(`/user/login`, req).then(res => {
        return res.data;
    });

    return data;
}

export const socialLogin = async req => {
    const data = await caxios.get(`/user/login/${req}`).then(res=> res.data);

    return data;
}

export const logout = async req => {
    const data = await caxios.post(`/user/logout`, req).then(res => {
        return res.data;
    });

    return data;
}

export const getProfile = async () => {
    const data = await caxios.get(`/user/profile`).then(res => {
        return res.data;
    });

    return data;
}