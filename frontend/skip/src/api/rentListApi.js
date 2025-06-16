import axios from "axios";
import caxios from "./caxios";

const host='http://localhost:8080/api/rents';

export const rentListApi = async(userId)=>{
    const data = await caxios.get(`${host}/user/${userId}`).then((res)=>{
        console.log("렌탈목록 조회==>",res);
        return res.data;
    });
    return data;
} 

export const rentDelApi = async(rentId)=>{
    const data = await caxios.patch(`${host}/${rentId}`).then(res=>{
        console.log("렌탈샵 삭제 ==>", res);
        return res.data;
    });
    return data;
}

export const rentDetailApi = async(rentId)=>{
    const data = await caxios.get(`${host}/${rentId}`).then(res=>{
        console.log("단건 렌탈샵 조회==>",res);
        return res.data;
    });
    return data;
}


export const rentIdAndNameApi = async(userId)=>{
    const data = await caxios.get(`${host}/owned/${userId}`).then((res)=>{
        console.log("렌탈목록 조회==>",res);
        return res.data;
    });
    return data;
} 
