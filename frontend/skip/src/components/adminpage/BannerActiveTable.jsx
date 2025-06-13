import { useEffect, useState } from 'react';
import '../../css/userlist.css';
import { fetchActiveBanners } from '../../services/admin/BannerService';
const BannerActiveTable = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const loadBanners = async () => {
    try {
      const data = await fetchActiveBanners();
      const sorted = sortBanners(data, sortOrder);
      setBanners(Array.isArray(sorted) ? sorted : []);
    } catch (e) {
      console.error('배너 목록 로딩 실패', e);
    } finally {
      setLoading(false);
    }
  };

  const sortBanners = (data, order) => {
    return [...data].sort((a, b) =>
      order === 'desc'
        ? b.finalScore - a.finalScore
        : a.finalScore - b.finalScore
    );
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    const sorted = sortBanners(banners, newOrder);
    setBanners(sorted);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleRowClick = (banner) => {
    if (!banner || selectedBanner?.bannerId === banner.bannerId) {
      setSelectedBanner(null);
      return;
    }
    setSelectedBanner(banner);
  };

  const getNextWeekMonday3AM = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day === 0 ? 1 : 8) - day + 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(3, 0, 0, 0);
    return monday.toISOString().split('T')[0] + ' 오전 3시';
  };

  const registDay = getNextWeekMonday3AM();

  const openModal = (imageUrl) => setModalImage(imageUrl);
  const closeModal = () => setModalImage(null);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="table-container">
      <h3>
        🖼️ 등록 배너 관리<span style={{ fontSize: "14px", marginLeft: "10px", color: "#555" }}>📅 {registDay}(월) 삭제 예정</span>
      </h3>

      <table className="user-table">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={toggleSort}>
              노출 순위 {sortOrder === 'desc' ? '▲':'▼'}
            </th>
            <th>등록 고유ID</th>
            <th>렌탈샵명</th>
            <th>CPC</th>
            <th>노출점수</th>
            <th>클릭 수</th>
            <th>등록일</th>
            <th>삭제예정일</th>
          </tr>
        </thead>
        <tbody>
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <tr
                key={banner.bannerId}
                onClick={() => handleRowClick(banner)}
                className={selectedBanner?.bannerId === banner.bannerId ? 'selected-row' : ''}
              >
                <td>{index + 1}위</td>
                <td>{banner.bannerId}</td>
                <td>{banner.rentName}</td>
                <td>{banner.cpcBid}</td>
                <td>{banner.finalScore}</td>
                <td>{banner.clickCnt}</td>
                <td>{banner.uploadDate?.split('T')[0]}</td>
                <td>{banner.endDate?.split('T')[0]}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8">등록된 배너가 없습니다.</td></tr>
          )}
        </tbody>
      </table>

      {selectedBanner && (
        <div className="user-detail-card">
          <div className="user-section" style={{ width: "1100px", height: "250px", cursor: 'zoom-in' }}>
            <img
              src={selectedBanner.bannerImage || '/images/default-banner.png'}
              style={{ width: "1100px", height: "250px" }}
              alt="배너 미리보기"
              onClick={() => openModal(selectedBanner.bannerImage)}
            />
          </div>
          <div className="user-info" style={{ width: "250px" }}>
            <h4><strong>👀미리보기</strong></h4>
            <p><strong>렌탈샵명:</strong> {selectedBanner.rentName}</p>
            <p><strong>입찰가:</strong> {selectedBanner.cpcBid}</p>
            <p><strong>노출도점수:</strong> {selectedBanner.finalScore}</p>
            <p><strong>요청일:</strong> {selectedBanner.uploadDate?.split('T')[0]}</p>
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

export default BannerActiveTable;
