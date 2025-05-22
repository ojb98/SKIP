  import React, { useEffect, useState } from 'react';
  import axios from 'axios';

  import '../../css/userlist.css'; // 스타일 파일 불러오기

  function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState(null);
    const [keyword, setKeyowrd] = useState(null);
    const [user5Reviews, setUser5Reviews] = useState(null);
    const [user5Purchases, setUser5Purchases] = useState(null);
    const [searchedUsers, setSearchedUsers] = useState(null);



    const handleRowClick = (user) => {
      setSelectedUser(user);
    };

    const handleSearch = () =>{
      if (!keyword.trim()) {
        alert("검색어를 입력하세요.");
        return;
      }

      if (filter === "name") {
        findUsersByUsername(keyword);
      } else {
        findUsersByUserId(keyword);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('사용자 데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    const findUsersByUsername = async (username) => {
      try{
        const response = await axios.get(`/api/users/find-user-by-username/${username}`);
        setUsers(response.data);
      } catch (error){
        console.error('사용자 데이터를 불러오는 데 실패했습니다.',error);
      } finally {
        setLoading(false);
      }
    }
    const findUsersByUserId = async (userId) => {
      try{
        const response = await axios.get(`/api/users/find-user-by-userid/${userId}`);
        setUsers(response.data);
      } catch (error){
        console.error('사용자 데이터를 불러오는 데 실패했습니다.',error);
      } finally {
        setLoading(false);
      }
    }

    const findUser5Reviews = async (userId) => {
      try{
        const response = await axios.get(`/api/users/find-users-5reviews/${userId}`);
        setUsers(response.data);
      } catch (error){
        console.error('사용자 데이터를 불러오는 데 실패했습니다.',error);
      } finally {
        setLoading(false);
      }
    }

    const findUser5Purchases = async (userId) => {
      try{
        const response = await axios.get(`/api/users/find-users-5purchases/${userId}`);
        setUsers(response.data);
      } catch (error){
        console.error('사용자 데이터를 불러오는 데 실패했습니다.',error);
      } finally {
        setLoading(false);
      }
    }

    const requestDelete = async (userId) => {
      if (!window.confirm('정말로 탈퇴 처리하시겠습니까?')) return;
      try {
        await axios.delete(`/api/users/delete/${userId}`);
        alert('탈퇴 처리되었습니다.');
        fetchUsers(); // 목록 갱신
      } catch (error) {
        alert('탈퇴 처리 실패');
        console.error(error);
      }
    };

    useEffect(() => {
      fetchUsers();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
      <div className="table-container">
        <div style={{ display: 'flex' }}>
          <h3>📋 유저 목록 조회</h3>
          <div className="search-filter">
            <select className="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="name">이름</option>
              <option value="userName">아이디</option>
            </select>
            <input type="text" placeholder="검색어 입력" onChange={(e)=>setKeyowrd(e.target.value)}/>
            <button onClick={handleSearch}>검색</button>
          </div>
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>사용자명</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>소셜 구분</th>
              <th>권한</th>
              <th>상태</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId} onClick={() => handleRowClick(user)}  >
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.social}</td>
                  <td>{[...user.roles].join(', ')}</td>
                  <td>{user.status}</td>
                  <td>{new Date(user.registeredAt).toLocaleDateString()}</td>
                  <td>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">사용자 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        {selectedUser && (
          <div className="user-detail-card">
            <div className="user-section">
              <h4>👤 사용자 상세 정보</h4>
              <img src={selectedUser.image || "/default-profile.png"} alt="사용자 프로필" />
              <p style={{ textAlign: 'center' }}>
                <strong>이름:</strong> {selectedUser.name}
              </p>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  requestDelete(selectedUser.userId)
                }}
              >
                탈퇴
              </button>
            </div>

            <div className="user-info">
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
              <h4>⭐ 최근 리뷰</h4>
              <p>...데이터 연동 예정...</p>
            </div>

            <div className="user-activity">
              <h4>📃 결제 내역</h4>
              <p>...데이터 연동 예정...</p>
            </div>
          </div>
        )}

      </div>
    );
  }

  export default UserTable;
