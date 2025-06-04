import { useSelector } from "react-redux";
import MyContainer from "../../components/myPage/MyContainer";
import { useRef, useState } from "react";
import { button } from "../../components/buttons";
import PasswordChangingModal from "./PasswordChangingModal";
import NotSetBadge from "../../components/MyPage/NotSetBadge";
import PasswordSettingModal from "./PasswordSettingModal";
import AccountDeleteModal from "./AccountDeleteModal";

const AccountSecurityPage = () => {
    const profile = useSelector(state => state.loginSlice);
    const [passwordSettingModalVisible, setPasswordSettingModalVisible] = useState(false);
    const [passwordChangingModalVisible, setPasswordChangingModalVisible] = useState(false);
    const [accountDeleteModalVisible, setAccountDeleteModalVisible] = useState(false);


    return (
        <>
            <h1 className="text-3xl font-bold mb-5">보안 사항</h1>

            <ul className="flex flex-col gap-10">
                <li>
                    <MyContainer
                        title="비밀번호 변경"
                        component={
                            <>
                                <div className="w-full flex justify-between items-center">
                                    <span className="text-gray-500 font-semibold">
                                        비밀번호
                                    </span>

                                    {
                                        profile.social != 'NONE'
                                        &&
                                        !profile.linkage.passwordSet
                                        &&
                                        <span className="text-xs text-gray-400">*아이디, 비밀번호를 설정하시면 일반회원처럼 로그인할 수 있어요.</span>
                                    }

                                    <span>
                                        {
                                            (
                                                profile.social != 'NONE'
                                                &&
                                                !profile.linkage.passwordSet
                                                &&
                                                <button
                                                    className={button({
                                                        color: "primary",
                                                        className: 'w-[140px] h-[50px]'
                                                    })}
                                                    onClick={() => setPasswordSettingModalVisible(true)}
                                                >
                                                    설정
                                                </button>
                                            )
                                            ||
                                            <button
                                                className={button({
                                                    color: "primary",
                                                    className: 'w-[140px] h-[50px]'
                                                })}
                                                onClick={() => setPasswordChangingModalVisible(true)}
                                            >
                                                변경
                                            </button>
                                        }
                                    </span>
                                </div>
                            </>
                        }
                        ></MyContainer>
                </li>

                <li>
                    <MyContainer
                        title="회원 탈퇴"
                        component={
                            <>
                                <div className="w-full flex justify-between items-center">
                                    <span className="text-gray-500 font-semibold">
                                        계정 탈퇴 시 프로필 및 예약 정보가 삭제됩니다.
                                    </span>

                                    <span>
                                        <button
                                            onClick={() => setAccountDeleteModalVisible(true)}
                                            className={`w-[140px] h-[50px] rounded bg-blue-400 font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer`}
                                        >
                                            탈퇴
                                        </button>
                                    </span>
                                </div>
                            </>
                        }
                    ></MyContainer>
                </li>
            </ul>

            {/* 비밀번호 변경 모달 */}
            {
                passwordChangingModalVisible
                &&
                <PasswordChangingModal onClose={() => setPasswordChangingModalVisible(false)}></PasswordChangingModal>
            }

            {/* 비밀번호 설정 모달 */}
            {
                passwordSettingModalVisible
                &&
                <PasswordSettingModal onClose={() => setPasswordSettingModalVisible(false)}></PasswordSettingModal>
            }

            {/* 회원 탈퇴 모달 */}
            {
                accountDeleteModalVisible
                &&
                <AccountDeleteModal onClose={() => setAccountDeleteModalVisible(false)}></AccountDeleteModal>
            }
        </>
    )
}

export default AccountSecurityPage;