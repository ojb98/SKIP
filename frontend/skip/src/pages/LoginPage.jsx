import { useRef } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const username = useRef();
    const password = useRef();


    return (
        <>
            <div className="w-[350px]">
                <form className="flex flex-col items-center gap-5">
                    <input
                        type="text"
                        placeholder="아이디"
                        className="h-[50px] mt-0.5 w-full rounded border-[1px] border-gray-200 text-sm indent-2"
                    ></input>

                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="h-[50px] mt-0.5 w-full rounded border-[1px] border-gray-200 text-sm indent-2"
                    ></input>

                    <div className="flex justify-center gap-5">
                        <div>
                            <input
                                type="checkbox"
                                id="auto"
                            ></input>
                            <label
                                htmlFor="auto"
                                className="text-sm text-gray-500"
                            >로그인 유지</label>
                        </div>

                        <div>
                            <input
                                type="checkbox"
                                id="save"
                            ></input>
                            <label
                                htmlFor="save"
                                className="text-sm text-gray-500"
                            >아이디 저장</label>
                        </div>
                    </div>

                    <input
                        type="submit"
                        className="h-[50px] w-full rounded border border-blue-400 bg-blue-400 text-sm font-medium text-white hover:bg-blue-500 hover:border-blue-500 cursor-pointer"
                        value="로그인"
                    ></input>

                    <ul className="flex gap-2 text-sm text-gray-500">
                        <li><Link>아이디 찾기</Link></li>
                        <li className="cursor-default">|</li>
                        <li><Link>비밀번호 찾기</Link></li>
                        <li className="cursor-default">|</li>
                        <li><Link to={"/signup"}>회원가입</Link></li>
                    </ul>
                </form>
            </div>
        </>
    )
}

export default LoginPage;