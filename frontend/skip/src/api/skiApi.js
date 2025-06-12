import axios from "axios";
import caxios from "./caxios";

const host = import.meta.env.VITE_BACKEND_HOST_URL;

export const skiListWithCoordinates = async () => {
    const data = await axios.get(`${host}/ski/location`).then(res => {
        return res.data;
    });

    return data;
};

export const getForecast = async ({ lat, lon }) => {
    const data = await axios.get(`${host}/ski/forecast`, {
        params: {
            lat: lat,
            lon: lon
        }
    }).then(res => {
        return res.data;
    });

    return data;
};