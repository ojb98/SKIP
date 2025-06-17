import { useSelector } from "react-redux";
import IdPasswordFindTab from "../../components/login/IdPasswordFindTab";
import { Link } from "react-router-dom";

const PasswordResetSuccessPage = () => {
    const profile = useSelector(state => state.loginSlice);


    return (
        <>
            <div className="flex flex-col gap-10 items-center">
                <IdPasswordFindTab active={'pwd'}></IdPasswordFindTab>

                <p className="text-sm font-[NanumSquare] text-green-500">비밀번호가 변경되었습니다.</p>

                {
                    (!profile.isLoading && profile.isLoggedIn)
                    &&
                    <div className="space-x-3 text-sm font-[nanumSquare]">
                        <span>마이페이지로 돌아가실래요?</span>

                        <Link to="/mypage/account" className="text-blue-500 hover:underline hover:underline-offset-4">돌아가기</Link>
                    </div>
                    ||
                    <div className="space-x-3 text-sm font-[nanumSquare]">
                        <span>로그인하러 가실래요?</span>

                        <Link to="/login" className="text-blue-500 hover:underline hover:underline-offset-4">로그인하기</Link>
                    </div>
                }
            </div>
        </>
    )
};

export default PasswordResetSuccessPage;