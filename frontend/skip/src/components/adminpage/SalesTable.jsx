import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesTable = () => {
  const [salesList, setSalesList] = useState([]);

  useEffect(() => {
    axios.get("/api/sales")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setSalesList(data);
      })
      .catch((error) => {
        console.error("데이터 로딩 오류:", error);
        setSalesList([]);
      });
  }, []);

  return (
    <div className="table-container">
      <h3>💳 결제 내역</h3>
      <table className="sales-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>총액</th>
          </tr>
        </thead>
        <tbody>
          {salesList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.price.toLocaleString()}원</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
