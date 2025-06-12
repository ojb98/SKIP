import { useEffect, useState } from 'react';
import '../../css/userlist.css';
import { fetchWaitingBanners, approveBanner, rejectBanner } from '../../services/admin/BannerService';

const BannerApprovalTable = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null); // 🔥 모달 이미지 상태 추가  
  const loadBanners = async () => {
    try {
      const data = await fetchWaitingBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('배너 목록 로딩 실패', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleRowClick = (banner) => {
    if (!banner || selectedBanner?.waitingId === banner.waitingId) {
      setSelectedBanner(null);
      return;
    }
    setSelectedBanner(banner);
  };

  // 🧠 컴포넌트 상단에서 "이번 주 월요일 AM 3시" 계산
const getThisWeekMonday3AM = () => {
  const today = new Date();
  const day = today.getDay(); // 일요일: 0, 월요일: 1, ...
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(3, 0, 0, 0);
  return monday.toISOString().split('T')[0] + ' 오전 3시';
};

const registDay = getThisWeekMonday3AM(); // ✅ 항상 이번주 월요일 3시

  const handleApprove = async () => {
    if (!selectedBanner) return;
    const confirmed = window.confirm('승인하시겠습니까?');
    if (!confirmed) return;
    try {
      await approveBanner(selectedBanner.waitingId);
      await loadBanners();
      setSelectedBanner(null);
    } catch (e) {
      console.error('승인 실패', e);
      alert('승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async () => {
    if (!selectedBanner) return;
    const reason = window.prompt('반려 사유를 입력하세요.');
    if (reason === null) return;
    try {
      await rejectBanner(selectedBanner.waitingId, reason);
      await loadBanners();
      setSelectedBanner(null);
    } catch (e) {
      console.error('반려 실패', e);
      alert('반려 중 오류가 발생했습니다.');
    }
  };
  

  const openModal = (imageUrl) => setModalImage(imageUrl); // 🔥
  const closeModal = () => setModalImage(null); // 🔥

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="table-container">
      <button style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
            <h3>📝 요청 배너 승인 <span style={{ fontSize: "14px", marginLeft: "10px", color: "#555" }}>📅 {registDay} 등록 예정</span></h3>
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>렌탈샵명</th>
            <th>CPC</th>
            <th>상태</th>            
            <th>요청일</th>
          </tr>
        </thead>
        <tbody>
          {banners.length > 0 ? (
            banners.map((banner) => (
              <tr
                key={banner.waitingId}
                onClick={() => handleRowClick(banner)}
                className={selectedBanner && selectedBanner.waitingId === banner.waitingId ? 'selected-row' : ''}
              >
                <td>{banner.waitingId}</td>
                <td>{banner.rentName}</td>
                <td>{banner.cpcBid}</td>
                <td>{banner.status}</td>                
                <td>{banner.registDay?.split('T')[0]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">배너 요청이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedBanner && (
        <div className="user-detail-card">
          <div className="user-section" style={{ width: "800px", height: "200px", cursor: 'zoom-in' }}>
            <img
              src={selectedBanner.bannerImage || '/images/default-banner.png'}
              style={{ width: "800px", height: "200px" }}
              alt="배너 미리보기"
              onClick={() => openModal(selectedBanner.bannerImage)}
            />
          </div>
          <div className="user-info">
            <h4>상세 정보</h4>
            <p><strong>렌탈샵명:</strong> {selectedBanner.rentName}</p>
            <p><strong>통합 별점평균:</strong> {selectedBanner.averageRating}</p>
            <p><strong>최근7일 별점평균:</strong> {selectedBanner.recent7dRating}</p>
            <p><strong>입찰가:</strong> {selectedBanner.cpcBid}</p>
            <p><strong>이전반려사유:</strong> {selectedBanner.comments}</p>
            <p><strong>요청일:</strong> {selectedBanner.registDay?.split('T')[0]}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-approve" onClick={handleApprove}>승인</button>
            <button className="btn-withdraw" onClick={handleReject} style={{ marginLeft: '10px' }}>반려</button>
          </div>
        </div>
      )}

      {modalImage && (
        <div
          className="image-modal"
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <img
            src={modalImage}
            alt="확대 이미지"
            style={{ maxWidth: '90%', maxHeight: '90%', border: '3px solid white' }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerApprovalTable;
