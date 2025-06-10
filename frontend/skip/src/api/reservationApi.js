import axios from "axios";

const host='http://localhost:8080/api/reservations';


export const cartListApi = async(rentId)=>{
    const data = await axios.get(`${host}/${rentId}`).then((res)=>{
        console.log("예약 리스트 ==>",res);
        return res.data;
    });
    return data;
} 