import { isUser } from "../api/userApi";

export const validateUsername = async username => {
    const usernameRegex = /^[a-zA-Z0-9]{5,}$/;

    if (username.length === 0) {
        return {
            success: false,
            message: '아이디를 입력해주세요.'
        };
    }

    if (!usernameRegex.test(username)) {
        return {
            success: false,
            message: '5자 이상의 영문 또는 숫자로 입력해주세요.'
        };
    }

    return await isUser(username).then(res => {
        if (res) {
            return {
                success: false,
                message: '이미 가입된 아이디입니다.'
            };
        } else {
            return {
                success: true,
                message: '사용 가능한 아이디입니다.'
            };
        }
    });

    return '';
}

export const validatePassword = password => {
    const passwordRegex = /^(?=((?:.*[a-z])(?:.*[A-Z])|(?:.*[a-z])(?:.*\d)|(?:.*[a-z])(?:.*[^a-zA-Z0-9])|(?:.*[A-Z])(?:.*[a-z])|(?:.*[A-Z])(?:.*\d)|(?:.*[A-Z])(?:.*[^a-zA-Z0-9])|(?:.*\d)(?:.*[a-z])|(?:.*\d)(?:.*[A-Z])|(?:.*\d)(?:.*[^a-zA-Z0-9])|(?:.*[^a-zA-Z0-9])(?:.*[a-z])|(?:.*[^a-zA-Z0-9])(?:.*[A-Z])|(?:.*[^a-zA-Z0-9])(?:.*\d)))[a-zA-Z0-9!@#$%^&*()_+=-]{8,}$/;

    if (password.length === 0) {
        return {
            success: false,
            message: '비밀번호를 입력해주세요.'
        };
    }

    if (!passwordRegex.test(password)) {
        return {
            success: false,
            message: '영문 대소문자, 숫자, 특수문자 중 2가지 조합 8자리 이상으로 작성해주세요.'
        };
    }

    return {
        success: true,
        message: ''
    };
}

export const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword ? { success: true, message: '' } : { success: false, message: '비밀번호가 일치하지 않습니다.' };
}

export const validateEmail = email => {
    const emailRegex = /^[\w!#$%&’*+/=?`{|}~^-]+(?:\.[\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,10}$/;

    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: '이메일 형식이 올바르지 않습니다.'
        };
    }

    return {
        success: true,
        message: '사용 가능한 이메일입니다.'
    };
}