import axios from "axios";
import caxios from "./caxios";

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
};

// 마이페이지 예약 목록 불러오기
export const searchReservations = async req => {
    console.log(req);
    const data = await caxios.get(`${host}/search`, {params: {
        from: req.from,
        to: req.to,
        status: req.status,
        searchOption: req.searchOption,
        searchKeyword: req.searchKeyword,
        page: req.page
    }}).then(res => {
        return res.data;
    });

    return data;
};