import axios from "axios";

const host = 'http://localhost:8080/api/wishes';

export const addWishApi = async (userId, itemDetailId) => {
    const res = await axios.post(`${host}`, {
        userId,
        itemDetailId,
    });
    return res.data;
};

export const wishListApi = async(userId) => {
    const data = await axios.get(`${host}/${userId}`).then(res=>{
        console.log("찜 목록 ==>", res);
        return res.data;
    });
    return data;
}

export const removeWishApi = async (wishlistId) => {
    const data = await axios.delete(`${host}/${wishlistId}`).then(res=>{
        console.log("찜 삭제 ==>", res);
        return res.data;
    });
    return data;
}

