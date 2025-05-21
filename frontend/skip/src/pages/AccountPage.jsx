import { useState } from "react";
import SideBar from "../components/SideBar";
import useProfile from "../hooks/useProfile";

const AccountPage = () => {
    const profile = useProfile();
    console.log(profile);


    return (
        <>
            <div className="w-6xl flex justify-between">
                <SideBar active="account"></SideBar>

                <div className="w-[800px]">
                    
                </div>
            </div>
        </>
    )
}

export default AccountPage;