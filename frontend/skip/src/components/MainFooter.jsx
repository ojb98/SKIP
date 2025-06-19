import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";

const MainFooter = () => {
    const profile = useSelector(state => state.loginSlice);


    return (
        <>
            <div className="h-70 flex justify-center p-10 bg-gray-50 border-t border-gray-200">
                <div className="w-[1150px] flex flex-col justify-between text-xs font-semibold font-[NanumSquare]">
                    <div className="space-y-3">
                        <ul className="flex items-center gap-3">
                            {
                                (profile.isLoading || !profile.isLoggedIn)
                                &&
                                <>
                                    <li><Link to={`/login`}>로그인</Link></li>
                                    <li className="w-px h-3 bg-gray-300"></li>
                                    <li><Link to={`/signup`}>회원가입</Link></li>
                                </>
                                ||
                                <>
                                    <li><LogoutButton></LogoutButton></li>
                                    <li className="w-px h-3 bg-gray-300"></li>
                                    <li><Link to={`/mypage/account`}>마이페이지</Link></li>
                                </>
                            }
                        </ul>

                        <ul className="flex items-center gap-3">
                            <li className="font-extrabold">개인정보처리방침</li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>이용약관</li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>고객센터</li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>사업자정보 공개</li>
                        </ul>
                    </div>

                    <div className="space-y-3 text-gray-500">
                        <ul className="flex items-center gap-3">
                            <li>사업자 등록번호 012-34-56789</li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>통신판매번호 2025-서울종로-0000</li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>대표이사 <span className="font-extrabold">권새미</span></li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>전화번호 1588-0000(대표전화/고객센터)</li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>이메일 wjdqls980@naver.com</li>
                        </ul>

                        <ul className="flex items-center gap-3">
                            <li>주소 <span className="font-extrabold">서울 종로구 SKIP</span></li>
                            <li className="w-px h-3 bg-gray-300"></li>
                            <li>호스팅 서비스 제공 <span className="font-extrabold">localhost</span></li>
                        </ul>
                    </div>

                    <p className="text-gray-500">
                        스킵은 인터넷에 공개돼있는 정보를 바탕으로 만들어진 가상의 서비스로서, 기입된 정보들의 일부를 제외하곤 모두 사실이 아님을 알려드립니다.
                    </p>

                    <h1 className="text-xl text-gray-400 font-[GumiRomanceTTF] italic cursor-default">SKI:P</h1>
                </div>
            </div>
        </>
    )
}

export default MainFooter;