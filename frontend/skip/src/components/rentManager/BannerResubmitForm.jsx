import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../css/rentAdForm.css';
import { fetchActiveBanners } from '../../services/admin/BannerService';
import { fetchBannerDetail, resubmitBannerRequest } from '../../services/admin/rent/AdService';

const BannerResubmitForm = () => {
  const { waitingId } = useParams();
  const { userId } = useSelector(state => state.loginSlice);
  const [banner, setBanner] = useState(null);
  const [cpcBid, setCpcBid] = useState('');
  const [maxBid, setMaxBid] = useState(0);
  const [activeScores, setActiveScores] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [percentile, setPercentile] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const imageRef = useRef();

  useEffect(() => {
    if (!userId) return;
    fetchBannerDetail(userId, waitingId).then(data => {
      setBanner(data);
      setCpcBid(data.cpcBid);
      setPreviewUrl(data.bannerImage);
    });
  }, [userId, waitingId]);

  useEffect(() => {
    fetchActiveBanners().then(actives => {
      const bids = actives.map(b => b.cpcBid);
      setMaxBid(bids.length > 0 ? Math.max(...bids) : 0);
      setActiveScores(actives.map(b => Number(b.finalScore)));
    });
  }, []);

  useEffect(() => {
    if (!banner) return;
    const max = maxBid > 0 ? maxBid : 1;
    const normalized = Number(cpcBid) / max;
    const score =
      Number(banner.averageRating || 0) * 0.2 +
      normalized * 0.3 +
      Number(banner.recent7dRating || 0) * 0.5;
    const final = Number.isNaN(score) ? 0 : Number(score.toFixed(2));
    setFinalScore(final);

    const scores = [...activeScores, final];
    scores.sort((a, b) => b - a);
    const better = scores.filter(s => s > final).length;
    let perc = ((scores.length - better) / scores.length) * 100;
    perc = Math.round(perc / 10) * 10;
    if (perc > 100) perc = 100;
    perc = 100 - perc;
    if (perc < 0) perc = 1;
    setPercentile(perc);
  }, [cpcBid, maxBid, banner, activeScores]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const file = imageRef.current?.files[0];
    await resubmitBannerRequest(waitingId, userId, cpcBid, file);
  };

  if (!banner) return <p>로딩 중...</p>;

  const getNextMonday3AM = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)
    const daysUntilNextMonday = ((8 - dayOfWeek) % 7) + 8; // 항상 다음 주 월요일
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    nextMonday.setHours(3, 0, 0, 0);
    return nextMonday.toISOString().split('T')[0] + ' 오전 3시';
  };
  const registDay = getNextMonday3AM();

  return (
    <div style={{ display: 'flex' }}>
      <div className="table-container" style={{ marginLeft: '20px', marginTop: '0px', width: '500px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)' }}>
        <h3 className="form-header">
          🖼️ 배너 수정 요청
          <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
            📅 {registDay}(월) 등록 예정
          </span>
        </h3>
        <div className="form-container" style={{ margin: '0px' }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>렌탈샵명</label>
              <input type="text" value={banner.rentName} readOnly />
            </div>
            <div className="form-group">
              <label>CPC 입찰가</label>
              <input type="number" value={cpcBid} onChange={e => setCpcBid(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>예상 노출도 점수</label>
              <input type="text" value={finalScore} readOnly />
              <p className="score-info" style={{ fontSize: '10px', color: '#555' }}>
                상위 {percentile}%의 순서로 배너가 노출 될 예정입니다
              </p>
            </div>
            <div className="form-group">
              <label>배너 이미지</label>
              <div>
                <button type="button" className="file-button" onClick={() => imageRef.current?.click()} style={{ width: '140px', marginLeft: '0px' }}>
                  🏂이미지 선택
                </button>
                <button type="submit" style={{ marginLeft: '100px' }}>재신청</button>
                <br />
                <span className="file-name">
                  {imageRef.current?.files[0]?.name || '선택된 파일 없음'}
                </span>
                <input type="file" ref={imageRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            </div>
            {banner.comments && (
              <div className="form-group">
                <label>관리자 반려 사유</label>
                <textarea value={banner.comments} readOnly style={{ width: '100%' }} />
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="table-container" style={{ marginLeft: '20px', marginTop: '0px', width: '1100px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)' }}>
        <h3 className="form-header" style={{ borderBottom: '1px solid #c8c8c8' }}>
          👀 미리보기
        </h3>
        {previewUrl && (
          <div style={{ padding: '10px' }}>
            <img src={previewUrl} alt="배너 미리보기" style={{ width: '100%', maxWidth: '1000px', maxHeight: '300px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '6px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerResubmitForm;