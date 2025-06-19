import { useEffect, useState } from 'react';
import '../../css/rentAdForm.css';
import '../../css/userlist.css';
import { fetchCash, purchaseBoost } from '../../services/admin/rent/AdService';
import { useSelector } from 'react-redux';

const BoostPurchaseForm = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const [currentCash, setCurrentCash] = useState(0);
  const [boost, setBoost] = useState('');
  const [cpb, setCpb] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const cash = await fetchCash(userId);
      setCurrentCash(cash);
    };
    load();
  }, [userId]);

  const handlePurchase = async e => {
    e.preventDefault();
    const remaining = await purchaseBoost(userId, Number(boost), Number(cpb));
    if (remaining != null) setCurrentCash(remaining);
    setBoost('');
    setCpb('');
  };

  const getNextMonday0AM = () => {
    const today = new Date();
    const diff = (8 - today.getDay()) % 7 || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0] + ' 00:00';
  };
  const updateDay = getNextMonday0AM();

  return (
    <div className="table-container" style={{marginTop:"0px"}}>
      <h3 className="form-header">
        🚀 부스트 구매
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          📅 {updateDay}(월) 적용 예정
        </span>
      </h3>
      <div className="form-container" style={{margin:"0px"}}>
        <form onSubmit={handlePurchase}>
          <div className="form-group">
            <label>현재 보유 캐시</label>
            <input type="text" value={currentCash} readOnly style={{width:"50%"}}/>
          </div>
          <div className="form-group">
            <label>부스트 레벨</label>
            <input
              type="number"
              value={boost}
              onChange={e => setBoost(e.target.value)}
              required
              style={{width:"50%"}}
            />
          </div>
          <div className="form-group">
            <label>CPB (차감 캐시)</label>
            <input
              type="number"
              value={cpb}
              onChange={e => setCpb(e.target.value)}
              required
              style={{width:"50%"}}
            />
          </div>
          <button type="submit">구매하기</button>
        </form>
      </div>
    </div>
  );
};

export default BoostPurchaseForm;