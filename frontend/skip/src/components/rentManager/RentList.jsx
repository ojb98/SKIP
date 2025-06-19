import { useEffect, useState } from "react";
import { rentListApi, rentDetailApi, rentDelApi } from "../../api/rentListApi";
import { Link } from "react-router-dom";
import '../../css/rentList.css';
import { useSelector } from "react-redux";

const RentList = () => {
    const profile = useSelector(state => state.loginSlice);
    const [rent, setRent] = useState([]);
    const [selectedRentId, setSelectedRentId] = useState(null);
    const [rentDetail, setRentDetail] = useState(null);

    // 렌트 리스트 가져오기
    const getRentList = () => {
        rentListApi(profile.userId).then(data => {
            setRent([...data]);
        });
    };

    useEffect(() => {
        getRentList();
    }, []);

    // 상세 정보 가져오기
    useEffect(() => {
        if (selectedRentId) {
            rentDetailApi(selectedRentId).then(data => {
                setRentDetail({ ...data });
            });
        }
    }, [selectedRentId]);

    const deleteRent = (rentId) => {
        const checkDel = window.confirm("정말로 탈퇴하시겠습니까?");
        if (checkDel) {
            rentDelApi(rentId).then(() => {
                setSelectedRentId(null);
                setRentDetail(null);
                getRentList();
            });
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "PENDING":
                return "대기";
            case "APPROVED":
                return "승인완료";
            case "WITHDRAWN":
                return "반려";
            default:
                return status;
        }
    };

    return (
        <div className="rent-list-container">
            <h1 className="top-subject">가맹점 리스트</h1>

            {rent.length === 0 ? (
                <h1 className="sub-subject">현재 등록된 가맹점이 없습니다.</h1>
            ) : (
                <table className="list-table">
                    <thead className="list-thead">
                        <tr>
                            <th>번호</th><th>썸네일</th><th>상호명</th><th>전화번호</th><th>주소</th><th>승인상태</th><th>등록일</th>
                            <th>장비등록</th><th>탈퇴</th>
                        </tr>
                    </thead>
                    <tbody className="list-tbody">
                        {rent.map((r, index) => (
                            <tr key={r.rentId} onClick={() => setSelectedRentId(r.rentId)} className="clickable-row">
                                <td>{index + 1}</td>
                                <td><img className="rent-img" src={`http://localhost:8080${r.thumbnail}`} /></td>
                                <td>{r.name}</td>
                                <td>{r.phone}</td>
                                <td>{r.streetAddress}</td>
                                <td>{getStatusLabel(r.status)}</td>
                                <td>{r.createdAt}</td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    {r.status === "APPROVED" ? (
                                        <Link to={`/rentAdmin/item/insert/${r.rentId}`} className="register-btn">등록</Link>
                                    ) : (
                                        <button className="register-btn-disabled" disabled>등록</button>
                                    )}
                                </td>
                                <td onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRent(r.rentId);
                                }}>
                                    <button className="delete-btn">탈퇴</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 상세 정보 출력 영역 */}
            {rentDetail && (
                <div className="rent-detail-container" style={{ marginTop: "40px" }}>
                    <table className="detail-table">
                        <tbody className="detail-tbody">
                            <tr><th>사업자등록번호</th><td>{rentDetail.bizRegNumber}</td></tr>
                            <tr><th>카테고리</th><td>{rentDetail.category}</td></tr>
                            <tr><th>상호명</th><td>{rentDetail.name}</td></tr>
                            <tr><th>전화번호</th><td>{rentDetail.phone}</td></tr>
                            <tr><th>지번 주소</th><td>{rentDetail.basicAddress}</td></tr>
                            <tr><th>도로명 주소</th><td>{rentDetail.streetAddress}</td></tr>
                            <tr><th>상세주소</th><td>{rentDetail.detailedAddress}</td></tr>
                            <tr><th>썸네일</th><td><img src={`http://localhost:8080${rentDetail.thumbnail}`} /></td></tr>
                            {rentDetail.image1 && <tr><th>이미지1</th><td><img src={`http://localhost:8080${rentDetail.image1}`} /></td></tr>}
                            {rentDetail.image2 && <tr><th>이미지2</th><td><img src={`http://localhost:8080${rentDetail.image2}`} /></td></tr>}
                            {rentDetail.image3 && <tr><th>이미지3</th><td><img src={`http://localhost:8080${rentDetail.image3}`} /></td></tr>}
                            <tr><th>소개 및 설명</th><td>{rentDetail.description}</td></tr>
                            <tr><th>등록일</th><td>{rentDetail.createdAt}</td></tr>
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/rentAdmin/update/${rentDetail.rentId}`; 
                            }}
                            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            수정
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RentList;
