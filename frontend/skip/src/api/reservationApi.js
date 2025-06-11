import axios from "axios";

const host='http://localhost:8080/api/reservations';


export const reservListApi = async(userId)=>{
    const data = await axios.get(`${host}/${userId}`).then((res)=>{
        console.log("예약 리스트 ==>",res);
        return res.data;
    });
    return data;
} 

export const reservDetailApi = async(reserveId)=>{
    const data = await axios.get(`${host}/detail/${reserveId}`).then((res)=>{
        console.log("예약상세 ==>",res);
        return res.data;
    });
    return data;
}