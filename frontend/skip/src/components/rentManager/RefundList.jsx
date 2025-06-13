import { useEffect, useState } from 'react';
import { refundsListApi } from '../../api/refundApi';


const RefundList= () => {
  const [refunds, setRefunds] = useState([]);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('DESC');
  const [loading, setLoading] = useState(false);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const data = await refundsListApi({ status, startDate, endDate, sort });
      setRefunds(data);
    } catch (error) {
      console.error('환불 요청 목록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds(); // 초기 로드
  }, []);

  const handleFilter = () => {
    loadRefunds();
  };

  return (
    <div>
      <h2>관리자 환불 요청 목록</h2>

      {/* 필터 영역 */}
      <div style={{ marginBottom: '20px' }}>
        <label>상태: </label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">전체</option>
          <option value="REQUESTED">요청됨</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
        </select>

        <label style={{ marginLeft: '10px' }}>시작일: </label>
        <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />

        <label style={{ marginLeft: '10px' }}>종료일: </label>
        <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />

        <label style={{ marginLeft: '10px' }}>정렬: </label>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="DESC">최신순</option>
          <option value="ASC">오래된순</option>
        </select>

        <button onClick={handleFilter} style={{ marginLeft: '10px' }}>
          필터 적용
        </button>
      </div>

      {/* 리스트 영역 */}
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>환불ID</th>
              <th>예약ID</th>
              <th>아이템명</th>
              <th>수량</th>
              <th>환불금액</th>
              <th>환불사유</th>
              <th>상태</th>
              <th>신청일</th>
              <th>결제총액</th>
              <th>렌트 기간</th>
            </tr>
          </thead>
          <tbody>
            {refunds.length === 0 ? (
              <tr>
                <td colSpan="10">조회된 데이터가 없습니다.</td>
              </tr>
            ) : (
              refunds.map(refund => (
                <tr key={refund.refundId}>
                  <td>{refund.refundId}</td>
                  <td>{refund.reserveId}</td>
                  <td>{refund.itemName}</td>
                  <td>{refund.quantity}</td>
                  <td>{refund.refundPrice.toLocaleString()} 원</td>
                  <td>{refund.reason}</td>
                  <td>{refund.status}</td>
                  <td>{new Date(refund.createdAt).toLocaleString('ko-KR')}</td>
                  <td>{refund.totalPaymentPrice.toLocaleString()} 원</td>
                  <td>
                    {new Date(refund.rentStart).toLocaleDateString('ko-KR')} ~<br />
                    {new Date(refund.rentEnd).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RefundList;
