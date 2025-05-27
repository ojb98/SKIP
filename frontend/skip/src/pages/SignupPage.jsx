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

    const [service, setService] = useState(false);
    const [personal, setPersonal] = useState(false);
    const [marketing, setMarketing] = useState(false);

    const [serviceDetails, setServiceDetails] = useState(false);
    const [personalDetails, setPersonalDetails] = useState(false);
    const [marketingDetails, setMarketingDetails] = useState(false);

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

                    <div className="w-full mb-3">
                        <div className="flex flex-col my-3 py-3 border-t border-gray-200">
                            <label className="inline-flex items-start gap-3 py-3">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 size-4"
                                    onChange={e => {
                                        const checked = e.target.checked;
                                        document.getElementById('Option1').checked = checked;
                                        document.getElementById('Option2').checked = checked;
                                        document.getElementById('Option3').checked = checked;
                                        setService(checked);
                                        setPersonal(checked);
                                        setMarketing(checked);
                                    }}
                                >
                                </input>

                                <span className="text-sm font-medium">모두 확인하였으며 동의합니다.</span>
                            </label>

                            <span className="text-xs text-gray-500 px-5">
                                전체 동의에는 필수 및 선택 정보에 대한 동의가 포함되어 있으며, 개별적으로 동의를 선택 하실 수 있습니다. 선택 항목에 대한 동의를 거부하시는 경우에도 서비스 이용이 가능합니다.
                            </span>
                        </div>

                        <fieldset className="border p-5 border-gray-200 rounded">
                            <legend className="sr-only">이용약관</legend>

                            <div className="flow-root">
                                <div className="-my-3 flex flex-col items-start divide-y divide-gray-200">
                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <label htmlFor="Option1" className="inline-flex items-start gap-3 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="mt-0.5 size-4"
                                                    id="Option1"
                                                    onChange={() => setService(!service)}
                                                />

                                                <span className="text-sm font-medium">[필수] 서비스 이용약관</span>
                                            </label>

                                            {
                                                serviceDetails ?
                                                <button type="button" onClick={() => {setServiceDetails(false)}}>
                                                    <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve" className="size-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
                                                </button>

                                                :

                                                <button type="button" onClick={() => {setServiceDetails(true)}}>
                                                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve" transform="rotate(180)" className="size-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
                                                </button>
                                            }
                                        </div>

                                        {
                                            serviceDetails
                                            &&
                                            <span className="text-xs text-gray-500 font-medium">
                                                제1조 (목적)
                                                이 약관은 [스킵] (이하 "회사")이 제공하는 [스킵] (이하 "서비스")의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.<br></br>
                                                제2조 (회원가입 및 이용계약)<br></br>
                                                회원가입은 이용자가 본 약관에 동의하고, 회사가 이를 승인함으로써 성립됩니다.<br></br>
                                                회사는 다음 각 호에 해당하는 경우 가입을 거절할 수 있습니다.<br></br>
                                                타인의 명의로 신청한 경우<br></br>
                                                허위 정보를 기재한 경우<br></br>
                                                기타 사회 질서 및 미풍양속을 해치는 행위가 우려되는 경우<br></br>
                                                제3조 (회원의 의무)<br></br>
                                                회원은 관련 법령 및 회사의 운영 정책을 준수해야 합니다.<br></br>
                                                타인의 정보를 무단으로 도용하거나 서비스를 부정한 목적으로 이용해서는 안 됩니다.<br></br>
                                                제4조 (서비스의 제공 및 중단)<br></br>
                                                회사는 서비스의 안정적인 제공을 위하여 최선을 다하나, 시스템 점검 등으로 인해 일시적으로 서비스가 중단될 수 있습니다.<br></br>
                                            </span>
                                        }
                                    </div>

                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <label htmlFor="Option2" className="inline-flex items-start gap-3 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="mt-0.5 size-4"
                                                    id="Option2"
                                                    onChange={() => setPersonal(!personal)}
                                                />

                                                <span className="text-sm font-medium">[필수] 개인정보 수집 및 이용 동의</span>
                                            </label>

                                            {
                                                personalDetails ?
                                                <button type="button" onClick={() => {setPersonalDetails(false)}}>
                                                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve" className="size-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
                                                </button>

                                                :

                                                <button type="button" onClick={() => {setPersonalDetails(true)}}>
                                                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve" transform="rotate(180)" className="size-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
                                                </button>
                                            }
                                        </div>

                                        {
                                            personalDetails
                                            &&
                                            <span className="text-xs text-gray-500 font-medium">
                                                1. 수집 항목<br></br>
                                                필수: 비밀번호, 이메일, 이름, 휴대폰 번호<br></br>
                                                2. 수집 목적<br></br>
                                                회원 식별 및 관리<br></br>
                                                회원 식별 및 관리<br></br>
                                                회원 식별 및 관리<br></br>
                                                3. 보유 및 이용 기간<br></br>
                                                회원 탈퇴 시까지 보관하며, 이후 즉시 파기합니다. (단, 관련 법령에 따라 보관이 필요한 경우 제외)<br></br>
                                            </span>
                                        }
                                    </div>

                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <label htmlFor="Option3" className="inline-flex items-start gap-3 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="mt-0.5 size-4"
                                                    id="Option3"
                                                    onChange={() => setMarketing(!marketing)}
                                                />

                                                <span className="text-sm font-medium">[선택] 마케팅 정보 수신 동의</span>
                                            </label>

                                            {
                                                marketingDetails ?
                                                <button type="button" onClick={() => {setMarketingDetails(false)}}>
                                                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve" className="size-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
                                                </button>

                                                :

                                                <button type="button" onClick={() => {setMarketingDetails(true)}}>
                                                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve" transform="rotate(180)" className="size-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
                                                </button>
                                            }
                                        </div>

                                        {
                                            marketingDetails
                                            &&
                                            <span className="text-xs text-gray-500 font-medium">
                                                회원에게 이메일, 문자 등을 통해 최신 소식, 이벤트, 할인 정보 등을 제공합니다.<br></br>
                                                ※ 동의를 거부해도 서비스 이용에는 영향이 없습니다.
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {
                        isVerified && service && personal ? 
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