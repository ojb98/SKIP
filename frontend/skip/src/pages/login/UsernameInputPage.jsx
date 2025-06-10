import { useRef, useState } from "react";
import IdPasswordFindTab from "../../components/login/IdPasswordFindTab";
import { inputText } from "../../components/inputs";
import { button } from "../../components/buttons";
import { isUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { Ban } from "lucide-react";

const UsernameInputPage = () => {
    const username = useRef();

    const [usernameError, setUsernameError] = useState();

    const navigate = useNavigate();


    const usernameSearchHandler = () => {
        isUser(username.current.value).then(res => {
            if (res) {
                navigate('/password/reset', { state: { username: username.current.value } });
            } else {
                setUsernameError('존재하지 않는 아이디입니다.');
            }
        });
    };

    return (
        <>
            <div className="space-y-10">
                <IdPasswordFindTab active={'pwd'}></IdPasswordFindTab>

                <div>
                    <input
                        placeholder="아이디"
                        ref={username}
                        className={inputText({ className: 'w-full h-[50px]' })}
                    ></input>

                    {
                        usernameError
                        &&
                        <p className="flex items-center gap-1 my-1 text-xs text-red-400"><Ban width={12} height={12}></Ban>{usernameError}</p>
                    }
                </div>

                <button
                    onClick={usernameSearchHandler}
                    className={button({ color: "primary", className: 'w-full h-[50px]' })}
                >재설정하기</button>
            </div>
        </>
    )
};

export default UsernameInputPage;