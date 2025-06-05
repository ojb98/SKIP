import { useSelector } from "react-redux";
import NotSetBadge from "../../components/MyPage/NotSetBadge";
import MyContainer from "../../components/myPage/MyContainer";
import { button } from "../../components/buttons";
import SocialLinkage from "../../components/myPage/SocialLinkage";
import AccountInfo from "../../components/myPage/AccountInfo";
import { useState } from "react";
import AccountEdit from "../../components/myPage/AccountEdit";

const AccountPage = () => {
    const profile = useSelector(state => state.loginSlice);

    const [edit, setEdit] = useState(false);


    return (
        <>
            <h1 className="text-3xl font-bold mb-5">회원 정보</h1>

            <ul className="flex flex-col gap-10">
                <li>
                    {
                        edit
                        &&
                        <AccountEdit ></AccountEdit>
                        ||
                        <AccountInfo onEdit={() => setEdit(true)}></AccountInfo>
                    }
                </li>

                <li>
                    <SocialLinkage></SocialLinkage>
                </li>
            </ul>
        </>
    )
}

export default AccountPage;