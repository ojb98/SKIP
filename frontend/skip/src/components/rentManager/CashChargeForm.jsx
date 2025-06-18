import { useEffect, useState } from 'react';
import '../../css/rentAdForm.css';
import '../../css/userlist.css';
import { fetchCash, chargeCash } from '../../services/admin/rent/AdService';
import { useSelector } from 'react-redux';

const CashChargeForm = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const [currentCash, setCurrentCash] = useState(0);
  const [amount, setAmount] = useState('');
  const [pg, setPg] = useState('kcp.AO09C');

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const cash = await fetchCash(userId);
      setCurrentCash(cash);
    };
    load();
  }, [userId]);

  const handleCharge = async e => {
    e.preventDefault();
    const merchantUid = `adcash_${new Date().getTime()}`;
    const IMP = window.IMP;
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
          pgProvider: pg,
        });
        const cash = await fetchCash(userId);
        setCurrentCash(cash);
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
    <div className="table-container">
      <h3 className="form-header">
        💰 광고 캐시 충전
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          📅 {updateDay}(월) 적용 예정
        </span>
      </h3>
      <div className="form-container">
        <form onSubmit={handleCharge}>
          <div className="form-group">
            <label>현재 보유 캐시</label>
            <input type="text" value={currentCash} readOnly />
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
          <button type="submit">결제하기</button>
        </form>
      </div>
    </div>
  );
};

export default CashChargeForm;