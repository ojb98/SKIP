import DatePicker from "react-datepicker";
import CustomDateInput from "./CustomDateInput";
import { ko } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { button, radio } from "./buttons";
import { ChevronLeft, ChevronRight } from "lucide-react";


const now = new Date();


const isSameDay = (d1, d2) => {
    return (
        d1 &&
        d2 &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

const isInRange = (start, current, end) => {
    return start < current && current < end;
};

const getDatesBetween = (start, end) => {
    if (start == null || end == null) {
        return [];
    }
    const dates = [];
    const current = new Date(start);
    current.setDate(current.getDate() + 1)

    while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};


const DateRangeSelect = ({ fromState, toState }) => {
    const datepickerRef = useRef();
    const [from, setFrom] = fromState;
    const [to, setTo] = toState;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activeTab, setActiveTab] = useState('start');

    useEffect(() => {
        if (startDate) {
            setActiveTab('end');
        }
    }, [startDate]);

    useEffect(() => {
        if (endDate) {
            setActiveTab('start');
        }
    }, [endDate]);


    const handleSelect = date => {
        if (activeTab == 'start') {
            setStartDate(date);
            if (startDate) {
                setEndDate(null);
            }
        } else {
            if (date < startDate) {
                setStartDate(date);
                setEndDate(null);
            } else {
                setEndDate(date);
                setActiveTab('start');
            }
        }
    };

    const CustomCalendarContainer = ({ children }) => {
        return (
            <>
                <div className="absolute z-0 -left-37.5 -top-21.5">
                    <div className="w-full h-fit z-100 flex flex-col rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.25)] bg-white">
                        <div className="h-25 grid grid-cols-2 gap-4 p-4 bg-gray-50">
                            <label
                                htmlFor="start"
                                className={radio({ className: 'w-full h-full has-checked:border-blue-400 has-checked:text-blue-400 cursor-pointer' })}
                            >
                                <div className="flex flex-col items-center gap-1 font-bold">
                                    <span>대여</span>
                                    <p>날짜를 선택하세요</p>
                                </div>

                                <input
                                    type="radio"
                                    name="date"
                                    id="start"
                                    value="start"
                                    checked={activeTab == 'start'}
                                    onChange={({ target: { value }}) => setActiveTab(value)}
                                    className="sr-only"
                                ></input>
                            </label>

                            <label
                                htmlFor="end"
                                className={radio({ className: 'w-full h-full has-checked:border-blue-400 has-checked:text-blue-400 cursor-pointer' })}
                            >
                                <div className="flex flex-col items-center gap-1 font-bold">
                                    <span>반납</span>
                                    <p>날짜를 선택하세요</p>
                                </div>

                                <input
                                    type="radio"
                                    name="date"
                                    id="end"
                                    value="end"
                                    checked={activeTab == 'end'}
                                    onChange={({ target: { value }}) => setActiveTab(value)}
                                    className="sr-only"
                                ></input>
                            </label>
                        </div>

                        {children}

                        <div className="flex justify-end gap-5 p-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setFrom(null);
                                    setTo(null);
                                    setStartDate(null);
                                    setEndDate(null);
                                    setActiveTab('start');
                                    datepickerRef.current?.setOpen(false);
                                }}
                                className={button({ color: "secondary", className: 'w-20 h-10' })}
                            >
                                취소
                            </button>

                            {
                                (startDate == null || endDate == null)
                                &&
                                <button
                                    type="button"
                                    className={button({ color: "inactive", className: 'w-20 h-10' })}
                                >
                                    적용
                                </button>
                                ||
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFrom(startDate);
                                        setTo(endDate);
                                        datepickerRef.current?.setOpen(false);
                                    }}
                                    className={button({ color: "primary", className: 'w-20 h-10' })}
                                >
                                    적용
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    };

    const renderCustomHeader = ({
        date, changeYear, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled
    }) => {
        return (
            <>
                <h1 className="flex justify-center items-center gap-5 p-5 text-xl font-bold m-3">
                    <button
                        onClick={decreaseMonth}
                        className="cursor-pointer"
                    >
                        <ChevronLeft></ChevronLeft>
                    </button>

                    <span>
                        {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, '0')}.
                    </span>

                    <button
                        onClick={increaseMonth}
                        className="cursor-pointer"
                    >
                        <ChevronRight></ChevronRight>
                    </button>
                </h1>
            </>
        )
    };

    const renderDayContents = (day, date) => {
        const dayOfWeek = date.getDay();
        const isToday = isSameDay(now, date);
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;
        const isDisabled = date.getDate() < now.getDate();
        const isStart = isSameDay(startDate, date);
        const isRange = isInRange(startDate, date, endDate);
        const isEnd = isSameDay(endDate, date);
        let className = "";
        if (isStart || isEnd) {
            className += "text-white font-extrabold";
        } else if (isDisabled) {
            if (isSunday) {
                className += "text-red-200";
            } else if (isSaturday) {
                className += "text-blue-200";
            } else {
                className += "text-gray-300";
            }
        } else {
            if (isSunday) {
                className += "text-red-400";
            } else if (isSaturday) {
                className += "text-blue-400";
            } else if (isRange) {
                className += "text-white";
            }
        }

        return (
            <div className="grid grid-rows-2 gap-1 p-1">
                <span className={className}>{day}</span>
                
                {
                    (isStart && isEnd)
                    &&
                    <span className="text-[0.5em] text-white font-bold">당일</span>
                    ||
                    isStart
                    &&
                    <span className="text-[0.5em] text-white font-bold">대여</span>
                    ||
                    isEnd
                    &&
                    <span className="text-[0.5em] text-white font-bold">반납</span>
                    ||
                    isToday
                    &&
                    <span className="text-[0.5em] text-blue-400 font-bold">오늘</span>
                }
            </div>
        )
    };

    return (
        <>
            <div>
                <DatePicker
                    ref={datepickerRef}
                    locale={ko}
                    dateFormat="MM.dd.eee"
                    minDate={now}
                    onSelect={handleSelect}
                    shouldCloseOnSelect={false}
                    customInput={<CustomDateInput from={from} to={to}></CustomDateInput>}
                    calendarContainer={CustomCalendarContainer}
                    renderCustomHeader={renderCustomHeader}
                    renderDayContents={renderDayContents}
                    highlightDates={[
                        {
                            "custom-range-start": [startDate]
                        },
                        {
                            "custom-in-range": getDatesBetween(startDate, endDate)
                        },
                        {
                            
                            "custom-range-end": [endDate]
                        }
                    ]}
                    className="text-blue-400"
                ></DatePicker>
            </div>
        </>
    )
};

export default DateRangeSelect;