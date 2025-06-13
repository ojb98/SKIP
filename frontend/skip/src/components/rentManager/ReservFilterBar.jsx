import { useState } from "react";

const ReservFilterBar = ({ onFilterChange }) => {
  const [username, setUsername] = useState("");  // 예약자 이름 필터
  const [returnDate, setReturnDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ username, returnDate });
  };

  return (
    <form onSubmit={handleSubmit} className="filter-bar">
      <input
        type="text"
        placeholder="예약자 이름 (username)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="date"
        placeholder="반납일 기준"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default ReservFilterBar;
