const ReviewList=()=>{

  const reviews = [
    {
      id: 1,
      rating: 4,
      userId: "abc***",
      date: "2025-05-01",
      productName: "리프트 1일권",
      content: "재밌고 좋았어요!",
      image: "/images/1.png"
    },
    {
      id: 2,
      rating: 5,
      userId: "xyz***",
      date: "2024-05-03",
      productName: "스키 세트",
      content: "장비 상태도 좋고, 대여도 편리했어요.",
      image: "/images/2.png"
    }
  ]

  return(
    <div className="review-wrapper">
      <div className="review-header">
        <div className="review-summary">
          <div>
            <span className="mx-1.5">전체리뷰수</span>
            <span>100건</span>
          </div>
          <div>
            <span className="mx-1.5">평점</span>
            <span>4.5점</span>
          </div>
        </div>
        <div className="review-sort">
          <a href="#none" className="active">최신순</a>
          <a href="#none">평점높은순</a>
          <a href="#none">평점낮은순</a>
        </div>
      </div>
      <div className="review-list">
        <ul>
          {
            reviews.map((review)=>(
              <li key={review.id} className="review-item">
                <div className="review-left">
                  <div className="review-rating">
                    <span>{review.rating}점</span>
                  </div>
                  <div className="review-info">
                    <span className="review-user">{review.userId}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-product">
                    <span>{review.productName}</span>
                  </div>
                  <div className="review-content">
                    <span>{review.content}</span>
                  </div>
                </div>
                <div className="review-right">
                  <img src={review.image} />
                </div>
              </li>
            ))
          }
        </ul>
        <div>
        <div className="pagelist">
          <a href="#none">이전</a>
          <a href="#none" className="active">1</a>
          <a href="#none">2</a>
          <a href="#none">다음</a>
        </div>
      </div>
      </div>
    </div>
  )
}
export default ReviewList;