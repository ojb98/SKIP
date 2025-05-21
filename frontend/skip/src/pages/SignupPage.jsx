import { useRef, useState } from "react";
import SignupStep from "../components/SignupStep";
import { signup } from "../services/userApi";
import CheckMark from "../components/CheckMark";
import { validateConfirmPassword, validateEmail, validatePassword, validateUsername } from "../utils/validation";

const JoinPage = () => {
    const username = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const email = useRef();
    const name = useRef();
    const phone = useRef();

    const [usernameStatus, setUsernameStatus] = useState({});
    const [passwordStatus, setPasswordStatus] = useState({});
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState({});
    const [emailStatus, setEmailStatus] = useState({});

    const inputTextClass = 'h-[50px] w-full rounded border-[1px] border-gray-200 text-sm indent-2 focus-visible:outline-none focus:border-black';


    const signupHandler = e => {
        e.preventDefault();
        signup({
            username: username.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value,
            email: email.current.value,
            name: name.current.value,
            phone: phone.current.value
        }).then(res => {
            alert(res);
        }).catch(e => {
            const data = e.response.data;

            if (data.username) {
                setUsernameStatus({
                    success: false,
                    message: data.username
                });
            }
            if (data.password) {
                setPasswordStatus({
                    success: false,
                    message: data.password
                });
            }
            if (data.confirmPassword) {
                setConfirmPasswordStatus({
                    success: false,
                    message: data.confirmPassword
                });
            }
            if (data.email) {
                setEmailStatus({
                    success: false,
                    message: data.email
                });
            }
        });
    }

    return (
        <>
            <div className="w-[400px]">
                <form className="flex flex-col items-center gap-5" onSubmit={signupHandler}>
                    <div className="w-full flex justify-between border-b-[1px] pb-3">
                        <h1 className="text-2xl">회원가입</h1>

                        <SignupStep step={2}></SignupStep>
                    </div>
                    
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="아이디"
                            ref={username}
                            className={inputTextClass}
                            onKeyUp={() => validateUsername(username.current.value).then(res => setUsernameStatus(res))}
                        ></input>
                        <div className="w-full flex justify-start mt-1">
                            {
                                usernameStatus.success ?
                                <span className="text-xs text-green-400">{usernameStatus.message}</span> :
                                (
                                    typeof usernameStatus.success == 'undefined' ?
                                    <></> :
                                    <span className="text-xs text-red-400">{'※ ' + usernameStatus.message}</span>
                                )
                            }
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-start">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            ref={password}
                            className={inputTextClass}
                            onKeyUp={() => setPasswordStatus(validatePassword(password.current.value))}
                        ></input>
                        <span className={`flex items-center text-xs mt-1 ${passwordStatus.success ? 'text-green-500' : (typeof passwordStatus.success == 'undefined' ? 'text-gray-500' : 'text-red-400')}`}>
                            <CheckMark size={5}></CheckMark> 영문 대소문자, 숫자, 특수문자 중 2가지 조합 8자리 이상
                        </span>
                    </div>

                    <div className="w-full">
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            ref={confirmPassword}
                            className={inputTextClass}
                            onKeyUp={() => setConfirmPasswordStatus(validateConfirmPassword(password.current.value, confirmPassword.current.value))}
                        ></input>
                        <div className="w-full flex justify-start mt-1">
                            <span className="text-xs text-red-400">{confirmPasswordStatus.success === false ? '※ ' + confirmPasswordStatus.message : null}</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="이메일"
                            ref={email}
                            className={inputTextClass}
                            onKeyUp={() => setEmailStatus(validateEmail(email.current.value))}
                        ></input>
                        <div className="w-full flex justify-start mt-1">
                            {
                                emailStatus.success ?
                                <span className="text-xs text-green-400">{emailStatus.message}</span> :
                                    (
                                        typeof emailStatus.success == 'undefined' ?
                                        <></> :
                                        <span className="text-xs text-red-400">{'※ ' + emailStatus.message}</span>
                                    )
                            }
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="이름"
                        ref={name}
                        className={inputTextClass + ' bg-gray-100'}
                    ></input>

                    <input
                        type="text"
                        placeholder="전화번호"
                        ref={phone}
                        className={inputTextClass + ' bg-gray-100'}
                    ></input>

                    <input
                        type="submit"
                        className="h-[50px] w-full rounded border border-blue-400 bg-blue-400 text-sm font-medium text-white hover:bg-blue-500 hover:border-blue-500 cursor-pointer"
                        value="가입하기"
                    ></input>
                </form>
            </div>
        </>
    )
}

export default JoinPage;