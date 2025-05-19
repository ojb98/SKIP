import SignupStep from "../components/SignupStep";

const JoinPage = () => {
    return (
        <>
            <div className="w-[400px]">
                <form className="flex flex-col items-center gap-5">
                    <div className="w-full flex justify-between border-b-[1px] pb-3">
                        <h1 className="text-2xl">회원가입</h1>

                        <SignupStep step={2}></SignupStep>
                    </div>

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

                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        className="h-[50px] mt-0.5 w-full rounded border-[1px] border-gray-200 text-sm indent-2"
                    ></input>

                    <input
                        type="text"
                        placeholder="이메일"
                        className="h-[50px] mt-0.5 w-full rounded border-[1px] border-gray-200 text-sm indent-2"
                    ></input>

                    <input
                        type="text"
                        placeholder="이름"
                        className="h-[50px] mt-0.5 w-full rounded border-[1px] border-gray-200 text-sm indent-2"
                    ></input>

                    <input
                        type="text"
                        placeholder="전화번호"
                        className="h-[50px] mt-0.5 w-full rounded border-[1px] border-gray-200 text-sm indent-2"
                    ></input>

                    <input
                        type="submit"
                        className="h-[50px] w-full rounded border border-blue-400 bg-blue-400 text-sm font-medium text-white hover:bg-blue-500 hover:border-blue-500 cursor-pointer"
                        value="회원가입"
                    ></input>
                </form>
            </div>
        </>
    )
}

export default JoinPage;