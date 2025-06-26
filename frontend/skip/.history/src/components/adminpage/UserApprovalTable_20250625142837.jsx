import { useEffect, useState } from 'react';
import '../../css/userlist.css'; 
import AdminPagination from './AdminPagination.jsx';
import { formatDate, formatDate1 } from '../../utils/formatdate';
import { fetchApprovalRents, findRentByUserId, findRentByName, findRentByRentName, requestUpdate} from '../../services/admin/RentListService.js';

const STATUS_FILTER = 'APPROVED';

  function ApprovalTable() {
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRent, setSelectedRent] = useState(null);
    const [filter, setFilter] = useState("rentname");
    const [keyword, setKeyword] = useState("");        
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rentDetail, setRentDetail] = useState({
      rentDetails: []
    });
    const totalPages = Math.ceil(rents.length / pageSize)
    const pageGroupSize = 5
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize)
    const startPage = currentGroup * pageGroupSize + 1
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages)
    const pagedRents = rents.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )

    const handleRowClick = (rent) => {
      if (!rent || selectedRent?.rentId === rent.rentId) {
        setSelectedRent(null);
        setRentDetail({ rentDetail: []});
        return;
      }
      setSelectedRent(rent);
      
    };

    const handleSearch = async () =>{
      if (!keyword.trim()) {
        loadRents();
        setSelectedRent(null);
        return;
      }
      try{
        let data;
        if (filter === "username") {
          data = await findRentByUserId(keyword)
        } else if (filter === "name") {
          data = await findRentByName(keyword)
        } else if (filter === "rentname"){
          data = await findRentByRentName(keyword)
        } else {
          console.warn("알 수 없는 필터 값: ", filter);
          data = [];
        }
        if (!Array.isArray(data)) {     
          data = [data];
        }
        data = data.filter(rent => rent.status === STATUS_FILTER);
        setRents(data);
        setCurrentPage(1);
      }catch(e){
        console.error("검색 실패",e)
      }
      setSelectedRent(null)
    };

    const loadRents = async () => {
      try {
        const data = await fetchApprovalRents();
        if (!Array.isArray(data)) {
          setRents([]);
        } else {
          setRents(data);
        }
      } catch (e) {
        console.error('렌탈샵 조회 실패', e);
        setRents([]); // 에러 발생 시 기본값으로 빈 배열 설정
      } finally {
        setLoading(false);
      }
    };

    const handleWithdraw = async () => {
      if (!selectedRent) return;
      const confirmed = window.confirm('정말 거절하시겠습니까?');
      if (!confirmed) return;
      try {
        await requestUpdate(selectedRent.rentId, 'WITHDRAWN');
        await loadRents();
        setSelectedRent(null);
        setCurrentPage(1);
      } catch (e) {
        console.error('상태 변경 실패', e);
        alert('상태 변경 중 오류가 발생했습니다.');
      }
    };

    useEffect(() => {
      loadRents();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
      <div className="table-container">
        <div style={{ display: 'flex' }}>
          <button onClick={fetchApprovalRents} style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom:"25px" }}>
            <h3>✅ 가맹점 목록 조회</h3>
          </button>
          <div className="search-filter">
            <select className="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="rentname">렌탈샵명</option>
              <option value="username">아이디</option>
              <option value="name">이름</option>              
            </select>
            <input type="text" placeholder="검색어 입력" onChange={(e)=>setKeyword(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter'){handleSearch();}}}/>
            <button onClick={handleSearch}>검색</button>
            <button onClick={loadRents}>전체보기</button>
          </div>
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>렌탈샵고유ID</th>
              <th>렌탈샵명</th>
              <th>사용자ID</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>등록일</th>
              <th>사업자등록번호</th>
              <th>유효사업자여부</th>
              <th>휴/폐업진위확인</th>                
            </tr>
          </thead>
          <tbody>
            {rents.length > 0 ? (
              pagedRents.map((rent) => (
                <tr 
                  key={rent.rentId} 
                  onClick={() => {
                    handleRowClick(rent);                                        
                  }}                  
                  className={selectedRent && selectedRent.rentId === rent.rentId ? 'selected-row' : ''}
                > 
                  <td>{rent.rentId || '-'}</td>                 
                  <td>{rent.name}</td>                  
                  <td>{rent.userUserName || '-'}</td>
                  <td>{rent.userName || '-'}</td>
                  <td>{rent.userPhone}</td>                  
                  <td>{rent.userEmail}</td>
                  <td>{formatDate1(rent.createdAt)  || '-'}</td>
                  <td>{rent.bizRegNumber || '-'}</td>
                  <td>{rent.bizStatus === "Y" ? "유효" : "무효" || '-'}</td>
                  <td>{rent.bizClosureFlag === "N" ? "영업 중" : "휴업·폐업" || '-'}</td>
                                
                </tr>                
              ))
            ) : (
              <tr>
                <td colSpan="9">사용자 정보가 없습니다.</td>
              </tr>
            )}            
          </tbody>          
        </table>
        <AdminPagination
          currentPage={currentPage}
          totalItems={rents.length}
          pageSize={pageSize}
          groupSize={5}
          onPageChange={(page) => {
            setCurrentPage(page)
            setSelectedRent(null)
          }}
        />
        {selectedRent && (
          <div className="user-detail-card">
            <div className="user-section"> <br /> 
              <h4  style={{marginTop:"-10px"}}>📷 렌탈샵 썸네일</h4>     <br /><br />       
              <img src={selectedRent.thumbnail ? `http://localhost:8080${selectedRent.thumbnail}` : "/images/default-shop.png"} alt="렌탈샵 프로필" />
              <p style={{ textAlign: 'center' }}>
                <strong>상호:</strong> {selectedRent.name}  <br />
                <strong>관리자 이름:</strong> {selectedRent.userName} <br />
                <strong>관리자 아이디:</strong> {selectedRent.userUserName} 
              </p>              
            </div>
            <div className="user-info" > 
            <h4>🏪 렌탈샵 상세 정보</h4> <br />
              <p><strong>렌탈샵고유ID:</strong> {selectedRent.rentId}</p>
              <p><strong>사업자등록번호:</strong> {selectedRent.bizRegNumber}</p>
              <p><strong>유효사업자여부:</strong> {selectedRent.bizStatus}</p>
              <p><strong>휴/폐업 여부:</strong> {selectedRent.bizClosureFlag}</p>
              <p><strong>전화번호:</strong> {selectedRent.phone}</p>
              <p><strong>우편번호:</strong> {selectedRent.postalCode}</p>
              <p><strong>지번주소:</strong> {selectedRent.basicAddress}</p>
              <p><strong>도로명주소:</strong> {selectedRent.streetAddress}</p>
              <p><strong>상세주소:</strong> {selectedRent.detailedAddress}</p>
              <p><strong>등록일:</strong> {new Date(selectedRent.createdAt).toLocaleString()}</p>
            </div>

            <div className="user-info">
              <h4>👤 관리자 상세 정보</h4> <br />
              <p><strong>유저고유ID:</strong> {selectedRent.userId}</p>
              <p><strong>아이디:</strong> {selectedRent.userUserName}</p>
              <p><strong>이름:</strong> {selectedRent.userName}</p>
              <p><strong>이메일:</strong> {selectedRent.userEmail}</p>
              <p><strong>전화번호:</strong> {selectedRent.userPhone}</p>
              <p><strong>소셜 구분:</strong> {selectedRent.userSocial}</p>              
              <p><strong>가입일:</strong> {new Date(selectedRent.userUserRegisteredAt).toLocaleString()}</p>            
            </div>   
            <div style={{borderLeft:"1px solid #dddddd", paddingLeft:"20px"}}>
              <div style={{display:"flex"}}>
              <h4 style={{marginTop:"10px"}}>🖼️ 렌탈샵 이미지 & 소개</h4>
              <button
                style={{marginLeft:"350px",marginTop:"10px"}}
                className="btn-withdraw"
                onClick={handleWithdraw}
              >
                승인 거부 상태로 변경
              </button>
              </div>
              <div style={{display:"flex" }}>
                <img src={selectedRent.image1 ? `${__APP_BASE__}${selectedRent.image1}` : "/images/default-shop.png"}
                  style={{ width: "150px", height: "150px", margin: "40px", marginTop: "30px" }}
                />
                <img src={selectedRent.image2 ? `http://localhost:8080${selectedRent.image2}` : "/images/default-shop.png"}
                  style={{ width: "150px", height: "150px", margin: "40px", marginTop: "30px" }}
                />
                <img src={selectedRent.image3 ? `http://localhost:8080${selectedRent.image3}` : "/images/default-shop.png"}
                  style={{ width: "150px", height: "150px", margin: "40px", marginTop: "30px" }}
                />
              </div>        
              <div>
                <p><strong>렌탈샵 소개:</strong></p>                
                <p style={{margin:"10px"}}> {selectedRent.description}</p>
                
              </div> 
            </div>
          </div>
          )}
      </div>
    );
  }

  export default ApprovalTable;
