import { useEffect, useState } from "react";
import { rentListApi } from "../../api/rentListApi";
import { Link, useNavigate } from "react-router-dom";
import { rentDelApi } from "../../api/rentListApi";
import '../../css/rentList.css';
import { useSelector } from "react-redux";


const RentList=()=>{

    //userId값 꺼내오기
    const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);

    const [rent,setRent] = useState([]);

    const navigate = useNavigate(); 


    //렌트샵 목록 불러오기
    const getRentList=()=>{
        //userId값 넣어주기
        rentListApi(profile.userId).then(data=>{
            setRent([...data]);
        })
    }

    useEffect(()=>{
        getRentList();
    },[])

    
    //렌트샵 삭제
    const deleteRent=(rentId)=>{
        const checkDel = window.confirm("정말로 탈퇴하시겠습니까?");

        if(checkDel){
            rentDelApi(rentId).then(()=>{
                getRentList();
            })
        }
    }

    const getStatusLabel=(status)=>{
        switch(status){
            case "PENDING":
                return "대기";
            case "APPROVED":
                return "승인완료";
            case "WITHDRAWN":
                return "반려";
        }
    }

    return(
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
                    {
                        rent.map((r,index)=>{
                            return(
                                <tr key={r.rentId} onClick={()=>navigate(`/rentManager/detail/${r.rentId}`)} className="clickable-row">
                                    <td>{index + 1}</td>
                                    <td><img className="rent-img" src={`http://localhost:8080${r.thumbnail}`} /></td>
                                    <td>{r.name}</td>
                                    <td>{r.phone}</td>
                                    <td>{r.streetAddress}</td>
                                    <td>{getStatusLabel(r.status)}</td>
                                    <td>{r.createdAt}</td>

                                    <td onClick={(e) => e.stopPropagation()}>
                                        {r.status === "APPROVED" ? (
                                            <Link to={`/itemManager/insert/${r.rentId}`} className="register-btn">등록</Link>
                                        ) : (
                                            <button className="register-btn-disabled" disabled>등록</button>
                                        )}
                                    </td>
                                    <td onClick={(e) => {
                                        e.stopPropagation(); // 행 클릭 이벤트 막기
                                        deleteRent(r.rentId);
                                    }}>
                                        <button className="delete-btn">탈퇴</button>
                                    </td>
                                </tr>
                            )
                        })
                    }     
                </tbody>
            </table>
            )}
        </div>
    )

}
export default RentList;