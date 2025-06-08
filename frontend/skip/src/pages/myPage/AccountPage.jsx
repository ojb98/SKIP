import { useSelector } from "react-redux";
import SocialLinkage from "../../components/myPage/SocialLinkage";
import AccountInfo from "../../components/myPage/AccountInfo";

const AccountPage = () => {
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