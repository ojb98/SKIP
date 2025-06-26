
import { useEffect, useState } from "react";
import { rentDetailApi } from "../../api/rentListApi";
import { useNavigate, useParams } from "react-router-dom";
// import '../../css/rentDetail.css';

const RentDetail=()=>{

    //<Route path="/rentAdmin/detail/:rentId" element={<RentDetail/>}></Route>
    const {rentId} = useParams(); 
    const [rentDetail, setRentDetail] = useState(null);
    const navigate = useNavigate();


    //렌트샵 상세 정보 가져오기
    useEffect(()=>{
        rentDetailApi(rentId).then(data=>{
            console.log("렌탈상세정보===>",data);
            setRentDetail({...data});
        });
    },[rentId]); //rentId가 변경되면 다시 실행

    // null일 경우 로딩 메시지
    if (!rentDetail) {
        return <div>로딩 중입니다...</div>;
    }

    return(
        <div className="rent-detail-container">
            <h1 className="top-subject">가맹점 상세정보</h1>
            <div className="button-div">
                <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={()=> navigate(`/rentAdmin/update/${rentId}`)}>수정</button>
            </div>
            <table className="detail-table">
                <tbody className="detail-tbody">
                    <tr>
                        <th>사업자등록번호</th>
                        <td>{rentDetail.bizRegNumber}</td>
                    </tr>
                    <tr>
                        <th>카테고리</th>
                        <td>{rentDetail.category}</td>
                    </tr>
                    <tr>
                        <th>상호명</th>
                        <td>{rentDetail.name}</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>{rentDetail.phone}</td>
                    </tr>
                    <tr>
                        <th>지번 주소</th>
                        <td>{rentDetail.basicAddress}</td>
                    </tr>
                    <tr>
                        <th>도로명 주소</th>
                        <td>{rentDetail.streetAddress}</td>
                    </tr>
                    <tr>
                        <th>상세주소</th>
                        <td>{rentDetail.detailedAddress}</td>
                    </tr>
                    <tr>
                        <th>썸네일</th>
                        <td><img src={`${__APP_BASE____}${rentDetail.thumbnail}`} /></td>
                    </tr>
                    {rentDetail.image1 && (
                        <tr>
                            <th>이미지1</th>
                            <td><img src={`${__APP_BASE__}${rentDetail.image1}`} /></td>
                        </tr>
                    )}
                    {rentDetail.image2 && (
                        <tr>
                            <th>이미지2</th>
                            <td><img src={`http://localhost:8080${rentDetail.image2}`} /></td>
                        </tr>
                    )}
                    {rentDetail.image3 && (
                        <tr>
                            <th>이미지3</th>
                            <td><img src={`http://localhost:8080${rentDetail.image3}`} /></td>
                        </tr>
                    )}
                    <tr>
                        <th>소개 및 설명</th>
                        <td>{rentDetail.description}</td>
                    </tr>
                    <tr>
                        <th>등록일</th>
                        <td>{rentDetail.createdAt}</td>
                    </tr>
                    

                </tbody>

            </table>

        </div>
    )
}
export default RentDetail;