import { useState } from "react";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";

const AccountPage = () => {
    const profile = useSelector(state => state.loginSlice);


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