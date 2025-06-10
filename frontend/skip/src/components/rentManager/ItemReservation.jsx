import { useState } from "react";

const ItemReservation=()=>{

    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        // 예약 목록을 API로부터 가져오는 코드
        fetch('/api/reservations')
        .then(response => response.json())
        .then(data => setReservations(data))
        .catch(error => console.error('예약 목록 로딩 실패:', error));
    }, []);


    return(
        <>
            <h1>예약리스트</h1>
            <div>
                
            </div>
        </>
    )
}
export default ItemReservation;