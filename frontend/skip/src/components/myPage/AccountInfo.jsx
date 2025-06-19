import { useDispatch, useSelector } from "react-redux";
import { button } from "../buttons";
import MyContainer from "./MyContainer";
import { useEffect, useRef, useState } from "react";
import { inputText } from "../inputs";
import { LoaderCircle, MailCheck, Pencil, Save, Send, SendHorizonal, Undo2, X } from "lucide-react";
import { changeEmail, changeImage, changeName, changeNickname, changePhone, changeUsername, confirmCode, verifyEmail } from "../../api/userApi";
import { setProfile } from "../../slices/loginSlice";
import EmailTimer from "../EmailTimer";
import { addHyphen } from "../../utils/validation";

const AccountInfo = () => {
    const profile = useSelector(state => state.loginSlice);

    const image = useRef();
    const file = useRef();
    const nickname = useRef();
    const username = useRef();
    const email = useRef();
    const code = useRef();
    const name = useRef();
    const phone = useRef();

    const [fileHasChanagedKey, setFileHasChanagedKey] = useState(0);
    const [previewUrl, setPreviewUrl] = useState();
    const [nicknameFormDisabled, setNicknameFormDisabled] = useState(true);
    const [usernameFormDisabled, setUsernameFormDisabled] = useState(true);
    const [emailFormDisabled, setEmailFormDisabled] = useState(true);
    const [emailStatus, setEmailStatus] = useState('initial'); // initial, sending, sent, verified
    const [sentEmail, setSentEmail] = useState('');
    const [codeVisible, setCodeVisible] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const [nameFormDisabled, setNameFormDisabled] = useState(true);
    const [phoneFormDisabled, setPhoneFormDisabled] = useState(true);

    const [nicknameErrors, setNicknameErrors] = useState([]);
    const [usernameErrors, setUsernameErrors] = useState([]);
    const [emailError, setEmailError] = useState();
    const [codeError, setCodeError] = useState();
    const [nameErrors, setNameErrors] = useState([]);
    const [phoneErrors, setPhoneErrors] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (fileHasChanagedKey == 0) {
            image.current.src = profile.image;
        } else {
            image.current.src = previewUrl;
        }
    }, [fileHasChanagedKey]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl]);

    useEffect(() => {
        if (!nicknameFormDisabled) {
            nickname.current?.focus();
        }
    }, [nicknameFormDisabled]);

    useEffect(() => {
        if (!usernameFormDisabled) {
            username.current?.focus();
        } else {
            username.current.value = (profile.social != 'NONE' && !profile.linkage.usernameSet) ? '' : profile.username;
            setUsernameErrors([]);
        }
    }, [usernameFormDisabled]);

    useEffect(() => {
        if (!emailFormDisabled) {
            email.current?.focus();
        } else {
            email.current.value = profile.email;
            setEmailStatus('initial');
            setEmailError();
            setCodeVisible(false);
        }
    }, [emailFormDisabled]);

    useEffect(() => {
        if (codeVisible) {
            code.current?.focus();
        } else {
            setTimerKey(0);
            setCodeError();
        }
    }, [codeVisible]);

    useEffect(() => {
        if (!nameFormDisabled) {
            name.current?.focus();
        } else {
            name.current.value = profile.name;
            setNameErrors([]);
        }
    }, [nameFormDisabled]);

    useEffect(() => {
        if (!phoneFormDisabled) {
            phone.current?.focus();
        } else {
            phone.current.value = profile.phone;
            setPhoneErrors([]);
        }
    }, [phoneFormDisabled]);

    useEffect(() => {
        nickname.current.value = profile.nickname;
        username.current.value = profile.username;
        email.current.value = profile.email;
        name.current.value = profile.name;
        phone.current.value = profile.phone;
    }, [profile]);


    const fileChangeHandler = e => {
        setFileHasChanagedKey(prev => prev + 1);
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    }

    const imageSaveHandler = () => {
        changeImage(file.current?.files?.[0]).then(res => {
            if (res.success) {
                dispatch(setProfile());
                setFileHasChanagedKey(0);
            }
        });
    };

    const nicknameSaveHandler = () => {
        changeNickname({
            nickname: nickname.current.value
        }).then(res => {
            if (res.success) {
                dispatch(setProfile());
                setNicknameErrors([]);
                setNicknameFormDisabled(true);
            } else {
                setNicknameErrors(res.data);
            }
        });
    };

    const usernameSaveHandler = () => {
        changeUsername({
            username: username.current.value
        }).then(res => {
            if (res.success) {
                dispatch(setProfile());
                setUsernameErrors([]);
                setUsernameFormDisabled(true);
            } else {
                setUsernameErrors(res.data);
            }
        })
    };

    const emailSendHandler = () => {
        setEmailStatus('sending');
        setCodeVisible(true);

        verifyEmail(email.current.value).then(res => {
            if (res.success) {
                setTimerKey(prev => prev + 1);
                setEmailError();
                setEmailStatus('sent');
                setSentEmail(res.data);
            } else {
                setEmailError(res.data);
            }
        });
    };

    const codeConfirmHandler = () => {
        confirmCode({
            email: sentEmail,
            verificationCode: code.current.value
        }).then(res => {
            if (res.success) {
                email.current.value = sentEmail;
                setCodeVisible(false);
                setEmailStatus('verified');
            } else {
                setCodeError(res.data);
            }
        });
    };

    const emailSaveHandler = () => {
        changeEmail({
            email: email.current.value,
            isVerified: emailStatus == 'verified' ? true : false
        }).then(res => {
            if (res.success) {
                dispatch(setProfile());
                setEmailFormDisabled(true);
            } else {
                setEmailError(res.data);
            }
        });
    };

    const nameSaveHandler = () => {
        changeName({
            name: name.current.value
        }).then(res => {
            if (res.success) {
                dispatch(setProfile());
                setNameFormDisabled(true);
            } else {
                setNameErrors(res.data);
            }
        });
    };

    const phoneSaveHandler = () => {
        changePhone({
            phone: phone.current.value
        }).then(res => {
            if (res.success) {
                console.log(res);
                dispatch(setProfile());
                setPhoneFormDisabled(true);
            } else {
                setPhoneErrors(res.data);
            }
        });
    };

    return (
        <>
            <MyContainer
                title="기본 정보"
            >
                <>
                    <div className="flex flex-col items-center gap-10 my-10">
                        <div className="flex flex-col items-center gap-3 mb-7">
                            <div className="relative">
                                <img ref={image} src={profile.image} className="w-[160px] h-[160px] rounded-full"></img>

                                {
                                    fileHasChanagedKey != 0
                                    &&
                                    <button
                                        onClick={() => setFileHasChanagedKey(0)}
                                        className="w-8 h-8 flex justify-center items-center bg-black rounded-full absolute -left-4 bottom-16 cursor-pointer"
                                    >
                                        <Undo2 stroke="white"></Undo2>
                                    </button>
                                }

                                <button
                                    onClick={() => file.current?.click()}
                                    className="w-8 h-8 flex justify-center items-center bg-black rounded-full absolute left-16 -bottom-4 cursor-pointer"
                                >
                                    <input
                                        type="file"
                                        ref={file}
                                        onChange={fileChangeHandler}
                                        className="hidden"></input>
                                    <Pencil width={20} fill="white"></Pencil>
                                </button>

                                {
                                    fileHasChanagedKey != 0
                                    &&
                                    <button
                                        onClick={imageSaveHandler}
                                        className="w-8 h-8 flex justify-center items-center bg-black rounded-full absolute left-36 bottom-16 cursor-pointer"
                                    >
                                        <Save fill="white"></Save>
                                    </button>
                                }
                            </div>
                        </div>

                        <div className="w-full flow-root">
                            <dl className="-my-3 text-sm">
                                <div className="space-y-1 p-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">닉네임 가이드</span></dt>

                                        <dd className="col-span-2">
                                            {
                                                !profile.nickname
                                                &&
                                                <p className="text-xs text-gray-400">* 남에게 보여지는 이름이에요.</p>
                                            }
                                        </dd>
                                    </div>

                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <dt className="font-medium text-gray-900">닉네임</dt>

                                        <dd className="flex gap-5 text-gray-700 col-span-2">
                                            <input
                                                type="text"
                                                defaultValue={profile.nickname}
                                                ref={nickname}
                                                disabled={nicknameFormDisabled}
                                                className={inputText({ className: 'w-[200px] h-[40px] disabled:bg-gray-100' })}
                                            ></input>

                                            {
                                                nicknameFormDisabled
                                                &&
                                                <button
                                                    onClick={() => setNicknameFormDisabled(false)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil width={20}></Pencil>
                                                </button>
                                                ||
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            nickname.current.value = profile.nickname;
                                                            setNicknameErrors([]);
                                                            setNicknameFormDisabled(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Undo2></Undo2>
                                                    </button>

                                                    <button
                                                        onClick={nicknameSaveHandler}
                                                        className="cursor-pointer"
                                                    >
                                                        <Save></Save>
                                                    </button>
                                                </>
                                            }
                                        </dd>
                                    </div>

                                    {/* 에러 메시지 행 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">닉네임 에러</span></dt>

                                        <dd className="col-span-2 space-y-1">
                                            {
                                                nicknameErrors.map((err, index) => {
                                                    return (
                                                        <p
                                                            key={index}
                                                            className="text-xs text-red-400"
                                                        >※ {err}</p>
                                                    )
                                                })
                                            }
                                        </dd>
                                    </div>
                                </div>

                                <div className="space-y-1 p-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">아이디 가이드</span></dt>

                                        <dd className="col-span-2">
                                            {
                                                profile.social != 'NONE' && !profile.linkage.usernameSet
                                                &&
                                                <p className="text-xs text-gray-400">* 아이디, 비밀번호를 설정하시면 일반회원처럼 로그인할 수 있어요.</p>
                                            }
                                        </dd>
                                    </div>


                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <dt className="font-medium text-gray-900">아이디</dt>

                                        <dd className="flex gap-5 text-gray-700 col-span-2">
                                            <input
                                                type="text"
                                                ref={username}
                                                disabled={usernameFormDisabled}
                                                className={inputText({ className: 'w-[200px] h-[40px] disabled:bg-gray-100' })}
                                            ></input>

                                            {
                                                usernameFormDisabled
                                                &&
                                                <button
                                                    onClick={() => setUsernameFormDisabled(false)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil width={20}></Pencil>
                                                </button>
                                                ||
                                                <>
                                                    <button
                                                        onClick={() => setUsernameFormDisabled(true)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Undo2></Undo2>
                                                    </button>

                                                    <button
                                                        onClick={usernameSaveHandler}
                                                        className="cursor-pointer"
                                                    >
                                                        <Save></Save>
                                                    </button>
                                                </>
                                            }
                                        </dd>
                                    </div>

                                    {/* 에러 메시지 행 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">아이디 에러</span></dt>

                                        <dd className="col-span-2 space-y-1">
                                            {
                                                usernameErrors.map((err, index) => {
                                                    return (
                                                        <p
                                                            key={index}
                                                            className="text-xs text-red-400"
                                                        >※ {err}</p>
                                                    )
                                                })
                                            }
                                        </dd>
                                    </div>
                                </div>

                                {/* 구분선 */}
                                <span className="w-full my-5 flex items-center">
                                    <span className="h-px flex-1 bg-gray-200"></span>
                                </span>

                                <div className="space-y-1 p-3">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <dt className="font-medium text-gray-900">이메일</dt>

                                        <dd className="flex gap-5 text-gray-700 col-span-2">
                                            <input
                                                type="text"
                                                defaultValue={profile.email}
                                                ref={email}
                                                disabled={emailFormDisabled || emailStatus == 'verified'}
                                                className={inputText({ className: 'w-[200px] h-[40px] disabled:bg-gray-100' + (emailStatus == 'verified' ? ' border-emerald-300' : '') })}
                                            ></input>

                                            {
                                                emailFormDisabled
                                                &&
                                                <button
                                                    onClick={() => setEmailFormDisabled(false)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil width={20}></Pencil>
                                                </button>
                                                ||
                                                <>
                                                    <button
                                                        onClick={() => setEmailFormDisabled(true)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Undo2></Undo2>
                                                    </button>

                                                    {
                                                        emailStatus == 'verified'
                                                        &&
                                                        <button
                                                            onClick={emailSaveHandler}
                                                            className="cursor-pointer"
                                                        >
                                                            <Save></Save>
                                                        </button>
                                                        ||
                                                        emailStatus == 'sending'
                                                        &&
                                                        <button>
                                                            <LoaderCircle className="spinner_ajPY"></LoaderCircle>
                                                        </button>
                                                        ||
                                                        <button
                                                            onClick={emailSendHandler}
                                                            className="cursor-pointer"
                                                        >
                                                            <SendHorizonal></SendHorizonal>
                                                        </button>
                                                    }
                                                </>
                                            }
                                        </dd>
                                    </div>

                                    {/* 에러 메시지 행 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">이메일 에러</span></dt>

                                        <dd className="col-span-2 space-y-1">
                                            {
                                                emailError
                                                &&
                                                <p
                                                    className="text-xs text-red-400"
                                                >※ {emailError}</p>
                                            }
                                        </dd>
                                    </div>
                                </div>

                                {
                                    codeVisible
                                    &&
                                    <div className="space-y-1 p-3">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <dt className="font-medium text-gray-900">인증번호</dt>

                                            <dd className="flex gap-5 relative text-gray-700 col-span-2">
                                                <input
                                                    type="text"
                                                    ref={code}
                                                    className={inputText({ className: 'w-[200px] h-[40px] disabled:bg-gray-100' })}
                                                ></input>

                                                {
                                                    timerKey > 0
                                                    &&
                                                    <span className="absolute inset-y-0 left-39 grid w-8 place-content-center text-red-400 text-xs">
                                                        <EmailTimer></EmailTimer>
                                                    </span>
                                                }

                                                <button
                                                    onClick={codeConfirmHandler}
                                                    className="cursor-pointer"
                                                >
                                                    <MailCheck></MailCheck>
                                                </button>
                                            </dd>
                                        </div>

                                        {/* 에러 메시지 행 */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <dt><span className="hidden">인증번호 에러</span></dt>

                                            <dd className="col-span-2 space-y-1">
                                                {
                                                    codeError
                                                    &&
                                                    <p
                                                        className="text-xs text-red-400"
                                                    >※ {codeError}</p>
                                                }
                                            </dd>
                                        </div>
                                    </div>
                                }

                                <div className="space-y-1 p-3">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <dt className="font-medium text-gray-900">이름</dt>

                                        <dd className="flex gap-5 text-gray-700 col-span-2">
                                            <input
                                                type="text"
                                                defaultValue={profile.name}
                                                ref={name}
                                                disabled={nameFormDisabled}
                                                className={inputText({ className: 'w-[200px] h-[40px] disabled:bg-gray-100' })}
                                            ></input>

                                            {
                                                nameFormDisabled
                                                &&
                                                <button
                                                    onClick={() => setNameFormDisabled(false)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil width={20}></Pencil>
                                                </button>
                                                ||
                                                <>
                                                    <button
                                                        onClick={() => setNameFormDisabled(true)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Undo2></Undo2>
                                                    </button>

                                                    <button
                                                        onClick={nameSaveHandler}
                                                        className="cursor-pointer"
                                                    >
                                                        <Save></Save>
                                                    </button>
                                                </>
                                            }
                                        </dd>
                                    </div>

                                    {/* 에러 메시지 행 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">이름 에러</span></dt>

                                        <dd className="col-span-2 space-y-1">
                                            {
                                                nameErrors.map((err, index) => {
                                                    return (
                                                        <p
                                                            key={index}
                                                            className="text-xs text-red-400"
                                                        >※ {err}</p>
                                                    )
                                                })
                                            }
                                        </dd>
                                    </div>
                                </div>

                                <div className="space-y-1 p-3">
                                    {
                                        !phoneFormDisabled
                                        &&
                                        <div className="grid grid-cols-3 gap-4">
                                            <dt><span className="hidden">전화번호 가이드</span></dt>

                                            <dd className="col-span-2">
                                                {
                                                    !profile.nickname
                                                    &&
                                                    <p className="text-xs text-gray-400">* 숫자만 입력해주세요.</p>
                                                }
                                            </dd>
                                        </div>
                                    }

                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <dt className="font-medium text-gray-900">전화번호</dt>

                                        <dd className="flex gap-5 text-gray-700 col-span-2">
                                            <input
                                                type="text"
                                                maxLength={13}
                                                defaultValue={profile.phone}
                                                ref={phone}
                                                disabled={phoneFormDisabled}
                                                onInput={addHyphen}
                                                className={inputText({ className: 'w-[200px] h-[40px] disabled:bg-gray-100' })}
                                            ></input>

                                            {
                                                phoneFormDisabled
                                                &&
                                                <button
                                                    onClick={() => setPhoneFormDisabled(false)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil width={20}></Pencil>
                                                </button>
                                                ||
                                                <>
                                                    <button
                                                        onClick={() => setPhoneFormDisabled(true)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Undo2></Undo2>
                                                    </button>

                                                    <button
                                                        onClick={phoneSaveHandler}
                                                        className="cursor-pointer"
                                                    >
                                                        <Save></Save>
                                                    </button>
                                                </>
                                            }
                                        </dd>
                                    </div>

                                    {/* 에러 메시지 행 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt><span className="hidden">전화번호 에러</span></dt>

                                        <dd className="col-span-2 space-y-1">
                                            {
                                                phoneErrors.map((err, index) => {
                                                    return (
                                                        <p
                                                            key={index}
                                                            className="text-xs text-red-400"
                                                        >※ {err}</p>
                                                    )
                                                })
                                            }
                                        </dd>
                                    </div>
                                </div>

                                {/* 구분선 */}
                                <span className="w-full my-5 flex items-center">
                                    <span className="h-px flex-1 bg-gray-200"></span>
                                </span>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">권한</dt>

                                    <dd className="text-gray-700 sm:col-span-2">
                                        {
                                            
                                            profile.roles.includes('ADMIN') && '관리자'
                                            ||
                                            profile.roles.includes('MANAGER') && '법인 회원'
                                            ||
                                            profile.roles.includes('USER') && '개인 회원'
                                        }
                                    </dd>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-3">
                                    <dt className="font-medium text-gray-900">소셜 계정</dt>

                                    <dd className="text-gray-700 col-span-2">
                                        {
                                            profile.social == 'NONE'
                                            &&
                                            <>없음</>
                                            ||
                                            profile.social == 'KAKAO'
                                            &&
                                            <img src="/images/kakao_link.png" width={20}></img>
                                            ||
                                            profile.social == 'NAVER'
                                            &&
                                            <img src="/images/naver_link.png" width={20}></img>
                                        }
                                    </dd>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-3">
                                    <dt className="font-medium text-gray-900">가입일</dt>

                                    <dd className="text-gray-700 col-span-2">{profile.registeredAt}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </>
            </MyContainer>
        </>
    )
}

export default AccountInfo;