import axios from "axios";
import caxios from "./caxios";

const host = "http://localhost:8080";

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
    const params = new URLSearchParams();
    params.append('email', req);

    return caxios.post(`/user/email/verify`, params).then(res => res.data);
}

export const confirmCode = async req => {
    const params = new URLSearchParams();
    params.append('email', req.email);
    params.append('verificationCode', req.verificationCode);

    const data = await caxios.post(`/user/email/confirm`, params).then(req => req.data);

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

export const changePassword = async req => {
    const data = await caxios.put(`/user/password/change`, req).then(res => {
        return res.data;
    });

    return data;
}

export const setPassword = async req => {
    const data = await caxios.put(`/user/password/set`, req).then(res => {
        return res.data;
    });

    return data;
}

export const deleteAccount = async req => {
    const data = await caxios.delete(`/user/delete`, {
        data: req
    }).then(res => {
        return res.data;
    });

    return data;
};

// export const link = async req => {
//     const params = new URLSearchParams();
//     params.append('client', req);

//     const data = await caxios.post(`/user/social/link`, params).then(res => {

//     });
// }

export const unlink = async () => {
    const data = await caxios.delete(`/user/social/unlink`).then(res => {
        return res.data;
    });

    return data;
};