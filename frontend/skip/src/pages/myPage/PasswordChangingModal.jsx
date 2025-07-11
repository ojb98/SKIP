import { createPortal } from "react-dom";
import Modal from "../../components/modal/Modal";
import ModalHeader from "../../components/modal/ModalHeader";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { changePassword } from "../../api/userApi";
import { inputText } from "../../components/inputs";
import { button } from "../../components/buttons";
import ModalFooter from "../../components/modal/ModalFooter";
import { useSelector } from "react-redux";

const PasswordChangingModal = ({ onClose }) => {
    const profile = useSelector(state => state.loginSlice);

    const currentPassword = useRef();
    const newPassword = useRef();
    const confirmNewPassword = useRef();

    const [currentPasswordStatus, setCurrentPasswordStatus] = useState({});
    const [newPasswordStatus, setNewPasswordStatus] = useState({});
    const [confirmNewPasswordStatus, setConfirmNewPasswordStatus] = useState({});


    const changePasswordHandler = () => {
        changePassword({
            currentPassword: currentPassword.current.value,
            newPassword: newPassword.current.value,
            confirmNewPassword: confirmNewPassword.current.value,
        }).then(res => {
            console.log(res);
            if (res.success) {
                alert("비밀번호가 변경되었습니다.");
                onClose();
            } else {
                if (res.data.currentPassword) {
                    setCurrentPasswordStatus({
                        success: false,
                        message: res.data.currentPassword
                    });
                } else {
                    setCurrentPasswordStatus({
                        success: true
                    })
                }

                if (res.data.newPassword) {
                    setNewPasswordStatus({
                        success: false,
                        message: res.data.newPassword
                    });
                } else {
                    setNewPasswordStatus({
                        success: true
                    })
                }

                
                if (res.data.confirmNewPassword) {
                    setConfirmNewPasswordStatus({
                        success: false,
                        message: res.data.confirmNewPassword
                    });
                } else {
                    setConfirmNewPasswordStatus({
                        success: true
                    })
                }
            }
        });
    };

    const modalContent = (
        <>
            <Modal onClose={onClose}>
                {/* 모달 창 */}
                <div onClick={e => e.stopPropagation()} className="w-[460px] rounded-lg bg-white p-6 shadow-lg space-y-7">
                    <ModalHeader title="비밀번호 변경" onClose={onClose}></ModalHeader>

                    <div className="space-y-3">
                        <div className="text-right">
                            <label htmlFor="currentPassword" className="flex justify-between items-center">
                                <span className="text-sm text-gray-800">
                                    현재 비밀번호
                                </span>

                                <input
                                    type="password"
                                    ref={currentPassword}
                                    id="currentPassword"
                                    className={inputText({ className: 'w-[200px] h-[40px]' })}
                                ></input>
                            </label>

                            {
                                currentPasswordStatus.success == false
                                &&
                                <span className="text-xs text-red-400">{currentPasswordStatus.message}</span>
                            }
                        </div>

                        <div className="text-right">
                            <label htmlFor="newPassword" className="flex justify-between items-center">
                                <span className="text-sm text-gray-800">
                                    새 비밀번호
                                </span>

                                <input
                                    type="password"
                                    ref={newPassword}
                                    id="newPassword"
                                    className={inputText({ className: 'w-[200px] h-[40px]' })}
                                ></input>
                            </label>

                            {
                                newPasswordStatus.success == false
                                &&
                                <span className="text-xs text-red-400">{newPasswordStatus.message}</span>
                            }
                        </div>

                        <div className="text-right">
                            <label htmlFor="confirmNewPassword" className="flex justify-between items-center">
                                <span className="text-sm text-gray-800">
                                    새 비밀번호 확인
                                </span>

                                <input
                                    type="password"
                                    ref={confirmNewPassword}
                                    id="confirmNewPassword"
                                    className={inputText({ className: 'w-[200px] h-[40px]' })}
                                ></input>
                            </label>

                            {
                                confirmNewPasswordStatus.success == false
                                &&
                                <span className="text-xs text-red-400">{confirmNewPasswordStatus.message}</span>
                            }
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 text-sm">
                        <span className="text-gray-500">혹시 비밀번호를 잊으셨나요?</span>
                        <Link to={'/password/reset'} state={{ username: profile.username }} className="text-blue-500 hover:underline hover:underline-offset-4">비밀번호 재설정</Link>
                    </div>
                    
                    <ModalFooter cancel="취소" confirm="저장" onCancel={onClose} onConfirm={changePasswordHandler}></ModalFooter>
                </div>
            </Modal>
        </>
    );


    return createPortal(modalContent, document.getElementById('modal-root'));
}

export default PasswordChangingModal;