import { Link } from "react-router-dom";

const SideBar = ({active}) => {
    return (
        <>
            <div className="w-2xs">
                <ul>
                    <li><Link to="/mypage/account" className={`${active === 'account' ? 'underline' : ''}`}>회원 정보</Link></li>
                    <li><Link to="/mypage/review" className={`${active === 'review' ? 'underline' : ''}`}>리뷰 관리</Link></li>
                    <li><Link to="/mypage/qna" className={`${active === 'qna' ? 'underline' : ''}`}>문의 관리</Link></li>
                </ul>
            </div>
        </>
    )
}

export default SideBar;