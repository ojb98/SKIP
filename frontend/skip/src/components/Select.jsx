import { useRef, useState } from "react";
import { select } from "./inputs";

const Select = ({ selectRef, options, onChange, className }) => {
    const [open, setOpen] = useState(false);


    return (
        <>
            <div className="w-fit relative">
                <select
                    id="real-select"
                    ref={selectRef}
                    onClick={() => setOpen(prev => !prev)}
                    onBlur={() => setOpen(false)}
                    onChange={onChange}
                    className={select({ className: className + ' pl-3' })}
                >
                    {
                        options.map((option, index) => {
                            return (
                                <option key={index} value={option.value}>{option.title}</option>
                            )
                        })
                    }
                </select>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={"size-5 absolute right-3 top-1/2 -translate-y-1/2 transition duration-300 pointer-events-none " + (open ? "rotate-180" : "rotate-0")}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
            </div>
        </>
    )
};

export default Select;