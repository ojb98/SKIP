import { createPortal } from "react-dom";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import ModalFooter from "../../components/modal/ModalFooter";
import { inputText } from "../../components/inputs";
import { useRef, useState } from "react";
import { deleteAccount } from "../../api/userApi";
import { button, radio } from "../../components/buttons";
import { useDispatch, useSelector } from "react-redux";
import { logout, setProfile } from "../../slices/loginSlice";
import { useNavigate } from "react-router-dom";

const AccountDeleteModal = ({ onClose }) => {
    const profile = useSelector(state => state.loginSlice);

    const [visibleAuth, setVisibleAuth] = useState(profile.social == 'NONE' ? 'passwordAuth' : 'emailAuth');

    const password = useRef();
    const email = useRef();
    const confirm = useRef();    
    
    const [passwordStatus, setPasswordStatus] = useState({});
    const [emailStatus, setEmailStatus] = useState({ phase: 1 });
    const [confirmStatus, setConfirmStatus] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const changeVisible = e => {
        setVisibleAuth(e.target.value);
    }

    const verifyHandler = () => {
        setEmailStatus({
            phase: 2
        });
    }

    const accountDeleteHandler = () => {
        deleteAccount({
            password: password.current.value,
            confirm: confirm.current.value
        }).then(res => {
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

                        <fieldset className="flex justify-evenly items-center gap-5 mt-5 p-5 border-t border-gray-300">
                            <div>
                                <label id="passwordAuth" className={radio({ })}>
                                    <p>비밀번호 인증</p>

                                    <input
                                        type="radio"
                                        id="passwordAuth"
                                        name="auth"
                                        value="passwordAuth"
                                        defaultChecked={profile.social == 'NONE' ? true : false}
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

                                    <div>
                                        <input
                                            type="text"
                                            ref={email}
                                            id="email"
                                            value={profile.email}
                                            disabled
                                            className={inputText({ className: 'w-[200px] h-[40px] mr-1' })}
                                        ></input>

                                        {
                                            (
                                                emailStatus.phase == 1
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
                                                emailStatus.phase == 2
                                                &&
                                                <button
                                                    className={button({ color: "primary", className: 'w-[60px] h-[40px]' })}
                                                    onClick={verifyHandler}
                                                >
                                                    전송중
                                                </button>
                                            )
                                        }
                                    </div>
                                </label>
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