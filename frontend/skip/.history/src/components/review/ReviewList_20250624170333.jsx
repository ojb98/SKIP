import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviewListByItem, getReviewStatsByItem } from "../../api/reviewApi";
import Pagination from "../pagination";


const ReviewList = () => {

  const { itemId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReviewListByItem(itemId, sort, page);
        setReviews(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err) {
        console.error("리뷰 로딩 실패:", err);
      }
    }

    const fetchStats = async () => {
      try {
        const stats = await getReviewStatsByItem(itemId);
        console.log("리뷰 통계 응답:", stats);
        setReviewCount(stats.count);
        setAverageRating(stats.average?.toFixed(1) || "0.0");
      } catch (err) {
        console.error("리뷰 통계 로딩 실패:", err);
      }
    }

    console.log("요청 확인:", itemId, sort, page);

    fetchData();
    fetchStats();
  }, [itemId, sort, page]);

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        style={{ color: i < count ? "#e9d634" : "#bfbfbf" }}
      />
    ));
  }

  const maskUsername = (username) => {
    if (!username) return "";
    const visible = username.slice(0, 3);
    const masked = "*".repeat(username.length - 3 > 0 ? username.length - 3 : 0);
    return visible + masked;
  }

  return (
    <div>
      <div className="review-wrapper">
        <div className="review-header">
          <div className="review-summary">
            <div>
              <span className="mx-1.5">전체리뷰수</span>
              <span>{reviewCount}건</span>
            </div>
            <div>
              <span className="mx-1.5">평점</span>
              <span>{averageRating}점</span>
            </div>
          </div>
          <div className="review-sort">
            <button
              className={sort === "recent" ? "active" : ""}
              onClick={() => setSort("recent")}
            >
              최신순
            </button>
            <button
              className={sort === "highRating" ? "active" : ""}
              onClick={() => setSort("highRating")}
            >
              평점높은순
            </button>
            <button
              className={sort === "lowRating" ? "active" : ""}
              onClick={() => setSort("lowRating")}
            >
              평점낮은순
            </button>
          </div>
        </div>
        <div className="review-list">
          {reviews.length === 0 ? (
            <div className="text-center font-bold">해당 아이템의 리뷰가 존재하지 않습니다.</div>
          ): (
            <ul>
              {reviews.map((review) => (
                <li key={review.reviewId} className="review-item">
                  <div className="review-user">
                    <div className="review-left">
                      <div className="review-user-img">
                        {review.userImage ? (
                          <img src={`http://localhost:8080${review.userImage}`} alt="user" className="h-[100%]" />
                        ) : (
                          <div className="review-user-default-img">
                            <FontAwesomeIcon icon={faUser} className="fa-user" />
                          </div>
                        )}
                      </div>
                      <div className="review-card">
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                        <div className="review-info">
                          <span className="review-user">{maskUsername(review.username)}</span>
                          <span className="review-date">{review.createdAt.slice(0, 10)}</span>
                        </div>
                        <div className="review-product">
                          <span className="review-product-option">옵션: {review.size}</span>
                        </div>
                        <div className="review-content">
                          <span>{review.content}</span>
                        </div>
                      </div>
                    </div>
                    <div className="review-right">
                      {review.image && (
                        <img src={`http://localhost:8080${review.image}`} alt="리뷰 이미지" />
                      )}
                    </div>
                  </div>
                  {review.replyId && (
                  <div className="review-admin">
                    <div className="review-left">
                      <div className="review-user-img">
                        {review.replyAdminUserImage ? (
                          <img src={`http://localhost:8080${review.replyAdminUserImage}`} alt="admin" className="h-[100%]" />
                        ) : (
                          <div className="review-user-default-img">
                            <FontAwesomeIcon icon={faUser} className="fa-user" />
                          </div>
                        )}
                      </div>
                      <div className="review-card">
                        <div className="review-info">
                          <span className="review-admin-name">관리자</span>
                          <span className="review-date">{review.replyCreatedAt.slice(0, 10)}</span>
                        </div>
                        <div className="review-content">
                          <span className="answer-icon">답변</span>
                          <span>{review.replyContent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  )
}
export default ReviewList;