import { useSelector } from "react-redux";
import NotSetBadge from "../../components/MyPage/NotSetBadge";
import MyContainer from "../../components/myPage/MyContainer";
import { button } from "../../components/buttons";

const AccountPage = () => {
    const profile = useSelector(state => state.loginSlice);


    return (
        <>
            <h1 className="text-3xl font-bold mb-5">회원 정보</h1>

            <ul className="flex flex-col gap-10">
                <li>
                    <h2 className="text-xl font-semibold mb-5">기본 정보</h2>

                    <div className="flex flex-col items-center gap-10 border border-gray-200 rounded-2xl p-5 shadow-md">
                        <img src={profile.image ? `http://localhost:8080/${profile.image}` : "/images/profile_default.png"} className="w-[160px] h-[160px] rounded-full"></img>

                        <div className="w-full flow-root">
                            <dl className="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50">
                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">닉네임</dt>

                                    <dd className="text-gray-700 sm:col-span-2">
                                        {
                                            (
                                                (
                                                    typeof profile.nickname == 'undefined' || profile.nickname == ''
                                                )
                                                &&
                                                <span className="text-xs text-gray-400">*남에게 보여지는 이름이에요.</span>
                                            )
                                            ||
                                            profile.nickname
                                        }
                                    </dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">아이디</dt>

                                    <dd className="text-gray-700 sm:col-span-2">
                                        {
                                            (
                                                (
                                                    profile.social != 'NONE' && !profile.linkage.usernameSet
                                                )
                                                &&
                                                <span className="text-xs text-gray-400">*아이디, 비밀번호를 설정하시면 일반회원처럼 로그인할 수 있어요.</span>
                                            )
                                            ||
                                            profile.username
                                        }
                                    </dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">이메일</dt>

                                    <dd className="text-gray-700 sm:col-span-2">{profile.email}</dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">이름</dt>

                                    <dd className="text-gray-700 sm:col-span-2">
                                        {profile.name}
                                    </dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">휴대폰 번호</dt>

                                    <dd className="text-gray-700 sm:col-span-2">{profile.phone}</dd>
                                </div>

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

                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">가입일</dt>

                                    <dd className="text-gray-700 sm:col-span-2">{profile.registeredAt}</dd>
                                </div>
                            </dl>
                        </div>

                        <button
                            className={button({
                                color: "primary", className: 'w-[150px] h-[45px]'
                            })}
                        >
                            수정
                        </button>
                    </div>
                </li>

                <li>
                    <MyContainer
                        title="소셜 연동"
                        component={
                            <>
                                
                            </>
                        }
                    >
                    </MyContainer>
                </li>
            </ul>
        </>
    )
}

export default AccountPage;