import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import React from "react";

const CustomDateInput = React.forwardRef(({ value, onClick, from, to }, ref) => {
    const range = from && to ? `${format(from, 'MM.dd.eee', { locale: ko })} - ${format(to, 'MM.dd.eee', { locale: ko })}` : null;


    return (
        <button
            type="button"
            onClick={onClick}
            ref={ref}
            className="w-75 h-13 flex justify-between items-center px-5 bg-gray-100/90 rounded-md text-sm text-gray-600 cursor-pointer"
        >
            <span>{range || '예약 일정을 선택하세요'}</span>

            <CalendarDays size={18}></CalendarDays>
        </button>
    )
});

export default CustomDateInput;