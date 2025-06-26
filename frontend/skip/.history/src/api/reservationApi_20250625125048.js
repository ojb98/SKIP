import axios from "axios";
import caxios from "./caxios";

const host=`__APP_basc/api/reservations`;


// 1. 예약 목록 조회
export const reservListApi = async (userId, filters = {}) => {
    const params = {
        ...filters,
        rentStart: filters.rentStart ? `${filters.rentStart}T00:00:00` : undefined,
        rentEnd: filters.rentEnd ? `${filters.rentEnd}T23:59:59` : undefined,
    }

    if (filters.keyword) {
        params.keyword = filters.keyword;
    }

    const { data } = await caxios.get(`${host}/manager/${userId}`, {
        params,
    })

    return data;
}

// 2. 예약 상세 조회
export const reservDetailApi = async (rentItemId) => {
    const { data } = await caxios.get(`${host}/detail/${rentItemId}`);
    return data;
}

// 3. 예약 반납처리
export const reservItemReturnApi = async(rentItemId)=>{
    const data = await caxios.patch(`${host}/${rentItemId}/return`).then((res)=>{
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