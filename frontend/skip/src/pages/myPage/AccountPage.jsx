import { useSelector } from "react-redux";
import SocialLinkage from "../../components/myPage/SocialLinkage";
import AccountInfo from "../../components/myPage/AccountInfo";
import { useEffect, useRef } from "react";
import { replace, useNavigate, useSearchParams } from "react-router-dom";

const AccountPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const success = searchParams.get('success');
        const data = searchParams.get('data');

        if (success == 'false') {
            alert(data);
            navigate('/mypage/account', { replace: true });
        }
    }, [searchParams, navigate]);


    return (
        <>
            <h1 className="text-3xl font-bold mb-5">회원 정보</h1>

            <ul className="flex flex-col gap-10">
                <li>
                    <AccountInfo></AccountInfo>
                </li>

                <li>
                    <SocialLinkage></SocialLinkage>
                </li>
            </ul>
        </>
    )
}

export default AccountPage;