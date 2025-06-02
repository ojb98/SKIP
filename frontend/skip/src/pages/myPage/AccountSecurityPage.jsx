import { useSelector } from "react-redux";
import MyContainer from "../../components/myPage/MyContainer";
import { useState } from "react";

const AccountSecurityPage = () => {
    const profile = useSelector(state => state.loginSlice);
    const [passwordSettingModalStatus, setPasswordSettingModalStatus] = useState('hidden');


    const setPasswordHandler = () => {
        setPasswordSettingModalStatus('grid');
    }

    const changePasswordHandler = () => {

    }

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
                                        {
                                            profile.social != 'NONE'
                                            &&
                                            !profile.linkage.passwordSet
                                            &&
                                            <NotSetBadge styleClass="ml-10"></NotSetBadge>
                                        }
                                    </span>

                                    <span>
                                        {
                                            (
                                                profile.social != 'NONE'
                                                &&
                                                !profile.linkage.passwordSet
                                                &&
                                                <button
                                                    className={`w-[140px] h-[50px] rounded bg-blue-400 font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer`}
                                                    onClick={setPasswordHandler}
                                                >
                                                    설정
                                                </button>
                                            )
                                            ||
                                            <button
                                                className={`w-[140px] h-[50px] rounded bg-blue-400 font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer`}
                                                onClick={changePasswordHandler}
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
            <div
                className={`fixed inset-0 z-50 place-content-center bg-black/50 p-4 ${passwordSettingModalStatus}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalTitle"
            >
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex items-start justify-between">
                        <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl">Modal Title</h2>

                        <button
                            type="button"
                            className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4">
                        <p className="text-pretty text-gray-700">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu
                            consectetur. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                        <label htmlFor="Confirm" className="mt-4 block">
                            <span className="text-sm font-medium text-gray-700">
                                Please type "Confirm" to complete action
                            </span>

                            <input
                                type="text"
                                id="Confirm"
                                className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                            />
                        </label>
                    </div>

                    <footer className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Done
                        </button>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default AccountSecurityPage;