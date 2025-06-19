import React from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
// import { deleteReviewByAdmin, getReviewListForAdmin } from "../../api/reviewApi";
// import { createReviewReply, deleteReviewReply, getReplySummary, getReviewReplyByReviewId, updateReviewReply } from "../../api/reviewReplyApi";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import AdminPagination from "../adminpage/AdminPagination";

const AdminReviewList = () => {
  const profile = useSelector((state) => state.loginSlice);
  const userId = profile?.userId;

  // const [reviewList, setReviewList] = useState([]);
  // const [answers, setAnswers] = useState([]);
  // const [answerErrors, setAnswerErrors] = useState([]);
  // const [openIndex, setOpenIndex] = useState(null);
  // const [page, setPage] = useState(0);
  // const [totalElements, setTotalElements] = useState(0);
  // const [searchType, setSearchType] = useState("username");
  // const [searchKeyword, setSearchKeyword] = useState("");
  // const [searchparams, setSearchParams] = useState({ isSearchMode: false, searchType: "username", searchKeyword: "" });
  // const [checkedItems, setCheckedItems] = useState([]);
  // const [allchecked, setAllChecked] = useState(false);
  // const size = 10;

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       setOpenIndex(null);

  //       const username = searchparams.isSearchMode && searchparams.searchType === "username" ? searchparams.searchKeyword : null;
  //       const itemName = searchparams.isSearchMode && searchparams.searchType === "name" ? searchparams.searchKeyword : null;

  //       const data = await getReviewListForAdmin(username, itemName, null, page, size);

  //     if (!data || !Array.isArray(data.content)) {
  //       console.error("리뷰 API 응답이 예상과 다릅니다:", data);
  //       setReviewList([]);
  //       setAnswers([]);
  //       setAnswerErrors([]);
  //       setCheckedItems([]);
  //       setAllChecked(false);
  //       setTotalElements(0);
  //       return;
  //     }

  //       setReviewList(data.content);
  //       setTotalElements(data.totalElements);
  //       setCheckedItems(Array(data.content.length).fill(false));
  //       setAllChecked(false);

  //       const replyList = await Promise.all(
  //         data.content.map(async (review) => {
  //           try {
  //             const reply = await getReplySummary(review.reviewId);
  //             if (reply && reply.content) {
  //               return {
  //                 answer: reply.content,
  //                 originalAnswer: reply.content,
  //                 username: reply.username,
  //                 userId: reply.userId,
  //                 createdAt: reply.createdAt,
  //                 updatedAt: reply.updatedAt,
  //                 saved: true,
  //                 editing: false,
  //               };
  //             } else {
  //               return {
  //                 answer: "",
  //                 originalAnswer: "",
  //                 saved: false,
  //                 editing: true,
  //               };
  //             }
  //           } catch (err) {
  //             return {
  //               answer: "",
  //               originalAnswer: "",
  //               saved: false,
  //               editing: true,
  //             };
  //           }
  //         })
  //       );
  //       setAnswers(replyList);
  //       setAnswerErrors(Array(data.content.length).fill(""));
  //     } catch (err) {
  //       console.error("리뷰 목록 조회 실패:", err);
  //     }
  //   };
  //   fetchReviews();
  // }, [page, searchparams]);

  // const handleAllCheck = () => {
  //   const newChecked = !allchecked;
  //   setAllChecked(newChecked);
  //   setCheckedItems(Array(reviewList.length).fill(newChecked));
  // };

  // const handleItemCheck = (index) => {
  //   const updated = [...checkedItems];
  //   updated[index] = !updated[index];
  //   setCheckedItems(updated);
  //   setAllChecked(updated.every((checked) => checked));
  // }

  // const handleToggle = (index) => {
  //   const updatedAnswers = [...answers];
  //   const updatedErrors = [...answerErrors];

  //   if (openIndex === index) {
  //     setOpenIndex(null);
  //   } else {
  //     updatedAnswers[index].answer = updatedAnswers[index].originalAnswer || "";
  //     updatedAnswers[index].editing = false;
  //     updatedErrors[index] = "";
  //     setAnswers(updatedAnswers);
  //     setAnswerErrors(updatedErrors);
  //     setOpenIndex(index);
  //   }
  // }

  // const handleSave = async (index, reviewId) => {
  //   const reply = answers[index];

  //   if (!reply.answer.trim()) {
  //     const updatedErrors = [...answerErrors];
  //     updatedErrors[index] = "답변을 입력해주세요.";
  //     setAnswerErrors(updatedErrors);
  //     return;
  //   }

  //   try {
  //     if (reply.saved) {
  //       await updateReviewReply(reviewId, { content: reply.answer });
  //     } else {
  //       await createReviewReply({ reviewId, content: reply.answer });
  //     }
  //     const newReply = await getReplySummary(reviewId);
  //     const updated = [...answers];
  //     updated[index] = {
  //       answer: newReply.content,
  //       originalAnswer: newReply.content,
  //       userId : newReply.userId,
  //       username: newReply.username,
  //       createdAt: newReply.createdAt,
  //       updatedAt: newReply.updatedAt,
  //       saved: true,
  //       editing: false
  //     };
  //     setAnswers(updated);
  //     alert("답변이 저장되었습니다.");
  //   } catch (err) {
  //     console.error("답변 저장 실패:", err);
  //     alert("답변 저장에 실패했습니다.");
  //   }
  // };

  // const handleDeleteSelected = async () => {
  //   const selectedReviews = reviewList.filter((_, idx) => checkedItems[idx]);
  //   if (selectedReviews.length === 0) {
  //     alert("삭제할 리뷰를 선택하세요.");
  //     return;
  //   }
  //   const confirmed = window.confirm("정말 삭제하시겠습니까?");
  //   if (!confirmed) return;

  //   try {
  //     for (let review of selectedReviews) {
  //       await deleteReviewByAdmin(review.reviewId);
  //     }
  //     alert("선택한 리뷰가 삭제되었습니다.");
  //     setPage(0);
  //     setSearchParams({ ...searchparams });
  //   } catch (err) {
  //     console.error("삭제 실패:", err);
  //     alert("선택한 리뷰 삭제 실패하였습니다.");
  //   }
  // };

  // const handleDeleteReply = async (index, reviewId) => {
  //   const confirmed = window.confirm("정말 삭제하시겠습니까?");
  //   if (!confirmed) return;
  //   try {
  //     await deleteReviewReply(reviewId);
  //     const updated = [...answers];
  //     updated[index] = { answer: "", originalAnswer: "", saved: false, editing: true };
  //     setAnswers(updated);
  //     alert("답변이 삭제되었습니다.");
  //   } catch (err) {
  //     console.error("삭제 실패:", err);
  //     alert("답변 삭제 실패");
  //   }
  // };

  // const handleAnswerchange = (index, value) => {
  //   const updated = [...answers];
  //   updated[index].answer = value;
  //   setAnswers(updated);

  //   const updatedErrors = [...answerErrors];
  //   updatedErrors[index] = "";
  //   setAnswerErrors(updatedErrors);
  // }

  // const handleCancelEdit = (index) => {
  //   const updated = [...answers];
  //   updated[index] = {
  //     ...updated[index],
  //     answer: updated[index].originalAnswer,
  //     editing: false,
  //   };
  //   setAnswers(updated);
  // };

  // const handleSearch = () => {
  //   if (!searchKeyword.trim()) {
  //     alert("검색어를 입력하세요.");
  //     return;
  //   }
  //   setSearchParams({ isSearchMode: true, searchType, searchKeyword });
  //   setPage(0);
  // };

  // const handleViewAll = () => {
  //   setSearchParams({ isSearchMode: false, searchType: "username", searchKeyword: "" });
  //   setSearchType("username");
  //   setSearchKeyword("");
  //   setPage(0);
  // };

  // const renderStars = (count) => {
  //   return Array.from({ length: 5 }, (_, i) => (
  //     <FontAwesomeIcon
  //       key={i}
  //       icon={faStar}
  //       style={{ color: i < count ? "#e9d634" : "#bfbfbf" }}
  //     />
  //   ));
  // };

  return (
    <div>
      {/* <div className="table-container">
        <div className="flex">
          <button
            style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom: "25px" }}>
            <h3><FontAwesomeIcon icon={faCommentDots} /> Review 리스트</h3>
          </button>
          <div className="search-filter">
            <select
              className="filter"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="username">아이디</option>
              <option value="name">상품명</option>
            </select>
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button onClick={handleSearch}>검색</button>
            <button onClick={handleViewAll}>전체보기</button>
            <button onClick={handleDeleteSelected}>삭제</button>
          </div>
        </div>
        <table className="user-table mt-5">
          <thead>
            <tr>
              <th className="w-[60px]">
                <input
                  type="checkbox"
                  className="align-middle"
                  checked={allchecked}
                  onChange={handleAllCheck}
                />
              </th>
              <th className="w-[120px]">상태</th>
              <th className="w-[120px]">별점</th>
              <th>상품</th>
              <th>리뷰</th>
              <th className="w-[120px]">작성자</th>
              <th className="w-[120px]">작성일</th>
            </tr>
          </thead>
          <tbody>
            {reviewList.map((review, index) => (
              <React.Fragment key={review.reviewId}>
                <tr className="hover:bg-gray-100" onClick={() => handleToggle(index)}>
                  <td>
                    <input
                      type="checkbox"
                      className="align-middle"
                      checked={checkedItems[index]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleItemCheck(index)}
                    />
                  </td>
                  <td>{answers[index]?.saved ? "답변 완료" : "미답변"}</td>
                  <td>{renderStars(review.rating)}</td>
                  <td>{review.itemName}</td>
                  <td className="overflow-hidden overflow-ellipsis whitespace-nowrap">{review.content}</td>
                  <td>{review.username}</td>
                  <td>{review.createdAt?.substring(0, 10)}</td>
                </tr>
                {openIndex === index && (
                  <tr className="no-hover">
                    <td colSpan={7}>
                      <div className="p-4 bg-gray-50">
                        <p className="mb-2 text-left">
                          <strong>리뷰 내용:</strong> {review.content}
                          <div>
                             {review.image &&
                              <img
                                  className="w-[140px] h-[120px] mt-1.5"
                                  src = {`http://localhost:8080${review.image}`}
                                  alt="${review.image}" 
                              />}
                          </div>
                          {review.updatedAt && review.updatedAt !== review.createdAt && (
                            <span className="text-[12px] text-gray-500 ml-6 self-center">
                              (수정일: {review.updatedAt.replace('T', '').substring(0, 19)})
                            </span>
                          )}
                        </p>

                        {answers[index].saved && !answers[index].editing ? (
                          <div className="text-left mt-3 flex items-center">
                            <div className="flex-1">
                              <p className="inline-block">
                                <span>┗</span>
                                <strong className="ml-0.5 answer-icon">답변</strong> {answers[index].answer}
                              </p>
                              <div className="text-right mt-2.5 mr-5">
                                {answers[index].updatedAt && answers[index].createdAt !== answers[index].updatedAt && (
                                  <span className="text-[12px] text-gray-600 ml-2">
                                    수정일: {answers[index].updatedAt.replace('T', ' ').substring(0, 19)}
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    console.log("현재 로그인 userId:", userId);
                                    console.log("답변 작성자 userId:", answers[index]?.userId);

                                    if (Number(answers[index]?.userId) !== Number(userId)) {
                                      alert("작성자만 수정할 수 있습니다.");
                                      return;
                                    }
                                    const updated = [...answers];
                                    updated[index] = {
                                      ...updated[index],
                                      answer: updated[index].originalAnswer,
                                      editing: true,
                                    };
                                    setAnswers(updated);
                                  }}
                                  className="ml-2 px-2 py-1 text-sm bg-[#5399f5] text-white rounded cursor-pointer"
                                >
                                  수정
                                </button>

                                <button
                                  onClick={() => {
                                    if (Number(answers[index]?.userId) !== Number(userId)) {
                                      alert("작성자만 삭제할 수 있습니다.");
                                      return;
                                    }
                                    handleDeleteReply(index, review.reviewId);
                                  }}
                                  className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded cursor-pointer"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600 items-center">
                              <span className="text-[13px]">답변자: {answers[index].username}</span>
                              <span className="text-[13px]">작성일: {answers[index].updatedAt?.replace('T', ' ').substring(0, 19)}</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <textarea
                              placeholder="답변을 입력하세요. (100자를 초과할 수 없습니다.)"
                              className="w-full mt-2 p-2 border rounded resize-none"
                              rows="3"
                              maxLength={100}
                              value={answers[index].answer}
                              onChange={(e) => handleAnswerchange(index, e.target.value)}
                            />
                            {answerErrors[index] && (
                              <p className="text-red-500 text-sm mt-1.5">{answerErrors[index]}</p>
                            )}

                            {answers[index].saved ? (
                              <div className="mt-2 flex justify-center gap-2">
                                <button
                                  className="px-4 py-1 bg-[#5399f5] text-white rounded cursor-pointer"
                                  onClick={() => handleSave(index, review.reviewId)}
                                >
                                  수정 완료
                                </button>
                                <button
                                  className="px-4 py-1 bg-gray-400 text-white rounded cursor-pointer"
                                  onClick={() => handleCancelEdit(index)}
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <button
                                className="mt-2 px-4 py-1 bg-[#5399f5] text-white rounded cursor-pointer"
                                onClick={() => handleSave(index, review.reviewId)}
                              >
                                답변 저장
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <AdminPagination
          currentPage={page + 1}
          totalItems={totalElements}
          pageSize={size}
          groupSize={10}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </div> */}
    </div>
  )
}

export default AdminReviewList;