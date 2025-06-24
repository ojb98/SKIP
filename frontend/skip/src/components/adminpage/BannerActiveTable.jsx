import React, { useEffect, useState, useMemo } from 'react';
import '../../css/userlist.css';
import { fetchActiveBanners } from '../../services/admin/BannerService';

import AdminPagination from './AdminPagination';

const BannerActiveTable = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const host = __APP_BASE__;

  // 배너 호출
  const loadBanners = async () => {
    try {
      const data = await fetchActiveBanners();
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

  // 1) 정렬된 전체 리스트
  const sortedBanners = useMemo(() => {
    return [...banners].sort((a, b) => {
      const diff = Number(a.finalScore) - Number(b.finalScore);
      return sortOrder === 'desc' ? -diff : diff;
    });
  }, [banners, sortOrder]);

  // 2) 현재 페이지에 보일 데이터만 슬라이스
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBanners.slice(start, start + pageSize);
  }, [sortedBanners, currentPage, pageSize]);

  // 정렬 토글 (다시 1페이지로 이동)
  const toggleSort = () => {
    setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(1);
  };

  const handleRowClick = banner => {
    setSelectedBanner(sb =>
      sb?.bannerId === banner.bannerId ? null : banner
    );
  };

 
  // 다음 주 월요일 오전 3시
  const getNextMonday3AM = () => {
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    nextMonday.setHours(3, 0, 0, 0);
    return nextMonday.toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).split(' ')[0] + ' 오전 3시';
  };
  const registDay = getNextMonday3AM();

  const openModal = imageUrl => setModalImage(imageUrl);
  const closeModal = () => setModalImage(null);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="table-container">
      <h3 style={{ marginBottom: '15px' }}>
        🖼️ 등록 배너 관리
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          📅 {registDay}(월) 삭제 예정
        </span>
        <span
          style={{
            float: 'right',
            fontSize: '14px',
            marginLeft: '10px',
            color: '#555',
          }}
        >
          *배너는 노출도 순위가 높은 순으로 배치됩니다.
        </span>
      </h3>

      <table className="user-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>등록 고유ID</th>
            <th>렌탈샵명</th>
            <th>CPC</th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={toggleSort}
              title="총점 기준 정렬"
            >
              노출 순위(총점*) {sortOrder === 'desc' ? '▲' : '▼'}
            </th>
            <th>클릭 수</th>
            <th>등록일</th>
            <th>삭제예정일</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBanners.length > 0 ? (
            paginatedBanners.map((banner, idx) => {
              const globalIndex = (currentPage - 1) * pageSize + idx + 1;
              return (
                <tr
                  key={banner.bannerId}
                  onClick={() => handleRowClick(banner)}
                  className={
                    selectedBanner?.bannerId === banner.bannerId
                      ? 'selected-row'
                      : ''
                  }
                >
                  <td>{globalIndex}</td>
                  <td>{banner.bannerId}</td>
                  <td>{banner.rentName}</td>
                  <td>{banner.cpcBid}</td>
                  <td>{banner.finalScore}</td>
                  <td>{banner.clickCnt}</td>
                  <td>{banner.uploadDate?.split('T')[0]}</td>
                  <td>{banner.endDate?.split('T')[0]}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">등록된 배너가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      
      <AdminPagination
        currentPage={currentPage}
        totalItems={banners.length}
        pageSize={pageSize}
        groupSize={5}
        onPageChange={page => {
          setCurrentPage(page);
          setSelectedBanner(null);
        }}
      />

      {/* 선택 배너 상세 & 모달 */}
      {selectedBanner && (
        <div className="user-detail-card">
          <div
            className="user-section"
            style={{
              width: '1100px',
              height: '250px',
              cursor: 'zoom-in',
            }}
          >
            <img
              src={selectedBanner.bannerImage ? host + selectedBanner.bannerImage : '/images/default-banner.png'}
              style={{ width: '1100px', height: '250px' }}
              alt="배너 미리보기"              
              onClick={() => openModal(host + selectedBanner.bannerImage)}
            />
          </div>
          <div className="user-info" style={{ width: '250px' }}>
            <h4><strong>👀미리보기</strong></h4>
            <p><strong>렌탈샵명:</strong> {selectedBanner.rentName}</p>
            <p><strong>입찰가:</strong> {selectedBanner.cpcBid}</p>
            <p><strong>노출도점수:</strong> {selectedBanner.finalScore}</p>
            <p><strong>등록예정일:</strong> {selectedBanner.uploadDate?.split('T')[0]}</p>
          </div>
        </div>
      )}

      {modalImage && (
        <div
          className="image-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <img
            src={modalImage}
            alt="확대 이미지"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              border: '3px solid white',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerActiveTable;
