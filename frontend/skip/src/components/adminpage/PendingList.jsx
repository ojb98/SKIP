import React from "react";
import "./UserApprovalTable.css"; // 스타일 분리는 선택

const UserApprovalTable = ({
  userList = [],
  currentPage,
  totalPages,
  listType,
  onPageChange,
  onApprove,
  onDeny
}) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const getStatusText = (status) => {
    switch (status) {
      case "N":
        return "거부";
      case "P":
        return "승인대기중";
      default:
        return "승인";
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>역할</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>가입일</th>
            <th>상태</th>
            <th>승인/거부</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 ? (
            userList.map((user) => (
              <tr key={user.uuid}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.regdate)}</td>
                <td>{getStatusText(user.status)}</td>
                <td>
                  <button
                    onClick={() => onApprove(user.uuid)}
                    style={{
                      backgroundColor: "#00A2E8",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 15px",
                      cursor: "pointer",
                      marginRight: "5px"
                    }}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => onDeny(user.uuid)}
                    style={{
                      backgroundColor: "#FF5D17",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 15px",
                      cursor: "pointer"
                    }}
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

      <div className="pagination">
        <button
          onClick={() => onPageChange(listType, currentPage - 1)}
          disabled={currentPage <= 1}
        >
          이전
        </button>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(listType, page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(listType, currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserApprovalTable;
