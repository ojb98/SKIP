import axios from "axios";

const host='http://localhost:8080/api/reservations';

// 예약 생성 API (Reservation + ReservationItem 포함)
export const createReservationApi = async(reservationData) => {
    const data = await axios.post(`${host}`, reservationData).then(res => {
        console.log("예약 생성 Api ==>",res);
        return res.data;
    });
    return data;
}

