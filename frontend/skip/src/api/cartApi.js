import axios from "axios";

const host='http://localhost:8080/api/carts';

export const cartListApi = async(userId)=>{
    const data = await axios.get(`${host}/${userId}`).then((res)=>{
        console.log("장바구니 조회==>",res);
        return res.data;
    });
    return data;
} 