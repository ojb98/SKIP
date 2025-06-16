import axios from "axios";
import caxios from "./caxios";

export const signup = async req => {
    const data = await caxios.post(`/user/signup`, req).then(res => {
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

export const findUsername = async req => {
    const data = await caxios.get(`/user/find/username`, {
        params: { email: req }
    }).then(res => {
        return res.data;
    });

    return data;
}

export const verifyEmail = async req => {
    const params = new URLSearchParams();
    params.append('email', req);

    return caxios.post(`/user/email/verify`, params).then(res => res.data);
}

export const compareAndVerifyEmail = async req => {
    const params = new URLSearchParams();
    params.append('username', req.username);
    params.append('email', req.email);

    const data = await caxios.post(`/user/email/compare-and-verify`, params).then(res => res.data);

    return data;
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

export const changeImage = async req => {
    const formData = new FormData();
    formData.append('file', req);

    const data = await caxios.put(`/user/image/change`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => {
        return res.data;
    });

    return data;
}

// 닉네임 변경
export const changeNickname = async req => {
    const data = await caxios.put(`/user/nickname/change`, req).then(res => {
        return res.data;
    });

    return data;
}

// 아이디 변경
export const changeUsername = async req => {
    const data = await caxios.put(`/user/username/change`, req).then(res => {
        return res.data;
    });

    return data;
}

// 이메일 변경
export const changeEmail = async req => {
    const data = await caxios.put(`/user/email/change`, req).then(res => {
        return res.data;
    });

    return data;
}

export const changeName = async req => {
    const data = await caxios.put(`/user/name/change`, req).then(res => {
        return res.data;
    });

    return data;
}

export const changePhone = async req => {
    const data = await caxios.put(`/user/phone/change`, req).then(res => {
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

export const resetPassword = async req => {
    const data = await caxios.put(`/user/password/reset`, req).then(res => {
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

export const unlink = async () => {
    const data = await caxios.delete(`/user/social/unlink`).then(res => {
        return res.data;
    });

    return data;
};