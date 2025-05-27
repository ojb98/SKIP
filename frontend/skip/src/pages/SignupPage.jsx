import { useRef, useState } from "react";
import SignupStep from "../components/SignupStep";
import { confirmCode, signup, verifyEmail } from "../api/userApi";
import CheckMark from "../components/CheckMark";
import { validateConfirmPassword, validateEmail, validatePassword, validateUsername, validateVerificationCode } from "../utils/validation";
import { faL } from "@fortawesome/free-solid-svg-icons";
import EmailTimer from "../components/EmailTimer";

const JoinPage = () => {
    const username = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const email = useRef();
    const verificationCode = useRef();
    const [lastEmail, setLastEmail] = useState();
    const name = useRef();
    const phone = useRef();

    const [usernameStatus, setUsernameStatus] = useState({});
    const [passwordStatus, setPasswordStatus] = useState({});
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState({});
    const [emailStatus, setEmailStatus] = useState({});
    const [timer, setTimer] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verificationCodeStatus, setVerificationCodeStatus] = useState({});

    const [verify1, setVerify1] = useState('');
    const [verify2, setVerify2] = useState('hidden');
    const [verify3, setVerify3] = useState('hidden');
    const [verify4, setVerify4] = useState('hidden');

    const [confirm, setConfirm] = useState('hidden');

    const inputTextClass = ' h-[50px] w-full rounded border-[1px] border-gray-200 text-sm indent-2 focus-visible:outline-none focus:border-black ';


    const verifyHandler = () => {
        setEmailStatus(validateEmail(email.current.value));
        if (emailStatus.success) {
            setVisible(setVerify2);
            const params = new URLSearchParams();
            params.append('email', email.current.value);
            verifyEmail(params).then(res => {
                if (res.success) {
                    setVisible(setVerify3);
                    setConfirm('');
                    setLastEmail(res.data);
                    setTimer(true);
                } else {
                    setEmailStatus({
                        success: false,
                        message: res.data
                    });
                }
            });
        } else {
            email.current.focus();
        }
    }

    const setVisible = set => {
        setVerify1('hidden');
        setVerify2('hidden');
        setVerify3('hidden');
        setVerify4('hidden');
        set('');
    }

    const confirmHandler = () => {
        setVerificationCodeStatus(validateVerificationCode(verificationCode.current.value));
        if (verificationCodeStatus.success) {
            const params = new URLSearchParams();
            params.append('email', lastEmail);
            params.append('verificationCode', verificationCode.current.value);
            confirmCode(params).then(res => {
                if (res.success) {
                    // 이메일 인증 성공
                    setConfirm('hidden');

                    setVisible(setVerify4);

                    setEmailStatus({
                        success: true,
                        message: '인증되었습니다.'
                    });

                    setIsVerified(true);

                    email.current.disabled = true;
                    email.current.className += 'bg-gray-100';
                } else {
                    setVerificationCodeStatus({
                        success: false,
                        message: res.data
                    });
                }
            });
        } else {
            verificationCode.current.focus();
        }
    }

    const signupHandler = e => {
        e.preventDefault();
        signup({
            username: username.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value,
            email: email.current.value,
            isVerified: isVerified,
            name: name.current.value,
            phone: phone.current.value
        }).then(res => {
            alert(res);
        }).catch(ex => {
            const data = ex.response.data;

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
                    <div className="w-full flex justify-between mb-5 border-b">
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
                        <div className="w-full flex justify-start">
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

                        <div className="w-full flex justify-start">
                            <span className="text-xs text-red-400">{confirmPasswordStatus.success === false ? '※ ' + confirmPasswordStatus.message : null}</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="w-full flex gap-1">
                            <input
                                type="text"
                                placeholder="이메일"
                                ref={email}
                                className={inputTextClass}
                                onKeyUp={() => setEmailStatus(validateEmail(email.current.value))}
                            ></input>

                            {/* 인증번호 전송 */}
                            <button
                                type="button"
                                className={`w-[90px] h-[50px] rounded bg-blue-400 text-sm font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer ${verify1}`}
                                onClick={verifyHandler}
                            >
                                인증
                            </button>

                            {/* 인증번호 전송중 */}
                            <button
                                type="button"
                                className={`w-[90px] h-[50px] flex justify-center items-center rounded bg-blue-400 text-sm font-medium text-white ${verify2}`}
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

                            {/* 인증번호 재전송 */}
                            <button
                                type="button"
                                className={`w-[90px] h-[50px] rounded bg-blue-400 text-sm font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer ${verify3}`}
                                onClick={verifyHandler}
                            >
                                재전송
                            </button>

                            {/* 인증번호 전송 비활성화 */}
                            <button
                                type="button"
                                className={`w-[90px] h-[50px] rounded bg-gray-400/60 text-sm font-[NanumSquareNeo] font-medium text-white ${verify4}`}
                            >
                                인증
                            </button>
                        </div>

                        <div className="w-full flex justify-start">
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

                    <div className={`w-full ${confirm}`}>
                        <div className="w-full flex gap-1">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="인증번호 6자리"
                                    ref={verificationCode}
                                    onKeyUp={() => setVerificationCodeStatus(validateVerificationCode(verificationCode.current.value))}
                                    className={inputTextClass}
                                ></input>

                                {
                                    timer &&
                                    <span className="absolute inset-y-0 right-3 grid w-8 place-content-center text-red-400 text-xs">
                                        <EmailTimer></EmailTimer>
                                    </span>
                                }
                            </div>

                            {/* 인증번호 확인 */}
                            <button
                                type="button"
                                className={`w-[90px] h-[50px] rounded bg-blue-400 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer`}
                                onClick={confirmHandler}
                            >
                                확인
                            </button>
                        </div>

                        <div className="w-full flex justify-start">
                            {
                                !verificationCodeStatus.success ?
                                <span className="text-xs text-red-400">{verificationCodeStatus.message}</span> :
                                <></>
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

                    <div>
                        <fieldset>
                            <legend className="sr-only">Checkboxes</legend>

                            <div className="flow-root">
                                <div className="-my-3 flex flex-col items-start divide-y divide-gray-200">
                                    <label htmlFor="Option1" className="inline-flex items-start gap-3 py-3">
                                        <input
                                            type="checkbox"
                                            className="my-0.5 size-3 rounded border-gray-300 shadow-sm"
                                            id="Option1"
                                        />

                                        <div>
                                            <span className="font-medium text-gray-700"> Option 1 </span>

                                            <p className="mt-0.5 text-sm text-gray-700">
                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, distinctio.
                                            </p>
                                        </div>
                                    </label>

                                    <label htmlFor="Option2" className="inline-flex items-start gap-3 py-3">
                                        <input
                                            type="checkbox"
                                            className="my-0.5 size-5 rounded border-gray-300 shadow-sm"
                                            id="Option2"
                                        />

                                        <div>
                                            <span className="font-medium text-gray-700"> Option 2 </span>

                                            <p className="mt-0.5 text-sm text-gray-700">
                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, distinctio.
                                            </p>
                                        </div>
                                    </label>

                                    <label htmlFor="Option3" className="inline-flex items-start gap-3 py-3">
                                        <input
                                            type="checkbox"
                                            className="my-0.5 size-5 rounded border-gray-300 shadow-sm"
                                            id="Option3"
                                        />

                                        <div>
                                            <span className="font-medium text-gray-700"> Option 3 </span>

                                            <p className="mt-0.5 text-sm text-gray-700">
                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, distinctio.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {
                        isVerified ? 
                        // 가입버튼
                        <input
                            type="submit"
                            className="h-[50px] w-full rounded bg-blue-400 font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer"
                            value="가입하기"
                        ></input>

                        :

                        // 비활성화
                        <input
                            type="button"
                            className="h-[50px] w-full rounded bg-gray-400/60 font-[NanumSquareNeo] font-medium text-white"
                            value="가입하기"
                        ></input>
                    }
                </form>
            </div>
        </>
    )
}

export default JoinPage;