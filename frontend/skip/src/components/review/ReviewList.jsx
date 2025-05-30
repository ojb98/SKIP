import { useEffect, useState } from "react";
import { getAverageRatingApi, getItemReviewsApi } from "../../api/reviewApi";

const ReviewList=({ rentId, itemId })=>{
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("latest");
  const size = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getItemReviewsApi(rentId, itemId, page, 10, sort);
        setReviews(res.content);
        setTotalElements(res.totalElements);
      } catch (err) {
        console.error("리뷰 조회 실패:", err);
      }
    };
    fetchReviews();
  },[rentId, itemId, page, sort]);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const avg = await getAverageRatingApi(rentId, itemId);
        setAverageRating(avg.toFixed(1));
      } catch (err) {
        console.error("평균 평점 조회 실패:", err);
      }
    };
    fetchAverage();
  }, [rentId, itemId]);

  const totalPages = Math.ceil(totalElements / size);
  const currentBlock = Math.floor(page / 10);
  const startPage = currentBlock * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return(
    <div className="review-wrapper">
      <div className="review-header">
        <div className="review-summary">
          <div>
            <span className="mx-1.5">전체리뷰수</span>
            <span>{totalElements}건</span>
          </div>
          <div>
            <span className="mx-1.5">평점</span>
            <span>{averageRating}점</span>
          </div>
        </div>
        <div className="review-sort">
          <button onClick={() => setSort("latest")} className={sort === "latest" ? "active" : ""}>최신순</button>
          <button onClick={() => setSort("high")} className={sort === "high" ? "active" : ""}>평점높은순</button>
          <button onClick={() => setSort("low")} className={sort === "low" ? "active" : ""}>평점낮은순</button>
        </div>
      </div>
      <div className="review-list">
        <ul>
          {
            reviews.map((review)=>(
              <li key={review.reviewId} className="review-item">
                <div className="review-left">
                  <div className="review-rating">
                    <span>{review.rating}점</span>
                  </div>
                  <div className="review-info">
                    <span className="review-user">{review.userId}</span>
                    <span className="review-date">{review.createdAt?.substring(0,10)}</span>
                  </div>
                  <div className="review-product">
                    <span>{review.reservationItemName}</span>
                  </div>
                  <div className="review-content">
                    <span>{review.content}</span>
                  </div>
                </div>
                <div className="review-right">
                  {review.image && <img src={`http://localhost:8080${review.image}`} alt="리뷰 이미지" />}
                </div>
              </li>
            ))
          }
        </ul>
        <div>
        <div className="pagelist">
          {startPage > 0 && (
            <button onClick={() => setPage(startPage -1)}>이전</button>
          )}

          {Array.from({length: endPage - startPage}, (_, i) => (
            <button
              key={startPage + i}
              className={page === startPage + i ? "active" : ""}
              onClick={() => setPage(startPage + i)}
            >
              {startPage + i + 1}
            </button>
          ))}

          {endPage < totalPages && (
            <button onClick={() => setPage(endPage)}>다음</button>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
export default ReviewList;