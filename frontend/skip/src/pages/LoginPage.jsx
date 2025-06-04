import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, socialLogin } from "../api/userApi";
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

    const socialLoginHandler = client => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${client}`;
    }

    return (
        <>
            <div className="w-[350px] flex flex-col items-center">
                <form className="w-full flex flex-col items-center gap-7" onSubmit={loginHandler}>
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

                    <div className={`w-full ${loginError ? 'flex' : 'hidden'} justify-start -my-3`}>
                        <span className="text-xs text-red-400">※ {loginError}</span>
                    </div>

                    <input
                        type="submit"
                        className={`${input_size} rounded mt-3 bg-blue-400 font-[NanumSquare] font-medium text-white hover:bg-blue-500 cursor-pointer`}
                        value="로그인"
                    ></input>

                    <ul className="flex gap-2 text-sm text-gray-500">
                        <li className="hover:text-black"><Link>아이디 찾기</Link></li>
                        <li className="cursor-default">|</li>
                        <li className="hover:text-black"><Link>비밀번호 찾기</Link></li>
                        <li className="cursor-default">|</li>
                        <li className="hover:text-black"><Link to={"/signup"}>회원가입</Link></li>
                    </ul>

                    <span className="w-full my-3 flex items-center">
                        <span className="h-px flex-1 bg-gray-300"></span>

                        <span className="shrink-0 px-4 text-sm text-gray-500 cursor-default">OR</span>

                        <span className="h-px flex-1 bg-gray-300"></span>
                    </span>

                    <button
                        type="button"
                        className={`${input_size} flex justify-center gap-1 items-center rounded bg-[#03c75a] hover:bg-[#02be57] cursor-pointer`}
                        onClick={() => socialLoginHandler('naver')}
                    >
                        <img src="/images/naver.svg" className="-ml-2 w-10 h-10"></img>
                        <span className="text-white font-[NanumSquare] font-medium">네이버 로그인</span>
                    </button>

                    <button
                        type="button"
                        className={`${input_size} flex justify-center gap-3 items-center rounded bg-[#FEE500] hover:bg-yellow-300 cursor-pointer`}
                        onClick={() => socialLoginHandler('kakao')}
                    >
                        <img src="/images/kakao.svg" className="w-6 h-6"></img>
                        <span className="text-black/85 font-[NanumSquare] font-medium">카카오 로그인</span>
                    </button>
                </form>
            </div>
        </>
    )
}

export default LoginPage;