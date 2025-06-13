import axios from "axios";

const host='http://localhost:8080/api/reservations';


export const reservListApi = async (adminId, filters = {}) => {
  const params = new URLSearchParams({ adminId, ...filters }).toString();
  const { data } = await axios.get(`${host}?${params}`);
  return data;
};


export const reservItemReturnApi = async(rentItemId)=>{
    const data = await axios.patch(`${host}/${rentItemId}/return`).then((res)=>{
        console.log("예약 반납 ==>",res);
        return res.data;
    });
    return data;
}

