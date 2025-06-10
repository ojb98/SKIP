import { replace, useLocation, useNavigate } from "react-router-dom";
import IdPasswordFindTab from "../../components/login/IdPasswordFindTab";
import { inputText } from "../../components/inputs";
import { button } from "../../components/buttons";
import { useEffect, useRef, useState } from "react";
import { compareAndVerifyEmail, confirmCode, resetPassword } from "../../api/userApi";
import { Ban } from "lucide-react";

const PasswordResettingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    if (!location.state) {
        navigate('/password/reset/id', { replace: true });
    }

    const { username } = location.state;
    const email = useRef();
    const code = useRef();
    const newPassword = useRef();
    const confirmNewPassword = useRef();
    
    const [emailStatus, setEmailStatus] = useState('initial'); // initial, sending, sent, verified
    const [sentEmail, setSentEmail] = useState();

    const [emailErrors, setEmailErrors] = useState([]);
    const [codeError, setCodeError] = useState();
    const [newPasswordErrors, setNewPasswordErrors] = useState([]);
    const [confirmNewPasswordErrors, setConfirmNewPasswordErrors] = useState([]);

    useEffect(() => {
        if (emailStatus == 'sent') {
            setEmailErrors([]);
        } else if (emailStatus == 'verified') {
            setEmailErrors([]);
            setCodeError();
        }
    }, [emailStatus]);


    const verifyHandler = () => {
        setEmailStatus('sending');

        compareAndVerifyEmail({
            username: username,
            email: email.current.value
        }).then(res => {
            if (res.success) {
                setEmailStatus('sent');
                setSentEmail(res.data);
            } else {
                setEmailStatus('initial');
                setEmailErrors(res.data);
            }
        });
    };

    const confirmHandler = () => {
        confirmCode({
            email: sentEmail,
            verificationCode: code.current.value
        }).then(res => {
            if (res.success) {
                email.current.value = res.data;
                setEmailStatus('verified');
            } else {
                setCodeError(res.data);
            }
        });
    };

    const changeHandler = () => {
        resetPassword({
            username: username,
            newPassword: newPassword.current.value,
            confirmNewPassword: confirmNewPassword.current.value
        }).then(res => {
            if (res.success) {
                navigate('/password/reset/success');
            } else {
                setNewPasswordErrors(res.data.newPasswordErrors);
                setConfirmNewPasswordErrors(res.data.confirmNewPasswordErrors);
            }
        });
    };

    return (
        <>
            <div className="min-h-100 space-y-10">
                <IdPasswordFindTab active={'pwd'}></IdPasswordFindTab>

                <div className="flex flex-col gap-5">
                    <input
                        value={username}
                        disabled
                        className={inputText({ color: "disabled", className: 'w-full h-[50px]' })}
                    ></input>

                    <div>
                        <input
                            placeholder="이메일"
                            ref={email}
                            disabled={emailStatus == 'verified' ? true : false}
                            className={inputText({ className: 'w-full h-[50px]' })}
                        ></input>

                        {
                            emailErrors.map((err, index) => {
                                return (
                                    <p key={index} className="flex items-center gap-1 my-1 text-xs text-red-400"><Ban width={12} height={12}></Ban>{err}</p>
                                )
                            })
                        }
                    </div>

                    {
                        emailStatus == 'sent'
                        &&
                        <div>
                            <input
                                placeholder="인증번호"
                                ref={code}
                                className={inputText({ className: 'w-full h-[50px]' })}
                            ></input>

                            {
                                codeError
                                &&
                                <p className="flex items-center gap-1 my-1 text-xs text-red-400"><Ban width={12} height={12}></Ban>{codeError}</p>
                            }
                        </div>
                    }

                    {
                        emailStatus == 'verified'
                        &&
                        <>
                            <div>
                                <input
                                    type="password"
                                    placeholder="새 비밀번호"
                                    ref={newPassword}
                                    className={inputText({ className: 'w-full h-[50px]' })}
                                ></input>

                                {
                                    newPasswordErrors.map((err, index) => {
                                        return (
                                            <p key={index} className="flex items-center gap-1 my-1 text-xs text-red-400"><Ban width={12} height={12}></Ban>{err}</p>
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="새 비밀번호 확인"
                                    ref={confirmNewPassword}
                                    className={inputText({ className: 'w-full h-[50px]' })}
                                ></input>

                                {
                                    confirmNewPasswordErrors.map((err, index) => {
                                        return (
                                            <p key={index} className="flex items-center gap-1 my-1 text-xs text-red-400"><Ban width={12} height={12}></Ban>{err}</p>
                                        )
                                    })
                                }
                            </div>
                        </>
                    }
                </div>

                {
                    emailStatus == 'initial'
                    &&
                    <button
                        onClick={verifyHandler}
                        className={button({ color: "primary", className: 'w-full h-[50px]' })}
                    >인증하기</button>
                    ||
                    emailStatus == 'sending'
                    &&
                    <button
                        onClick={verifyHandler}
                        className={button({ color: "primary-not-interactive", className: 'w-full h-[50px] flex justify-center items-center cursor-default' })}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" fill="#FFFFFF" opacity=".30"/>
                            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="#FFFFFF" className="spinner_ajPY"/>
                        </svg>
                    </button>
                    ||
                    emailStatus == 'sent'
                    &&
                    <button
                        onClick={confirmHandler}
                        className={button({ color: "primary", className: 'w-full h-[50px]' })}
                    >확인하기</button>
                    ||
                    emailStatus == 'verified'
                    &&
                    <button
                        onClick={changeHandler}
                        className={button({ color: "primary", className: 'w-full h-[50px]' })}
                    >변경하기</button>
                }
            </div>
        </>
    )
};

export default PasswordResettingPage;