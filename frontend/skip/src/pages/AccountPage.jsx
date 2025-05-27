import { useState } from "react";
import MySideBar from "../components/MySideBar";
import { useSelector } from "react-redux";
import MyPageLayout from "./MyPageLayout";

const AccountPage = () => {
    const profile = useSelector(state => state.loginSlice);


    return (
        <>
            <h1 className="text-2xl font-bold mb-5">회원 정보</h1>

            <ul className="flex flex-col gap-10">
                <li>
                    <h2 className="text-xl font-semibold mb-5">기본 정보</h2>

                    <div className="flex flex-col items-center gap-10 border border-gray-200 rounded-2xl p-5">
                        <img src={profile.image ? `http://localhost:8080/${profile.image}` : "/images/profile_default.png"} className="w-[160px] h-[160px] rounded-full"></img>

                        <div className="w-full flow-root">
                            <dl className="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50">
                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">닉네임</dt>

                                    <dd className="text-gray-700 sm:col-span-2"></dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">아이디</dt>

                                    <dd className="text-gray-700 sm:col-span-2"></dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">이메일</dt>

                                    <dd className="text-gray-700 sm:col-span-2"></dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">실명</dt>

                                    <dd className="text-gray-700 sm:col-span-2"></dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">전화번호</dt>

                                    <dd className="text-gray-700 sm:col-span-2">
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <button className="w-[100px] h-[50px] rounded mt-3 bg-blue-400 font-[NanumSquareNeo] font-medium text-white hover:bg-blue-500 cursor-pointer">
                            수정
                        </button>
                    </div>
                </li>

                <li>
                    <h2 className="text-xl font-semibold mb-5">비밀번호 변경</h2>

                    <div className="border border-gray-200 rounded-2xl p-5">
                        d
                    </div>
                </li>

                <li>
                    <h2 className="text-xl font-semibold mb-5">회원 탈퇴</h2>

                    <div className="border border-gray-200 rounded-2xl p-5">
                        d
                    </div>
                </li>
            </ul>
        </>
    )
}

export default AccountPage;