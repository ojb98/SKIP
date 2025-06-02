import { Link, Outlet } from "react-router-dom";

const LoginLayout = () => {
    return (
        <>
            <div className="flex flex-col items-center p-10">
                <h1 className="my-10 text-5xl text-blue-400 font-[GumiRomanceTTF] italic font-bold"><Link to={"/"}>SKI:P</Link></h1>

                <Outlet></Outlet>

                <div className="my-10 text-xs text-gray-700">
                    ©Skip Corp. All rights reserved.
                </div>
            </div>
        </>
    )
}

export default LoginLayout;