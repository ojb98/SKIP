import { useState } from "react";
import PaymentSearchFilter from "../../components/myPage/PaymentSearchFilter";
import MyContainer from "../../components/myPage/MyContainer";
import Pagination from "../../components/myPage/Pagination";

const MyReservePage = () => {
    const [reservations, setReservations] = useState([]);


    return (
        <>
            <h1 className="text-3xl font-bold mb-5">예약 목록</h1>

            <span className="w-full my-3 flex items-center">
                <span className="h-px flex-1 bg-gray-300"></span>
            </span>

            <PaymentSearchFilter></PaymentSearchFilter>

            <ul className="my-10">
                <MyContainer></MyContainer>
            </ul>

            <Pagination></Pagination>
        </>
    )
};

export default MyReservePage;