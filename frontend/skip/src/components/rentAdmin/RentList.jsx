import { useEffect, useState } from "react";
import { rentListApi } from "../../api/rentListApi";
import { Link } from "react-router-dom";
import { rentDelApi } from "../../api/rentListApi";
import '../../css/rentList.css';
import { useSelector } from "react-redux";


const RentList=()=>{

    //userId값 꺼내오기
    const profile = useSelector(state => state.loginSlice);
    console.log(profile);

    const [rent,setRent] = useState([]);


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
        const checkDel = window.confirm("정말로 삭제하시겠습니까?");

        if(checkDel){
            rentDelApi(rentId).then(()=>{
                getRentList();
            })
        }
    
    }


    return(
        <div>
            <h1 className="rent-list">가맹점 리스트</h1>

            {rent.length === 0 ? (
                <h2>현재 등록된 가맹점이 없습니다.</h2>
            ) : (
            <table>
                <thead>
                    <tr>
                        <th>번호</th><th>썸네일</th><th>상호명</th><th>전화번호</th><th>주소</th><th>승인상태</th><th>등록일</th>
                        <th>장비등록</th><th>상세보기</th><th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rent.map((r,index)=>{
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
                                <tr key={r.rentId}>
                                    <td>{index + 1}</td>
                                    <td><img className="rent-img" src={`http://localhost:8080${r.thumbnail}`} /></td>
                                    <td>{r.name}</td>
                                    <td>{r.phone}</td>
                                    <td>{r.streetAddress}</td>
                                    <td>{getStatusLabel(r.status)}</td>
                                    <td>{r.createdAt}</td>
                                    <td>
                                        {r.status === "APPROVED" ? (
                                            <Link to={`/itemAdmin/insert/${r.rentId}`} className="register-btn">등록</Link>
                                        ) : (
                                            <button className="register-btn-disabled" disabled>등록</button>
                                        )}
                                    </td>
                                    <td><Link to={`/rentAdmin/detail/${r.rentId}`} className="view-btn">보기</Link></td>
                                    <td><button onClick={() => deleteRent(`${r.rentId}`)} className="delete-btn">삭제</button></td>
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