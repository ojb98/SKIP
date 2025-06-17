import { useEffect, useState } from 'react';
import '../../css/rentAdForm.css';
import '../../css/userlist.css';
import { fetchMileage, purchaseMileage } from '../../services/admin/rent/AdService';
import { useSelector } from 'react-redux';

const BoostPurchaseForm = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const [currentMileage, setCurrentMileage] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const mileage = await fetchMileage(userId);
      setCurrentMileage(mileage);
    };
    load();
  }, [userId]);

  const handlePurchase = async e => {
    e.preventDefault();
    const updated = await purchaseMileage(userId, Number(amount));
    if (updated != null) setCurrentMileage(updated);
    setAmount('');
  };

  // 다음 주 월요일 0시
  const getNextMonday0AM = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = (8 - day) % 7 || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0] + ' 00:00';
  };
  const updateDay = getNextMonday0AM();

  return (
    <div className="table-container" style={{marginTop:"0px"}}>
      <h3 className="form-header">
        💸 부스트 캐시 충전
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          📅 {updateDay}(월) 적용 예정
        </span>
      </h3>
      <div className="form-container">
        <form onSubmit={handlePurchase}>
          <div className="form-group">
            <label>현재 보유 캐시</label>
            <input type="text" value={currentMileage} readOnly />
          </div>
          <div className="form-group">
            <label>충전 금액</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
          <button type="submit">충전하기</button>
        </form>
      </div>
    </div>
  );
};

export default BoostPurchaseForm;