import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/userApi";
import { useDispatch } from "react-redux";
import { setProfile } from "../slices/loginSlice";

const input_size = ' h-[55px] w-full ';
const input_text = ' rounded border-[1px] border-gray-200 text-sm indent-2 focus-visible:outline-none focus:border-black ';

const LoginPage = () => {
    const username = useRef();
    const password = useRef();
    const [loginError, setLoginError] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const loginHandler = e => {
        e.preventDefault();

        if (!username.current.value) {
            setLoginError('아이디를 입력해주세요.');
            return;
        }

        if (!password.current.value) {
            setLoginError('비밀번호를 입력해주세요.');
            return;
        }

        const params = new URLSearchParams();
        params.append('username', username.current.value);
        params.append('password', password.current.value)

        login(params).then(res => {
            if (res.success) {
                dispatch(setProfile());
                navigate({ pathname: '/' }, { replace: true });
            } else {
                setLoginError('아이디 또는 비밀번호가 틀렸습니다.');
            }
        });
    }

    return (
        <>
            <div className="w-[350px]">
                <form className="flex flex-col items-center gap-7" onSubmit={loginHandler}>
                    <input
                        type="text"
                        placeholder="아이디"
                        className={`${input_size} ${input_text}`}
                        ref={username}
                    ></input>

                    <input
                        type="password"
                        placeholder="비밀번호"
                        className={`${input_size} ${input_text}`}
                        ref={password}
                    ></input>

                    <div className={`w-full ${loginError ? 'flex' : 'hidden'} justify-start`}>
                        <span className="text-xs text-red-400">{loginError}</span>
                    </div>

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
                        className={`${input_size} rounded border border-blue-400 bg-blue-400 text-sm font-medium text-white hover:bg-blue-500 hover:border-blue-500 cursor-pointer`}
                        value="로그인"
                    ></input>

                    <ul className="flex gap-2 text-sm text-gray-500">
                        <li className="hover:text-black"><Link>아이디 찾기</Link></li>
                        <li className="cursor-default">|</li>
                        <li className="hover:text-black"><Link>비밀번호 찾기</Link></li>
                        <li className="cursor-default">|</li>
                        <li className="hover:text-black"><Link to={"/signup"}>회원가입</Link></li>
                    </ul>
                </form>
            </div>
        </>
    )
}

export default LoginPage;