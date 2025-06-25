import axios from "axios";
import caxios from "./caxios";

const host='`${__APP_BASE__}/api/rents';

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

export const rentSlideApi = async(rentId)=>{
    const data = await axios.get(`${host}/slide/${rentId}`).then(res=>{
        console.log("단건 렌탈샵 조회==>",res);
        return res.data;
    });
    return data;
}


export const rentIdAndNameApi = async(userId)=>{
    const data = await caxios.get(`${host}/owned/${userId}`).then((res)=>{
        console.log("렌탈id,name 조회==>",res);
        return res.data;
    });
    return data;
} 


export const rentNameApi = async (rentId) => {
  const data  = await caxios.get(`${host}/name/${rentId}`).then((res)=>{
        console.log("렌탈name 조회==>",res);
        return res.data;
    });
    return data;
};


export const fetchRegions = async () => {
    const data = await axios.get(`${host}/regions`).then(res => {
        return res.data;
    });

    return data;
};

export const fetchAutocomplete = async req => {
    const data = await axios.get(`${host}/autocomplete`, { params: { keyword: req } }).then(res => {
        return res.data;
    });

    return data;
};

export const fetchItemCategories = async () => {
    const data = await axios.get(`${host}/categories`).then(res => {
        return res.data;
    });

    return data;
};

export const fetchSearchResult = async req => {
    const data = await axios.post(`${host}/search`, req).then(res => {
        return res.data;
    });

    return data;
};