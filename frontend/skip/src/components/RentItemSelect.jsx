import { ShoppingBasket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchItemCategories } from "../api/rentListApi";
import { button, radio } from "./buttons";

const RentItemSelect = ({ selectedCategoriesState }) => {
    const categorySelectRef = useRef();

    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = selectedCategoriesState;

    useEffect(() => {
        fetchItemCategories().then(res => {
            if (res.success) {
                setCategories(res.data);
            }
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = e => {
            if (categorySelectRef.current && !categorySelectRef.current.contains(e.target)) {
                setShowCategories(false);
            }
        };

        if (showCategories) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, [showCategories]);


    return (
        <>
            <div ref={categorySelectRef} className="relative -z-1">
                <div
                    onClick={() => setShowCategories(true)}
                    className="w-70 h-full flex justify-between items-center px-5 bg-gray-100/90 rounded-md text-sm text-gray-600 cursor-pointer"
                >
                    <p>{selectedCategories.length > 0 ? selectedCategories.map(item => item.displayName).join(', ') : "장비를 선택하세요"}</p>

                    <ShoppingBasket size={18}></ShoppingBasket>
                </div>

                {
                    showCategories
                    &&
                    <div className="w-full h-fit absolute top-0 divide-y divide-gray-200 rounded-md bg-white shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                        <h1 className="flex justify-center items-center p-5 font-bold">장비 종류</h1>

                        <ul className="grid grid-cols-2 grid-flow-row gap-2 p-5">
                            {
                                categories.map(c => (
                                    <li key={c.value}>
                                        <label className={radio({ className: 'w-full h-10 text-sm font-semibold' })}>
                                            <span>{c.displayName}</span>

                                            <input
                                                type="checkbox"
                                                defaultChecked={selectedCategories.map(item => item.value).includes(c.value)}
                                                onChange={( { target: { checked } }) => setSelectedCategories(prev => checked ? [...prev, { value: c.value, displayName: c.displayName }] : prev.filter(item => item.value != c.value))}
                                                className="sr-only"
                                            ></input>
                                        </label>
                                    </li>
                                ))
                            }
                        </ul>

                        <div className="flex justify-center items-center gap-5 p-5">
                            <button
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setShowCategories(false);
                                }}
                                className={button({ color: "secondary", className: 'w-20 h-10' })}
                            >
                                취소
                            </button>

                            <button
                                onClick={() => {
                                    setShowCategories(false);
                                }}
                                className={button({ color: "primary", className: 'w-20 h-10' })}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                }
            </div>
        </>
    )
};

export default RentItemSelect;