
import axios from "axios";
import caxios from "./caxios";

const host = `/api/wishes';

export const addWishApi = async (userId, itemDetailId) => {
    const res = await caxios.post(`${host}`, {
        userId,
        itemDetailId,
    });
    return res.data;
};

export const wishListApi = async(userId) => {
    const data = await caxios.get(`${host}/${userId}`).then(res=>{
        console.log("찜 목록 ==>", res);
        return res.data;
    });
    return data;
}

export const removeWishApi = async (wishlistId,useYn) => {
    const data = await caxios.patch(`${host}/${wishlistId}?useYn=${useYn}`).then(res=>{
        console.log("찜 삭제 ==>", res);
        return res.data;
    });
    return data;
}
