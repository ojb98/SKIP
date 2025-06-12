import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getForecast } from "../api/skiApi";

const days = ['일', '월', '화', '수', '목', '금', '토'];

export const fetchForecast = createAsyncThunk('forecast/fetchForecast', async ({ rentId, lat, lon }, thunkApi) => {
    try {
        const res = await getForecast({
            lat: lat,
            lon: lon
        }).then(res => {
            return res;
        });

        if (res.success) {
            const list = res.data.list;

            // return {
            //     rentId: rentId,
            //     list: res.data.list
            // };

            const now = new Date();

            let date = new Date(list[0].dt_txt);
            let minIdx = 0;
            let minDif = Math.abs(date - now);
            for (let i = 0; i < 8; i++) {
                date = new Date(list[i].dt_txt);
                const dif = Math.abs(date - now);
                if (dif < minDif) {
                    minIdx = i;
                    minDif = dif;
                }
            }

            const items = [
                {
                    date: now.getDate(),
                    day: days[now.getDay()],
                    time: 'Now',
                    temp: `${list[0].main.temp}°`,
                    desc: list[0].weather[0].description,
                    feel: `${list[0].main.feels_like}°`,
                    humidity: `${list[0].main.humidity}%`,
                    wind: `${list[0].wind.speed}m/s`,
                    rain: (list[0].rain?.["3h"] ? `${list[0].rain["3h"]}mm/h` : 'X'),
                    cloud: `${list[0].clouds.all}%`,
                    snow: (list[0].snow?.["3h"] ? `${list[0].snow["3h"]}mm/h` : 'X'),
                    src: `/images/weather_icon/${list[0].weather[0].icon}.png`
                }
            ];

            // 내일 6시 부터 예보를 받아오기 위한 오프셋
            let offset;
            for (let i = 2; i < 11; i++) {
                if (new Date(list[i].dt_txt).getHours() === 6) {
                    offset = i - 4; // 밑 for 문에서 i가 1부터 시작하기 때문에 i - 4를 저장
                    break;
                }
            }

            for (let i = 1; i < 9; i++) {            
                const list_idx = offset + 4 * i;
                const date = new Date(list[list_idx].dt_txt);
                let time;
                if (list[list_idx].sys.pod == 'd') {
                    time = '6 AM';
                } else {
                    time = '6 PM';
                }

                items.push({
                    date: date.getDate(),
                    day: days[date.getDay()],
                    time: time,
                    temp: `${list[list_idx].main.temp}°`,
                    desc: list[list_idx].weather[0].description,
                    feel: `${list[list_idx].main.feels_like}°`,
                    humidity: `${list[list_idx].main.humidity}%`,
                    wind: `${list[list_idx].wind.speed}m/s`,
                    rain: (list[list_idx].rain?.["3h"] ? `${list[list_idx].rain["3h"]}mm/h` : 'X'),
                    cloud: `${list[0].clouds.all}%`,
                    snow: (list[list_idx].snow?.["3h"] ? `${list[list_idx].snow["3h"]}mm/h` : 'X'),
                    src: `/images/weather_icon/${list[list_idx].weather[0].icon}.png`
                });
            }

            return {
                rentId: rentId,
                items: items
            };

        } else {
            return thunkApi.rejectWithValue({ rentId: rentId, error: res.data });
        }
    } catch (err) {
        return thunkApi.rejectWithValue({ rentId, error: err.message });
    }
});

export const forecastsSlice = createSlice({
    name: 'forecastsSlice',
    initialState: {},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchForecast.fulfilled, (state, action) => {
                const payload = action.payload;
                state[payload.rentId] = action.payload.items;
            })
            .addCase(fetchForecast.pending, (state, action) => {
                state
            })
            .addCase(fetchForecast.rejected, (state, action) => {
                const { rentId, error } = action.payload;
                state[rentId] = { error: error };
            });
    }
});

export default forecastsSlice.reducer;