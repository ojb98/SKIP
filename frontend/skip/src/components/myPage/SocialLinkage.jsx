import { useDispatch, useSelector } from "react-redux";
import { button } from "../buttons";
import MyContainer from "./MyContainer"
import { link, unlink } from "../../api/userApi";
import { setProfile } from "../../slices/loginSlice";

const SocialLinkage = () => {
    const profile = useSelector(state => state.loginSlice);

    const dispatch = useDispatch();


    const linkHandler = client => {
        link(client).then(res => {
            
        });
    };

    const unlinkHandler = () => {
        unlink().then(res => {
            dispatch(setProfile());
            alert(res.data);
        });
    };

    return (
        <>
            <MyContainer
                title="계정 연동"
                content={
                    <>
                        <ul className="w-full flex flex-col divide-y divide-gray-200">
                            <li className="flex justify-between items-center p-4">
                                <div className="flex items-center gap-5">
                                    <img src="/images/kakao_link.png" width={60} height={60}></img>

                                    <span className="font-semibold">Kakao</span>
                                </div>

                                {
                                    profile.social == 'NONE'
                                    &&
                                    <button
                                        onClick={() => linkHandler('KAKAO')}
                                        className={button({ color: "warning-outline", className: "w-[110px] h-[45px]" })}
                                    >
                                        연결하기
                                    </button>
                                    ||
                                    profile.social == 'KAKAO'
                                    &&
                                    <button
                                        onClick={unlinkHandler}
                                        className={button({ color: "danger-outline", className: "w-[110px] h-[45px]" })}
                                    >
                                        연결 끊기
                                    </button>
                                    ||
                                    profile.social == 'NAVER'
                                    &&
                                    <button className={button({ color: "inactive", className: "w-[110px] h-[45px]" })}>
                                        연결하기
                                    </button>
                                }
                            </li>

                            <li className="flex justify-between p-4">
                                <div className="flex items-center gap-5">
                                    <img src="/images/naver_link.png" width={60} height={60}></img>

                                    <span className="font-semibold">Naver</span>
                                </div>

                                {
                                    profile.social == 'NONE'
                                    &&
                                    <button
                                        onClick={() => linkHandler('NAVER')}
                                        className={button({ color: "success-outline", className: "w-[110px] h-[45px]" })}
                                    >
                                        연결하기
                                    </button>
                                    ||
                                    profile.social == 'KAKAO'
                                    &&
                                    <button
                                        className={button({ color: "inactive", className: "w-[110px] h-[45px]" })}
                                    >
                                        연결하기
                                    </button>
                                    ||
                                    profile.social == 'NAVER'
                                    &&
                                    <button
                                        onClick={unlinkHandler}
                                        className={button({ color: "danger-outline", className: "w-[110px] h-[45px]" })}
                                    >
                                        연결 끊기
                                    </button>
                                }
                            </li>
                        </ul>
                    </>
                }
            >
            </MyContainer>
        </>
    )
}

export default SocialLinkage;