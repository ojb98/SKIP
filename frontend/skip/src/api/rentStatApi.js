import axios from "axios";

const host = __APP_BASE__;

export const fetchTopTenRanking = async req => {
    const data = await axios.get(`${host}/api/public/ranking`, {
        params: {
            region: req.region,
            from: req.from,
            to: req.to
        }
    }).then(res => {
        return res.data;
    });

    return data;
};