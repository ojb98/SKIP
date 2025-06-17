import axios from "axios";
import caxios from "./caxios";

const host = __APP_BASE__;

export const listOrderedBanner = async () => {
    const data = await caxios.get(`${host}/api/banners/list/order`).then(res => {
        return res.data;
    });

    return data;
};

export const click = async req => {
    const data = await caxios.patch(`${host}/api/banners/${req}/click`).then(res => {
        return res.data;
    });

    return data;
}