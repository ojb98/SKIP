import "../../css/userlist.css";
import AdminPagination from "./AdminPagenation";

const UserApprovalTable = ({
  userList = [],
  currentPage,
  pageSize,
  onPageChange,
  onApprove,
  onDeny
}) => {

  const totalPages = Math.ceil(userList.length / pageSize);
  const pageGroupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pagedUsers = userList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const getStatusText = (status) => {
    switch (status) {
      case "WITHDRAWN":
        return "거부";
      case "PENDING":
        return "승인대기중";
      default:
        return "승인";
    }
  };

  return (
    <div className="table-container">
      <div className="user-approval-container">
        <h3 style={{ marginBottom: "20px" }}>🙋‍♀️ 승인 요청 목록</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>사업자번호인증</th>
              <th>휴/폐업진위확인</th>
              <th>승인/거부</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.length > 0 ? (
              pagedUsers.map((user) => (
                <tr key={user.uuid}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.biz_status}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.regdate)}</td>
                  <td>
                    <span
                      style={{
                        color:
                          user.status === "PENDING"
                            ? "#FFA500"
                            : user.status === "WITHDRAWN"
                            ? "#FF5D17"
                            : "#2E8B57",
                        fontWeight: "bold",
                      }}
                    >
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-approve"
                      onClick={() => onApprove(user.uuid)}
                    >
                      승인
                    </button>
                    <button
                      className="btn-deny"
                      onClick={() => onDeny(user.uuid)}
                    >
                      거부
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">승인 대기 리스트가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <AdminPagination
          currentPage={currentPage}
          totalItems={userList.length}
          pageSize={pageSize}
          groupSize={5}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserApprovalTable;
