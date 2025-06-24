import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../css/rentAdForm.css';
import { fetchActiveBanners, fetchApprovedWaitingBanners } from '../../services/admin/BannerService';
import { fetchBannerDetail, resubmitBannerRequest, fetchRentRatings } from '../../services/admin/rent/AdService';

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
  const [avgRating, setAvgRating] = useState(2.5);
  const [recentRating, setRecentRating] = useState(2.5);
  const imageRef = useRef();

  const host = __APP_BASE__;

  // 기본 배너 정보 가져오기
  useEffect(() => {
    if (!userId) return;
    fetchBannerDetail(userId, waitingId).then(data => {
      setBanner(data);
      setCpcBid(data.cpcBid);
      setPreviewUrl(data.bannerImage ? host + data.bannerImage : '');
    });
  }, [userId, waitingId]);

  // 평균 평점 및 최근 평점 가져오기
  useEffect(() => {
    if (!userId || !banner) return;
    const load = async () => {
      const ratings = await fetchRentRatings(userId, banner.rentId);
      if (ratings) {
        setAvgRating(ratings.averageRating);
        setRecentRating(ratings.recentRating);
      }
    };
    load();
  }, [userId, banner]);

  // 활성 배너 정보 불러오기
  useEffect(() => {
    const load = async () => {
      const actives = await fetchActiveBanners();
      const approved = await fetchApprovedWaitingBanners();
      const bids = [
        ...actives.map(b => b.cpcBid),
        ...approved.map(b => b.cpcBid)
      ];
      setMaxBid(bids.length > 0 ? Math.max(...bids) : 0);
      setActiveScores(actives.map(b => Number(b.finalScore)));
    };
    load();
  }, []);

  // 점수 및 백분위 계산
  useEffect(() => {
    if (!banner) return;
    const max = maxBid > 0 ? maxBid : 1;
    const normalized = Number(cpcBid) / max;
    const score =
      Number(avgRating || 0) * 0.2 +
      normalized * 0.3 +
      Number(recentRating || 0) * 0.5;

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
  }, [cpcBid, maxBid, banner, avgRating, recentRating, activeScores]);

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
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = ((8 - dayOfWeek) % 7) + 8;
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
              <input type="number" min="1" value={cpcBid} onChange={e => setCpcBid(e.target.value)} required />
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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="file-button"
                  onClick={() => imageRef.current?.click()}
                  style={{ flex: 1.2 }}
                >
                  🏂이미지 선택
                </button>
                <button
                  type="submit"
                  className="action-btn"
                  style={{ flex: 1 }}
                >
                  재신청하기
                </button>
              </div>
              <br />
              <span className="file-name">
                {imageRef.current?.files[0]?.name || '선택된 파일 없음'}
              </span>
              <input type="file" ref={imageRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
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
            <img
              src={previewUrl}
              alt="배너 미리보기"
              style={{ width: '100%', maxWidth: '1000px', maxHeight: '300px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerResubmitForm;
