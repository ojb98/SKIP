import { createPortal } from "react-dom";
import Modal from "../../components/modal/Modal"
import ModalHeader from "../../components/modal/ModalHeader";
import { inputText } from "../../components/inputs";
import { button } from "../../components/buttons";
import { useRef, useState } from "react";
import { setPassword } from "../../api/userApi";

const PasswordSettingModal = ({ onClose }) => {
    const password = useRef();
    const confirmPassword = useRef();

    const [passwordStatus, setPasswordStatus] = useState({});
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState({});


    const setPasswordHandler = () => {
        setPassword({
            password: password.current.value,
            confirmPassword: confirmPassword.current.value
        }).then(res => {
            if (res.success) {
                alert("비밀번호가 설정되었습니다.");
                onClose();
            } else {
                res.data.password ? setPasswordStatus({ success:false, message: res.data.password }) : setPasswordStatus({ success: true });

                res.data.confirmPassword ? setConfirmPasswordStatus({ success:false, message: res.data.confirmPassword }) : setConfirmPasswordStatus({ success: true });
            }
        });
    };

    const modalContent = (
        <>
            <Modal>
                <div className="w-[460px] rounded-lg bg-white p-6 shadow-lg space-y-10">
                    <ModalHeader title="비밀번호 변경" onClose={onClose}></ModalHeader>

                    <div className="space-y-3">
                        <div className="text-right">
                            <label htmlFor="password" className="flex justify-between items-center">
                                <span className="text-sm text-gray-800">
                                    비밀번호
                                </span>

                                <input
                                    type="password"
                                    ref={password}
                                    id="password"
                                    className={inputText({ className: 'w-[200px] h-[30px]' })}
                                ></input>
                            </label>

                            {
                                passwordStatus.success == false
                                &&
                                <span className="text-xs text-red-400">{passwordStatus.message}</span>
                            }
                        </div>

                        <div className="text-right">
                            <label htmlFor="confirmPassword" className="flex justify-between items-center">
                                <span className="text-sm text-gray-800">
                                    비밀번호 확인
                                </span>

                                <input
                                    type="password"
                                    ref={confirmPassword}
                                    id="confirmPassword"
                                    className={inputText({ className: 'w-[200px] h-[30px]' })}
                                ></input>
                            </label>

                            {
                                confirmPasswordStatus.success == false
                                &&
                                <span className="text-xs text-red-400">{confirmPasswordStatus.message}</span>
                            }
                        </div>
                    </div>

                    <div className="flex justify-center gap-5">
                        <button
                            onClick={onClose}
                            className={button({ color: "secondary", className: 'w-[100px] h-[40px]' })}
                        >
                            취소
                        </button>

                        <button
                            onClick={setPasswordHandler}
                            className={button({ color: "primary", className: 'w-[100px] h-[40px]' })}
                        >
                            저장
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
}

export default PasswordSettingModal;