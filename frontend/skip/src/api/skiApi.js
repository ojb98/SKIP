import axios from "axios";
import caxios from "./caxios";

const host = __APP_BASE__;

export const skiListWithCoordinates = async () => {
    const data = await caxios.get(`${host}/ski/location`).then(res => {
        return res.data;
    });

    return data;
};

export const getForecast = async ({ lat, lon }) => {
    const data = await caxios.get(`${host}/ski/forecast`, {
        params: {
            lat: lat,
            lon: lon
        }
    }).then(res => {
        return res.data;
    });

    return data;
};