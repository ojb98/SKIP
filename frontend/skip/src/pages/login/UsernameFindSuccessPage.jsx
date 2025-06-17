import { Link, useLocation, useNavigate } from "react-router-dom";
import IdPasswordFindTab from "../../components/login/IdPasswordFindTab"

const UsernameFindSuccessPage = () => {
    const location = useLocation();

    const navigate = useNavigate();

    if (!location.state) {
        navigate('/id/find', { replace: true });
    }

    const { email } = location.state;


    return (
        <>
            <div className="flex flex-col gap-10 items-center">
                <IdPasswordFindTab active={'id'}></IdPasswordFindTab>

                <div className="w-full font-[nanumSquare]">
                    <p className="p-3 text-sm">다음 이메일로 아이디를 전송했습니다.</p>

                    <div className="w-100% h-50 bg-gray-100 rounded-2xl flex justify-center items-center">
                        {email}
                    </div>
                </div>

                <div className=" space-x-3 text-sm font-[nanumSquare]">
                    <span>로그인하러 가실래요?</span>

                    <Link to="/login" className="text-blue-500 hover:underline hover:underline-offset-4">로그인하기</Link>
                </div>
            </div>
        </>
    )
};

export default UsernameFindSuccessPage;