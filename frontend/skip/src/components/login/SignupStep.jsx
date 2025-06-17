const SignupStep = ({step, setStep}) => {
    return (
        <>
            <div>
                    <ol className="relative z-10 flex justify-between text-[10px]/6 font-bold text-gray-500 cursor-default">
                        <li className="flex items-center gap-2 bg-white p-2">
                            <span
                                onClick={() => setStep(1)}
                                className={"size-6 rounded-full text-center cursor-pointer " + (step === 1 ? "bg-blue-400 text-white" : "bg-gray-100")}
                            >1</span>
                        </li>

                        <li className="flex items-center gap-2 bg-white p-2">
                            <span
                                onClick={() => setStep(2)}
                                className={"size-6 rounded-full text-center cursor-pointer " + (step === 2 ? "bg-blue-400 text-white" : "bg-gray-100")}
                            >2</span>
                        </li>
                    </ol>
            </div>
        </>
    )
}

export default SignupStep;