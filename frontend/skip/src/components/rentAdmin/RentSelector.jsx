import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { rentListApi } from "../../api/rentListApi";

const RentSelector = () => {
  const [rents, setRents] = useState([]);

  // 유저 정보에서 userId 가져오기
  const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);

  useEffect(() => {
    if(profile.userId) {
        rentListApi(profile.userId)
        .then(setRents)
        .catch(err => console.error("렌탈샵 목록 불러오기 실패", err));
    }
  }, [profile.userId]);


    return (
        <div>
            <h1>장비 목록</h1>
            {rents.length === 0 ? (
                <>
                    <h1>해당 렌탈샵 장비목록을 선택하세요</h1>
                    <p>등록된 렌탈샵이 없습니다.</p>
                </>
            ) : (
                <ul>
                {rents.map(rent => (
                    <li key={rent.rentId}>
                    <Link to={`/itemAdmin/list/${rent.rentId}`}>
                        {rent.name} -  보기
                    </Link>
                    </li>
                ))}
                </ul>
            )}
        </div>
    )
}
export default RentSelector;