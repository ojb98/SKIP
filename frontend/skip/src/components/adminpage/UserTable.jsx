  import { useEffect, useState } from 'react';
  import '../../css/userlist.css'; 
import AdminPagination from './AdminPagenation';
import { formatDate, formatDate1 } from '../../utils/formatdate';
import { fetchUsers, findUsersByUsername, findUsersByName, findUser5Activity, requestDelete } from '../../services/admin/UserListService';


  function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState("username");
    const [keyword, setKeyword] = useState("");        
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [user5Activities, setUser5Activites] = useState({
      user5Reviews: [],
      user5Purchases: [],
    });
    const totalPages = Math.ceil(users.length / pageSize)
    const pageGroupSize = 5
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize)
    const startPage = currentGroup * pageGroupSize + 1
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages)
    const pagedUsers = users.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )

    const handleRowClick = (user) => {
      if (!user || selectedUser?.userId === user.userId) {
        setSelectedUser(null);
        setUser5Activites({ user5Reviews: [], user5Purchases: [] });
        return;
      }
      setSelectedUser(user);
      findUser5Activity(user.userId).then(data=>setUser5Activites(data)).catch(err=>console.error("유저활동조회 실패",err));
      
    };

    const handleSearch = async () =>{
      if (!keyword.trim()) {
        loadUsers();
        setSelectedUser(null);
        return;
      }
      try{
        let data;
        if (filter === "username") {
          data = await findUsersByUsername(keyword)
        } else {
          data = await findUsersByName(keyword)
        }
        setUsers(data);
        setCurrentPage(1);
      }catch(e){
        console.error("검색 실패",e)
      }
      setSelectedUser(null)
    };

    const loadUsers = async () => {
      try {
      const data = await fetchUsers();
        setUsers(data);
      } catch (e) {
        console.error('사용자 조회 실패', e);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadUsers();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
      <div className="table-container">
        <div style={{ display: 'flex' }}>
          <button onClick={fetchUsers} style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom:"25px" }}>
            <h3>📋 유저 목록 조회</h3>
          </button>
          <div className="search-filter">
            <select className="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="username">아이디</option>
              <option value="name">이름</option>
            </select>
            <input type="text" placeholder="검색어 입력" onChange={(e)=>setKeyword(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter'){handleSearch();}}}/>
            <button onClick={handleSearch}>검색</button>
            <button onClick={loadUsers}>전체보기</button>
          </div>
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>닉네임</th>
              <th>사용자명</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>소셜 구분</th>
              <th style={{width:"300px"}}>권한</th>
              <th>가입일</th>            
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              pagedUsers.map((user) => (
                <tr 
                  key={user.userId} 
                  onClick={() => {
                    handleRowClick(user);                                        
                  }}                  
                  className={selectedUser && selectedUser.userId === user.userId ? 'selected-row' : ''}
                >                  
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.nickname}</td>
                  <td>{user.username}</td>                  
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.social}</td>
                  <td>{[...user.roles].join(', ')}</td>
                  <td>{new Date(user.registeredAt).toLocaleDateString()}</td>                  
                </tr>                
              ))
            ) : (
              <tr>
                <td colSpan="10">사용자 정보가 없습니다.</td>
              </tr>
            )}            
          </tbody>          
        </table>
        <AdminPagination
          currentPage={currentPage}
          totalItems={users.length}
          pageSize={pageSize}
          groupSize={5}
          onPageChange={(page) => {
            setCurrentPage(page)
            setSelectedUser(null)
          }}
        />
        {selectedUser && (
          <div className="user-detail-card">
            <div className="user-section">
              <h4>👤 사용자 상세 정보</h4>
              <img src={selectedUser.image || "/default-profile.png"} alt="사용자 프로필" />
              <p style={{ textAlign: 'center' }}>
                <strong>이름:</strong> {selectedUser.name}  <br />
                <strong>닉네임:</strong> {selectedUser.nickname}
              </p>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  const isConfirmed = window.confirm(`정말로 ${selectedUser.name} 님을 탈퇴 처리하시겠습니까?`);
                  if (!isConfirmed) return;

                  requestDelete(selectedUser.userId)
                  .then(()=>{
                    alert("탈퇴 처리되었습니다.");
                    setSelectedUser(null);
                    loadUsers();
                  })
                  .catch(()=> {
                    alert("탈퇴 처리에 실패하였습니다.");
                    console.error("탈퇴 실패", err);
                  })
                }}
              >
                탈퇴
              </button>
            </div>

            <div className="user-info"> <br /> <br />
              <p><strong>ID:</strong> {selectedUser.userId}</p>
              <p><strong>아이디:</strong> {selectedUser.username}</p>
              <p><strong>이메일:</strong> {selectedUser.email}</p>
              <p><strong>전화번호:</strong> {selectedUser.phone}</p>
              <p><strong>소셜 구분:</strong> {selectedUser.social}</p>
              <p><strong>권한:</strong> {[...selectedUser.roles].join(', ')}</p>
              <p><strong>상태:</strong> {selectedUser.status}</p>
              <p><strong>가입일:</strong> {new Date(selectedUser.registeredAt).toLocaleString()}</p>
            </div>

            <div className="user-activity">
              <h4>🏂 최근 작성한 리뷰</h4>
              {user5Activities?.user5Reviews?.length > 0 && (
              <ul>
                {user5Activities?.user5Reviews?.map((review, idx)=> (
                  <li key={idx} style={{display:"flex"}}>
                    <div style={{marginTop:"25px", marginLeft:"10px"}}>
                      <div style={{display:"flex"}}> ⭐<strong>{review.rating.toFixed(1)}</strong> <p style={{color:"#c9c9c8", transform: "scale(0.8)"}}>{formatDate(review.createdAt)} 에 작성함 </p></div>
                      {review.content} 
                    </div>
                    <div>
                      <img src={review.img} style={{ width: '100px', height: 'auto' }}/>
                    </div>
                  </li>                  
                ))}
              </ul>
              )}
            </div>

            <div className="user-activity">
              <h4>📃 최근 결제 내역</h4>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>결제일시</th>
                      <th>결제금액</th>
                      <th>결제상태</th>
                      <th>결제 ID</th>                      
                    </tr>
                  </thead>
                  {user5Activities?.user5Purchases?.length > 0 && (
                    <tbody>
                      {user5Activities.user5Purchases.map((purchase, idx) => (
                        <tr key={idx}>
                          <td>{formatDate1(purchase.createdAt)}</td>
                          <td>{purchase.totalPrice.toLocaleString()}원</td>
                          <td>{purchase.status}</td>
                          <td>{purchase.paymentId}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          )}
      </div>
    );
  }

  export default UserTable;
