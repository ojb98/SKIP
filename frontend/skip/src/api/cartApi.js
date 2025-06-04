import axios from "axios";

const host='http://localhost:8080/api/carts';

export const addCartItemApi = async (userId, cartItemData) => {
  return axios.post(`${host}/${userId}`, cartItemData)
    .then((res) => {
      console.log("장바구니 추가 ==>", res);
      return res.data;
    })
    .catch((err) => {
      console.error("장바구니 추가 실패", err);
    });
}


export const cartListApi = async(userId)=>{
    const data = await axios.get(`${host}/${userId}`).then((res)=>{
        console.log("장바구니 조회==>",res);
        return res.data;
    });
    return data;
} 


