import { createPortal } from "react-dom";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import ModalFooter from "../../components/modal/ModalFooter";
import { inputText } from "../../components/inputs";
import { useRef, useState } from "react";
import { confirmCode, deleteAccount, verifyEmail } from "../../api/userApi";
import { button, radio } from "../../components/buttons";
import { useDispatch, useSelector } from "react-redux";
import { logout, setProfile } from "../../slices/loginSlice";
import { useNavigate } from "react-router-dom";
import EmailTimer from "../../components/EmailTimer";

const AccountDeleteModal = ({ onClose }) => {
    const profile = useSelector(state => state.loginSlice);

    const [visibleAuth, setVisibleAuth] = useState(profile.social == 'NONE' ? 'passwordAuth' : 'emailAuth');

    const password = useRef();
    const email = useRef();
    const verificationCode = useRef();
    const confirm = useRef();
    
    const [passwordStatus, setPasswordStatus] = useState({});
    const [emailPhase, setEmailPhase] = useState(1);
    const [emailStatus, setEmailStatus] = useState({});
    const [verificationCodeVisible, setVerificationCodeVisible] = useState(false);
    const [verificationCodeStatus, setVerificationCodeStatus] = useState({});
    const [timerVisible, setTimerVisible] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const changeVisible = e => {
        setVisibleAuth(e.target.value);
    }

    const verifyHandler = () => {
        setTimerVisible(false);
        setEmailPhase(2);

        verifyEmail(email.current.value).then(res => {
            setEmailPhase(3);

            if (res.success) {
                setVerificationCodeVisible(true);
                setTimerVisible(true);
            } else {
                setEmailStatus({
                    success: false,
                    message: res.data
                })
            }
        });
    }

    const confirmHandler = () => {
        confirmCode({
            email: email.current.value,
            verificationCode: verificationCode.current.value
        }).then(res => {
            if (res.success) {
                setVerificationCodeVisible(false);
                setEmailPhase(4);
                setEmailStatus({
                    success: true,
                    message: "인증되었습니다."
                })
            } else {
                setVerificationCodeStatus({
                    success: false,
                    message: res.data
                })
            }
        });
    }

    const accountDeleteHandler = () => {
        const req = {
            confirm: confirm.current.value
        };

        if (visibleAuth == 'passwordAuth') {
            req.isPassword = true;
            req.password = password.current.value;
        } else {
            req.isPassword = false;
            req.email = email.current.value;
            req.isVerified = emailPhase == 4 ? true : false;
        }
        

        deleteAccount(req).then(res => {
            if (res.success) {
                dispatch(logout())
                    .unwrap()
                    .then(res => {
                        dispatch(setProfile());
                        navigate('/');
                    });
                alert("탈퇴되었습니다.");
            } else {
                res.data.password ? setPasswordStatus({ success: false, message: res.data.password }) : setPasswordStatus({ success: true });

                res.data.email ? setEmailStatus({ success: false, message: res.data.email }) : 0;

                res.data.confirm ? setConfirmStatus({ success: false, message: res.data.confirm }) : setConfirmStatus({ success: true });
            }
        });
    };

    const modalContent = (
        <>
            <Modal onClose={onClose}>
                <div onClick={e => e.stopPropagation()} className="w-[460px] rounded-lg bg-white p-6 shadow-lg space-y-7">
                    <ModalHeader title="계정 탈퇴" onClose={onClose}></ModalHeader>

                    <div className="space-y-3 text-sm">
                        <div className="text-red-400 font-semibold">
                            <p>계정을 탈퇴하시겠습니까?</p>
                            <p>(한 번 탈퇴하신 계정은 복구할 수 없습니다.)</p>
                        </div>

                        <span className="flex items-center">
                            <span className="h-px flex-1 bg-gray-300"></span>
                        </span>

                        <fieldset className="flex justify-evenly items-center gap-5 p-5">
                            <div>
                                <label id="passwordAuth" className={radio({ })}>
                                    <p>비밀번호 인증</p>

                                    <input
                                        type="radio"
                                        id="passwordAuth"
                                        name="auth"
                                        value="passwordAuth"
                                        defaultChecked={profile.social == 'NONE' ? true : false}
                                        disabled={profile.social != 'NONE' && !profile.linkage.passwordSet ? true : false}
                                        onClick={changeVisible}
                                        className="sr-only"
                                    ></input>
                                </label>
                            </div>

                            <div>
                                <label htmlFor="emailAuth" className={radio({ })}>
                                    <p>이메일 인증</p>

                                    <input
                                        type="radio"
                                        id="emailAuth"
                                        name="auth"
                                        value="emailAuth"
                                        defaultChecked={profile.social == 'NONE' ? false : true}
                                        onClick={changeVisible}
                                        className="sr-only"
                                    ></input>
                                </label>
                            </div>
                        </fieldset>

                        {/* 비밀번호 인증 */}
                        {
                            visibleAuth == 'passwordAuth'
                            &&
                            <div className="text-right">
                                <label htmlFor="password" className="flex justify-between items-center">
                                    <span>비밀번호</span>

                                    <input
                                        type="password"
                                        ref={password}
                                        id="password"
                                        className={inputText({ className: 'w-[200px] h-[40px]' })}
                                    ></input>
                                </label>

                                {
                                    !passwordStatus.success
                                    &&
                                    <span className="text-xs text-red-400">{passwordStatus.message}</span>
                                }
                            </div>
                        }

                        {/* 이메일 인증 */}
                        {
                            visibleAuth == 'emailAuth'
                            &&
                            <div>
                                <label htmlFor="email" className="flex justify-between items-center">
                                    <span>이메일</span>

                                    <div className="flex justify-center items-center gap-1">
                                        <input
                                            type="text"
                                            ref={email}
                                            id="email"
                                            value={profile.email}
                                            disabled
                                            className={inputText({ className: 'w-[200px] h-[40px]' })}
                                        ></input>

                                        {
                                            (
                                                emailPhase == 1
                                                &&
                                                <button
                                                    className={button({ color: "primary", className: 'w-[60px] h-[40px]' })}
                                                    onClick={verifyHandler}
                                                >
                                                    인증
                                                </button>
                                            )
                                            ||
                                            (
                                                emailPhase == 2
                                                &&
                                                <button
                                                    className={button({ color: "primary", className: 'flex justify-center items-center w-[60px] h-[40px] cursor-default' })}
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
                                            )
                                            ||
                                            (
                                                emailPhase == 3
                                                &&
                                                <button
                                                    className={button({ color: "primary", className: 'w-[60px] h-[40px]' })}
                                                    onClick={verifyHandler}
                                                >
                                                    재전송
                                                </button>
                                            )
                                            ||
                                            (
                                                emailPhase == 4
                                                &&
                                                <button
                                                    className={button({ color: "inactive", className: 'w-[60px] h-[40px]' })}
                                                >
                                                    인증
                                                </button>
                                            )
                                        }
                                    </div>
                                </label>

                                <div className="w-full text-right">
                                    {
                                        emailStatus.success
                                        ?
                                        <span className="text-xs text-green-400">{emailStatus.message}</span>
                                        :
                                        (
                                            typeof emailStatus.success == 'undefined' ?
                                            <></> :
                                                <span className="text-xs text-red-400">{emailStatus.message}</span>
                                            )
                                    }
                                </div>
                            </div>
                        }

                        {
                            verificationCodeVisible
                            &&
                            <div>
                                <label htmlFor="verificationCode" className="flex justify-between items-center">
                                    <span>인증번호</span>

                                    <div className="flex justify-center items-center gap-1 relative">
                                        <input
                                            type="text"
                                            ref={verificationCode}
                                            id="verificationCode"
                                            className={inputText({ className: 'w-[200px] h-[40px]' })}
                                        ></input>

                                        {
                                            timerVisible
                                            &&
                                            <span className="absolute inset-y-0 right-19 grid w-8 place-content-center text-red-400 text-xs">
                                                <EmailTimer></EmailTimer>
                                            </span>
                                        }

                                        <button
                                            className={button({ color: "primary", className: 'w-[60px] h-[40px]' })}
                                            onClick={confirmHandler}
                                        >
                                            확인
                                        </button>
                                    </div>
                                </label>

                                <div className="w-full text-right">
                                    {
                                        verificationCodeStatus.success
                                        ?
                                        <span className="text-xs text-green-400">{verificationCodeStatus.message}</span>
                                        :
                                        (
                                            typeof verificationCodeStatus.success == 'undefined' ?
                                            <></> :
                                                <span className="text-xs text-red-400">{verificationCodeStatus.message}</span>
                                            )
                                    }
                                </div>
                            </div>
                        }

                        <div className="text-right">
                            <input
                                type="text"
                                placeholder={`확인을 위해 'delete'를 입력해주세요.`}
                                ref={confirm}
                                className={inputText({ className: 'w-full h-[40px]' })}
                            ></input>

                            {
                                !confirmStatus.success
                                &&
                                <span className="text-xs text-red-400">{confirmStatus.message}</span>
                            }
                        </div>
                    </div>

                    <ModalFooter cancel="취소" confirm="확인" onCancel={onClose} onConfirm={accountDeleteHandler}></ModalFooter>
                </div>
            </Modal>
        </>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
}

export default AccountDeleteModal;