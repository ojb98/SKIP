import axios from "axios";

const host = __APP_BASE__;

export const listOrderedBanner = async () => {
    const data = await axios.get(`${host}/api/banners/list/order`).then(res => {
        return res.data;
    });

    return data;
};