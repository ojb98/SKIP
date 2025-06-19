import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { rentListApi } from "../../api/rentListApi";

const ItemSelectorByRent = () => {
    const [rents, setRents] = useState([]);

    // 유저 정보에서 userId 가져오기
    const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);


    //처음 랜더링할때, 가맹점 목록 불러오기
    useEffect(() => {
        if(profile.userId) {
            rentListApi(profile.userId)  //가맹점 리스트 API호출
            .then(response => setRents(response))
            .catch(err => console.error("렌탈샵 목록 불러오기 실패", err));
        }
    }, [profile.userId]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">가맹점별 장비 목록</h1>
            {rents.length === 0 ? (
                <div>
                    <h2 className="text-center text-[20px] text-gray-600 mt-2">등록된 가맹점이 없습니다.</h2>
                    <Link to="/rentAdmin/insert"
                        className="inline-block mt-4 px-5 py-2 border border-blue-500 text-blue-500 font-semibold rounded hover:bg-blue-500 hover:text-white transition">
                            가맹점 등록하러 가기</Link>
                </div>
            ) : (
            <table className="w-full border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">상호명</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">장비목록</th>
                    </tr>
            </thead>
            <tbody>
                {
                    rents.map(rent => (
                    <tr key={rent.rentId} className="hover:bg-gray-50 cursor-pointer">
                        <td className="border border-gray-300 px-4 py-2">{rent.name}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <Link to={`/rentAdmin/item/list/${rent.rentId}`} className="text-blue-600 hover:underline">
                                보기
                            </Link>
                        </td>
                    </tr>
                    ))
                }
                </tbody>
            </table>
        )}
        </div>
    )
}
export default ItemSelectorByRent;