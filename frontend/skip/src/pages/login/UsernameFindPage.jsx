import { Ban } from "lucide-react";
import { button } from "../../components/buttons";
import { inputText } from "../../components/inputs";
import IdPasswordFindTab from "../../components/login/IdPasswordFindTab";
import { useRef, useState } from "react";
import { findUsername } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const UsernameFindPage = () => {
    const email = useRef();

    const [emailStatus, setEmailStatus] = useState('initial') // initial, sending

    const [emailErrors, setEmailErrors] = useState([]);

    const navigate = useNavigate();


    const sendHandler = () => {
        setEmailStatus('sending');

        findUsername(email.current.value).then(res => {
            if (res.success) {
                navigate('/id/find/success', { state: { email: email.current.value } });
            } else {
                setEmailStatus('initial');
                setEmailErrors(res.data);
            }
        });
    };

    return (
        <>
            <div className="space-y-10">
                <IdPasswordFindTab active={'id'}></IdPasswordFindTab>

                <p className="text-xs text-gray-500 font-[NanumSquare]">* 이메일을 기입하시면 가입된 아이디를 전송해드릴게요.</p>

                <div>
                    <input
                        placeholder="이메일"
                        ref={email}
                        className={inputText({ className: 'w-full h-[50px]' })}
                    ></input>

                    {
                        emailErrors.map((err, index) => {
                            return (
                                <p key={index} className="my-1 text-xs text-red-400"><Ban width={12} height={12} className="inline"></Ban> <span className="align-middle">{err}</span></p>
                            )
                        })
                    }
                </div>

                {
                    emailStatus == 'initial'
                    &&
                    <button
                        onClick={sendHandler}
                        className={button({ color: "primary", className: 'w-full h-[50px]' })}
                    >전송하기</button>
                    ||
                    <button
                        className={button({ color: "primary-not-interactive", className: 'w-full h-[50px] flex justify-center items-center' })}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" fill="#FFFFFF" opacity=".30"/>
                            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="#FFFFFF" className="spinner_ajPY"/>
                        </svg>
                    </button>
                }
            </div>
        </>
    )
};

export default UsernameFindPage;