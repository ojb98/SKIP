import { faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../pagination";
import { deleteUserReviewApi, getUserReviewListApi } from "../../api/reviewApi";

const UserReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [period, setPeriod] = useState("3months");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  useEffect(() => {
    fetchReviews();
  }, [period, page]);

  const fetchReviews = async () => {
    const startDate = getStartDate(period);
    const params = {
      startDate,
      page,
      size,
    };
    try {
      const response = await getUserReviewListApi({ startDate, page, size });

      console.log("API 전체 응답:", response);
      console.log("response.data:", response.data);
      console.log("response.data.content", response.data.content);

      setReviews(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("리뷰 불러오기 실패:", error);
    }
  };

  const getStartDate = (period) => {
    const now = new Date();
    if (period === "1week") now.setDate(now.getDate() - 7);
    else if (period === "1month") now.setMonth(now.getMonth() - 1);
    else now.setMonth(now.getMonth() - 3);
    return now.toISOString();
  }

  // 리뷰 수정
  const handleEdit = (reviewId) => {
  const popup = window.open(
    `/reviews/edit/${reviewId}`,
    "_blank",
    "width=650,height=800"
  );
  if (popup) {
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        fetchReviews(); // 팝업 닫힌 후 목록 갱신
      }
    }, 500);
    popup.focus();
  }
};

  // 리뷰 삭제
  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteUserReviewApi(reviewId);
      alert("리뷰가 삭제되었습니다.");
      fetchReviews();
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  }

  console.log("리뷰 목록:", reviews);

  return (
    <div>
      <div className="m-[15px]">
        <div className="flex justify-between px-[15px] pb-[15px] border-b border-[#cecece]">
          <h2 className="text-[24px] font-bold">
            내가 작성한 리뷰
            <span className="text-[14px] text-red-500 ml-1.5">
              Review는 3개월 후 자동 삭제됩니다.
            </span>
          </h2>
          <div className="flex justify-end">
            <select
              className="ml-4 px-3 w-[100px] border rounded border-[#cdcdcd]"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="1week">1주일</option>
              <option value="1month">1개월</option>
              <option value="3months">3개월</option>
            </select>
          </div>
        </div>
        {reviews.length === 0 ? (
          <div className="p-5 text-center text-gray-500">작성된 리뷰가 없습니다.</div>
        ) : (
          reviews.map((review) => (
            <div className="mt-5 mx-2.5">
              <div
                className="p-5 border border-[#ddd] rounded-[5px] bg-white flex"
                style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <div>
                  <Link to={`/rent/product/${review.rentId}/${review.itemId}`}>
                    <h4 className="text-[18px] font-bold"><FontAwesomeIcon icon={faTag} className="mr-1.5 text-blue-500 !align-middle" />리뷰아이템이름</h4>
                    <p className="text-[14px] font-bold ml-5">옵션: {review.size}</p>
                    <img
                      // src={`${__APP_BASE__}${review.itemImage}`}
                      src={`${__APP_BASE__}${review.itemImage}`}
                      alt={review.itemName}
                      className="w-[180px] h-[180px] mt-[5px] border-[#cecece]"
                    />
                  </Link>
                </div>
                <div className="mx-4.5 py-2.5 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div>
                        {Array.from({ length: 5 }, (_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            style={{ color: i < Number(review.rating || 0) ? "#e9d634" : "#bfbfbf" }}
                          />
                        ))}
                      </div>
                      <p className="mt-1.5 text-[14px]">{review.content}</p>
                      {review.image &&
                        <img
                          className="w-[140px] h-[120px] mt-1.5"
                          src={`${__APP_BASE__}${review.image}`}
                          alt="리뷰 이미지"
                        />}
                    </div>
                    <div className="mt-2.5 ml-2 text-[14px]">
                      <p className="w-[90px]">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  {review.replyId && (
                    <div className="mt-[20px] flex justify-between">
                      <div>
                        <p>
                          └
                          <span className="text-[14px]">
                            <strong className="answer-icon">답변</strong> {review.replyContent}
                          </span>
                        </p>
                      </div>
                      <div className="mt-2.5 ml-2 text-[14px]">
                        <p className="w-[90px]">{formatDate(review.replyCreatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 flex flex-col justify-between">
                  <div className="text-center font-bold w-[80px]">
                    <p>{review.replyId ? "답변완료" : "미답변"}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleEdit(review.reviewId)}
                      className="text-blue-500 border border-blue-500 rounded-[5px] cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(review.reviewId)}
                      className="text-blue-500 border border-blue-500 rounded-[5px] cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          size={5}
        />
      </div>
    </div>
  )
}

//날짜열 문자 포맷
const formatDate = (isoString) => {
  return isoString ? isoString.slice(0, 10) : "-";
}

export default UserReviewList;