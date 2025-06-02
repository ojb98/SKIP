import { createPortal } from "react-dom";
import Modal from "../../components/modal/Modal"
import ModalHeader from "../../components/modal/ModalHeader";
import { inputText } from "../../components/inputs";
import { button } from "../../components/buttons";
import { useRef, useState } from "react";
import { setPassword } from "../../api/userApi";
import ModalFooter from "../../components/modal/ModalFooter";

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
            <Modal onClose={onClose}>
                <div onClick={e => e.stopPropagation()} className="w-[460px] rounded-lg bg-white p-6 shadow-lg space-y-7">
                    <ModalHeader title="비밀번호 설정" onClose={onClose}></ModalHeader>

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
                                    className={inputText({ className: 'w-[200px] h-[40px]' })}
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
                                    className={inputText({ className: 'w-[200px] h-[40px]' })}
                                ></input>
                            </label>

                            {
                                confirmPasswordStatus.success == false
                                &&
                                <span className="text-xs text-red-400">{confirmPasswordStatus.message}</span>
                            }
                        </div>
                    </div>

                    <ModalFooter cancel="취소" confirm="저장" onCancel={onClose} onConfirm={setPasswordHandler}></ModalFooter>
                </div>
            </Modal>
        </>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
}

export default PasswordSettingModal;