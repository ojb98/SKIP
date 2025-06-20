import { useEffect, useState } from 'react';
import '../../css/rentAdForm.css';
import '../../css/userlist.css';
import { fetchCash, chargeCash } from '../../services/admin/rent/AdService';
import { useSelector } from 'react-redux';
import { findRentByUserId } from '../../services/admin/RentListService';

const CashChargeForm = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const [cashToken, setCashToken] = useState('');
  const [amount, setAmount] = useState('');
  const [pg, setPg] = useState('kakaopay.TC0ONETIME');
  const [rentList, setRentList] = useState([]);
  const [selectedRentId, setSelectedRentId] = useState(0);

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
    };
    load();
  }, [userId, selectedRentId]);

  const handleAmountChange = e => {
    const raw = e.target.value.replace(/[^0-9]/g, ''); // 숫자만
    setAmount(raw);
  };


  const handleCharge = async e => {
    e.preventDefault();
    const merchantUid = `adcash_${new Date().getTime()}`;
    const { IMP } = window;
    if (!IMP) {
      alert('결제 모듈 로딩 실패');
      return;
    }    
    IMP.init('imp57043461');
    IMP.request_pay({
      pg,
      pay_method: 'card',
      merchant_uid: merchantUid,
      name: '광고 캐시 충전',
      amount: Number(amount),
    }, async rsp => {
      if (rsp.success) {
        await chargeCash({
          impUid: rsp.imp_uid,
          merchantUid: rsp.merchant_uid,
          amount: rsp.paid_amount,
          userId,
          rentId: selectedRentId,
          pgProvider: pg,
          cashToken,
        });
        const token = await fetchCash(userId, selectedRentId);
        setCashToken(token);
      } else {
        alert('결제 실패: ' + rsp.error_msg);
      }
    });
    setAmount('');
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
    <div style={{display:"flex"}}>
      <div className="table-container" style={{marginLeft:"20px",marginTop:"0px", width:"500px", boxShadow:"0 2px 6px rgba(0, 0, 0, 0.3)"}}>
        <h3 className="form-header">
          💰 광고 캐시 충전
          <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
            📅 {updateDay}(월) 적용 예정
          </span>
        </h3>
        <div className="form-container">
          <form onSubmit={handleCharge}>
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
           <input
            type="text"
            value={cashToken.toLocaleString() + ' 원'}
            readOnly
            style={{ textAlign: 'right' }}
          />
        </div>

        <div className="form-group">
          <label>충전 금액</label>
          <input
            type="text"
            value={amount ? `${Number(amount).toLocaleString()} 원` : ''}
            onChange={handleAmountChange}
            required
            style={{ textAlign: 'right' }}
          />
        </div>
          <div className="form-group">
            <label>결제 수단</label>
            <select value={pg} onChange={e => setPg(e.target.value)}>
              <option value="kakaopay.TC0ONETIME">카카오페이</option>
              <option value="tosspay.tosstest">토스페이</option>
            </select>
          </div>
          <button type="submit" style={{marginLeft:"260px" , marginTop:"20px"}}>결제하기</button>
          </form>
        </div>
      </div>
      <div className='table-container' style={{marginLeft:"20px",marginTop:"0px",width:"1100px", boxShadow:"0 2px 6px rgba(0, 0, 0, 0.3)"}}>
        <h3 className="form-header" style={{borderBottom:"1px solid #c8c8c8"}}>
          ⚠️ 주의사항        <br /><br />
          <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
            * 광고 캐시는 환불되지 않습니다.
            <br />&nbsp;&nbsp;* 결제 후 충전된 캐시는 즉시 사용 가능합니다.
            <br />&nbsp;&nbsp;* 충전 캐시는 광고 상품 구매에만 사용되며 현금으로 환급되지 않습니다.
            <br />&nbsp;&nbsp;* 결제 오류 발생 시 고객센터로 문의 바랍니다.
            <br /><br />
          </span>
        </h3>
      </div>
    </div>
  );
};

export default CashChargeForm;