import axios from "axios";
import caxios from "./caxios";

const host='${}/api/carts';

export const addCartItemApi = async (userId, cartItemData) => {
	return caxios.post(`${host}/${userId}`, cartItemData)
		.then((res) => {
		console.log("장바구니 추가 ==>", res);
		return res.data;
		})
		.catch((err) => {
		console.error("장바구니 추가 실패", err);
		});
}

export const cartListApi = async(userId)=>{
    const data = await caxios.get(`${host}/${userId}`).then((res)=>{
        console.log("장바구니 조회 ==>",res);
        return res.data;
    });
    return data;
} 

export const removeCartItemApi = async (cartIds) => {
    try {
        const res = await caxios.delete(`${host}`, {
            data: { cartIds: cartIds } // DELETE 요청은 data에 body를 담아야 함
        });
        console.log("장바구니 삭제 ==>", res);
        return res.data;
    } catch (err) {
        console.error("장바구니 삭제 실패", err);
        throw err;
    }
};

export const updateCartItemApi = async(cartId, quantity) => {
    const data = await caxios.patch(`${host}/${cartId}`,{ 
        quantity : quantity
        })
        .then((res)=>{
        console.log("장바구니 수정 ==>",res);
        return res.data;
    });
    return data;
}