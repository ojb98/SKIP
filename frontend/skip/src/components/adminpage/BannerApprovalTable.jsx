import React, { useEffect, useState, useMemo } from 'react';
import '../../css/userlist.css';
import {
  fetchWaitingBanners,
  approveBanner,
  rejectBanner
} from '../../services/admin/BannerService';
import AdminPagination from './AdminPagination';

const BannerApprovalTable = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 이번 주 월요일 오전 3시
  const getThisWeekMonday3AM = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (9 - day) % 7 || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(3, 0, 0, 0);
    return monday.toISOString().split('T')[0] + ' 오전 3시';
  };
  const registDay = getThisWeekMonday3AM();

  // API 호출
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

  // 현재 페이지에 보여줄 슬라이스
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return banners.slice(start, start + pageSize);
  }, [banners, currentPage, pageSize]);

  const handleRowClick = banner => {
    setSelectedBanner(sb =>
      sb?.waitingId === banner.waitingId ? null : banner
    );
  };

  const handleApprove = async () => {
    if (!selectedBanner) return;
    if (!window.confirm('승인하시겠습니까?')) return;
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
    if (reason == null) return;
    try {
      await rejectBanner(selectedBanner.waitingId, reason);
      await loadBanners();
      setSelectedBanner(null);
    } catch (e) {
      console.error('반려 실패', e);
      alert('반려 중 오류가 발생했습니다.');
    }
  };

  const openModal = imageUrl => setModalImage(imageUrl);
  const closeModal = () => setModalImage(null);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="table-container">
      <h3 style={{ marginBottom: '20px' }}>
        📝 요청 배너 승인
        <span style={{ fontSize: '14px', marginLeft: '10px', color: '#555' }}>
          📅 {registDay}(월) 등록 예정
        </span>
      </h3>

      <table className="user-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>대기 고유ID</th>
            <th>렌탈샵명</th>
            <th>CPC</th>
            <th>상태</th>
            <th>요청일</th>
            <th>수정일</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBanners.length > 0 ? (
            paginatedBanners.map((banner, idx) => {
              const globalIndex = (currentPage - 1) * pageSize + idx + 1;
              const created = banner.createdAt?.split('T')[0];
              const updated = banner.updatedAt?.split('T')[0];
              return (
                <tr
                  key={banner.waitingId}
                  onClick={() => handleRowClick(banner)}
                  className={
                    selectedBanner?.waitingId === banner.waitingId
                      ? 'selected-row'
                      : ''
                  }
                >
                  <td>{globalIndex}</td>
                  <td>{banner.waitingId}</td>
                  <td>{banner.rentName}</td>
                  <td>{banner.cpcBid}</td>
                  <td>{banner.status}</td>
                  <td>{created}</td>
                  <td>{updated && updated !== created ? updated : '-'}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">배너 요청이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* AdminPagination 컴포넌트로 대체 */}
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

      {selectedBanner && (
        <div className="user-detail-card">
          <div
            className="user-section"
            style={{ width: '1100px', height: '250px', cursor: 'zoom-in' }}
          >
            <img
              src={selectedBanner.bannerImage || '/images/default-banner.png'}
              style={{ width: '1100px', height: '250px' }}
              alt="배너 미리보기"
              onClick={() => openModal(selectedBanner.bannerImage)}
            />
          </div>
          <div className="user-info" style={{ width: '250px' }}>
            <h4><strong>👀미리보기</strong></h4>
            <p>
              <strong>렌탈샵명:</strong> {selectedBanner.rentName}
            </p>
            <p>
              <strong>통합 별점평균:</strong> {selectedBanner.averageRating}
            </p>
            <p>
              <strong>최근7일 별점평균:</strong> {selectedBanner.recent7dRating}
            </p>
            <p>
              <strong>입찰가:</strong> {selectedBanner.cpcBid}
            </p>
            {selectedBanner.status === 'WITHDRAWN' && (
              <p>
                <strong>이전 반려 사유:</strong><br />
                {selectedBanner.comments}
              </p>
            )}
            <p>
              <strong>요청일:</strong> {selectedBanner.createdAt?.split('T')[0]}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-approve" onClick={handleApprove}>
              승인
            </button>
            <button
              className="btn-withdraw"
              onClick={handleReject}
              style={{ marginLeft: '10px' }}
            >
              반려
            </button>
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
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              border: '3px solid white'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerApprovalTable;
