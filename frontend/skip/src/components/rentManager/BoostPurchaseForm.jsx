import { useEffect, useState } from 'react';
import '../../css/rentAdForm.css';
import '../../css/userlist.css';
import { fetchCash, purchaseBoost, fetchCpb, fetchActiveBoost, decryptCash } from '../../services/admin/rent/AdService';
import { useSelector } from 'react-redux';
import { findRentByUserId } from '../../services/admin/RentListService';

const BoostPurchaseForm = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const [cashToken, setCashToken] = useState('');
  const [cashAmount, setCashAmount] = useState(0);
  const [boost, setBoost] = useState('');
  const [cpb, setCpb] = useState(0);
  const [rentList, setRentList] = useState([]);
  const [selectedRentId, setSelectedRentId] = useState(0);
  const [activeBoost, setActiveBoost] = useState(0);

  useEffect(() => {
    if (!userId) return;
    findRentByUserId(userId).then(list => {
      setRentList(list);
      if (list.length > 0) setSelectedRentId(list[0].rentId);
    });
  }, [userId]);

  useEffect(() => {
    const load = async () => {
      if (!userId || !selectedRentId) return;
      const token = await fetchCash(userId, selectedRentId);
      setCashToken(token);
      const amount = await decryptCash(token);
      setCashAmount(amount);
      const ab = await fetchActiveBoost(userId, selectedRentId);
      setActiveBoost(ab);
      const price = await fetchCpb(userId, selectedRentId);
      setCpb(price);
    };
    load();
  }, [userId, selectedRentId]);

  const handlePurchase = async e => {
    e.preventDefault();
    const remaining = await purchaseBoost(userId, selectedRentId, Number(boost), Number(cpb), cashToken);
    if (remaining != null) {
      setCashToken(remaining);
      const amount = await decryptCash(remaining);
      setCashAmount(amount);
      const ab = await fetchActiveBoost(userId, selectedRentId);
      setActiveBoost(ab);
    }
    setBoost('');
  };

  const getNextMonday0AM = () => {
    const today = new Date();
    const diff = (8 - today.getDay()) % 7 || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(3, 0, 0, 0);
    return monday.toISOString().split('T')[0] + ' 00:00';
  };
  const updateDay = getNextMonday0AM();

  return (
    <div style={{display:"flex"}}>
    <div className="table-container" style={{marginLeft:"20px",marginTop:"0px", width:"500px", boxShadow:"0 2px 6px rgba(0, 0, 0, 0.3)"}}>
      <h3 className="form-header">
        🚀 부스트 구매
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          📅 {updateDay}(월) 적용 예정
        </span>
      </h3>
      <div className="form-container" >
        <form onSubmit={handlePurchase}>
          <div className="form-group">
            <label>렌탈샵 선택</label>
            <select value={selectedRentId} onChange={e => setSelectedRentId(Number(e.target.value))}>
              {rentList.map(r => (
                <option key={r.rentId} value={r.rentId}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>현재 보유 캐시</label>
            <input type="text" value={cashAmount.toLocaleString()} readOnly />
          </div>
          <div className="form-group">
            <div style={{display:"flex"}}>
            <label>부스트 한 개당 가격</label>
            <span className="tooltip-icon" style={{width:"15px", height:"25px"}}>?
              <span className="tooltip-text" style={{width:"400px"}}>
                부스트 가격 산정방식: 
                <br/> 1 + (5.0 - 평균 평점) * 0.1 + (5.0 - 최근7일 평균평점) * 0.1            
              </span>
            </span>
            </div>
            <input type="number" value={cpb} readOnly />
          </div>
          <div className="form-group">
            <label>부스트 갯수</label>
            <input
              type="number"
              value={boost}
              onChange={e => setBoost(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" style={{marginLeft:"260px" , marginTop:"20px"}}>구매하기</button>
        </form>
      </div>
    </div>
    <div className='table-container' style={{marginLeft:"20px",marginTop:"0px", width:"1100px", boxShadow:"0 2px 6px rgba(0, 0, 0, 0.3)"}}>
      <h3 className="form-header" style={{borderBottom:"1px solid #c8c8c8"}}>
        ⚠️ 주의사항        <br /><br />
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          * 부스트는 사용자가 렌탈샵 일반검색 시 상단에 노출되게 하는 광고형 상품입니다.
          <br />&nbsp;&nbsp;* 부스트는 매주 월요일 오전 3:00에 초기화됩니다.     
          <br />&nbsp;&nbsp;* 부스트의 가격 책정은 제공된 계산식에 따라 계산되며, 신규 입점업체를 위한 최소 점수가 배정되어 있습니다.
          <br />&nbsp;&nbsp;* 부스트는 보유한 갯수에 따라 상단 노출 순위가 결정되며, 가게의 최근 리뷰 평점에 따라 가격이 산정됩니다.
          <br />&nbsp;&nbsp;* 최근 리뷰가 없는 신규 입점 업체는 기본값으로 설정된 최소점수가 반영됩니다.                              
          <br /><br />
        </span>
      </h3>
      <p style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
        현재 적용 중인 부스트 수: {activeBoost}
      </p>
      
    </div>
    </div>
  );
};

export default BoostPurchaseForm;