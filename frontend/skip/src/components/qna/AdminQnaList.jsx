import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteQnaByAdminApi, getQnaListByAdminApi, getUnansweredCountApi } from "../../api/qnaApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faLock } from "@fortawesome/free-solid-svg-icons";
import { createReply, deleteReply, getReplySummary, updateReply } from "../../api/qnaReplyApi";
import AdminPagination from "../adminpage/AdminPagination";
import { useSelector } from "react-redux";

const AdminQnaList = () => {
  const profile = useSelector((state) => state.loginSlice);
  const userId = profile?.userId;

  const [qnaList, setQnaList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerErrors, setAnswerErrors] = useState([]);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("username");
  const [searchParams, setSearchParams] = useState({ isSearchMode: false, searchType: "username", searchKeyword: "" });
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;
  const rentId = 2;

  useEffect(() => {
    const fetchQnaList = async () => {
      try {
        const username = searchParams.isSearchMode && searchParams.searchType === "username" ? searchParams.searchKeyword : null;
        const itemName = searchParams.isSearchMode && searchParams.searchType === "name" ? searchParams.searchKeyword : null;
        const status = searchParams.isSearchMode && searchParams.searchType === "status" ? searchParams.searchKeyword : null;
        const hasReply = searchParams.isSearchMode && searchParams.searchType === "hasReply" ? searchParams.searchKeyword === "false" ? false : true : null;

        const data = await getQnaListByAdminApi(rentId, status, username, itemName, null, hasReply, page, size);
        setQnaList(data.content);
        setCheckedItems(Array(data.content.length).fill(false));

        const answerStates = await Promise.all(
          data.content.map(async (qna) => {
            try {
              const reply = await getReplySummary(qna.qnaId);
              if (reply) {
                return {
                  answer: reply.content,
                  originalAnswer: reply.content,
                  userId: reply.userId,
                  username: reply.username,
                  updatedAt: reply.updatedAt,
                  createdAt: reply.createdAt,
                  saved: true,
                  editing: false,
                };
              } else {
                return {
                  answer: "",
                  originalAnswer: "",
                  saved: false,
                  editing: false,
                };
              }
            } catch (err) {
              return {
                answer: "",
                originalAnswer: "",
                saved: false,
                editing: false,
              };
            }
          })
        )
        setAnswers(answerStates);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("QnA 불러오기 실패:", err);
      }
    };
    fetchQnaList();
  }, [page, searchParams]);

  useEffect(() => {
    setOpenIndex(null);
  }, [page]);

  useEffect(() => {
    setOpenIndex(null);
  }, [searchParams]);

  const handleAllCheck = () => {
    const newChecked = !allChecked;
    setAllChecked(newChecked);
    setCheckedItems(Array(qnaList.length).fill(newChecked));
  }

  const handleItemCheck = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  }

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert("검색조건을 입력하세요.");
      return;
    }
    setSearchParams({ isSearchMode: true, searchType, searchKeyword });
    setPage(0);
  }

  const handleViewAll = () => {
    setSearchParams({ isSearchMode: false, searchType: "username", searchKeyword: "" });
    setSearchType("username");
    setSearchKeyword("");
    setPage(0);
  }

  const handleToggle = (index) => {
    const updatedAnswers = [...answers];
    const updatedErrors = [...answerErrors];

    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      updatedAnswers[index].answer = updatedAnswers[index].originalAnswer || "";
      updatedAnswers[index].editing = false;
      updatedErrors[index] = "";
      setAnswers(updatedAnswers);
      setAnswerErrors(updatedErrors);
      setOpenIndex(index);
    }
  }

  const handleAnswerchange = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);

    const updatedErrors = [...answerErrors];
    updatedErrors[index] = "";
    setAnswerErrors(updatedErrors);
  }

  const handleSave = async (index, qnaId) => {
    const answerText = answers[index].answer;

    if (!answerText) {
      const updatedErrors = [...answerErrors];
      updatedErrors[index] = "답변을 입력해주세요.";
      setAnswerErrors(updatedErrors);
      return;
    }

    try {
      if (answers[index].saved) {
        // 저장된 답변이면 -> 수정
        await updateReply(qnaId, { content: answerText, userId: userId, });
      } else {
        // 없던 답변이면 -> 새로 저장
        await createReply({ qnaId, userId, content: answerText });
      }

      // 다시 요약 조회 후 상태 갱신
      const reply = await getReplySummary(qnaId);
      const updated = [...answers];
      updated[index] = {
        answer: reply.content,
        originalAnswer: reply.content,
        userId: reply.userId,
        username: reply.username,
        updatedAt: reply.updatedAt,
        createdAt: reply.createdAt,
        saved: true,
        editing: false
      };
      setAnswers(updated);
      alert("답변이 저장되었습니다.");
    } catch (err) {
      alert("답변 저장 실패");
      console.error(err);
    }
  }

  // Q&A 삭제
  const handleDelete = async () => {
    const toDelete = qnaList.filter((_, index) => checkedItems[index]);
    if (toDelete.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      for (let qna of toDelete) {
        await deleteQnaByAdminApi(qna.qnaId, rentId);
      }
      alert("삭제가 완료되었습니다.");

      setPage(0);
      setSearchParams({ ...searchParams });
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  }

  // Q&A 답변 삭제
  const handleDeleteReply = async (index, qnaId) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await deleteReply(qnaId, userId);
      const updated = [...answers];
      updated[index] = { answer: "", saved: false, editing: false };
      setAnswers(updated);
      alert("답변이 삭제되었습니다.");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("답변 삭제 실패");
    }
  }

  // 수정 취소 버튼
  const handleCancelEdit = (index) => {
    const updated = [...answers];
    updated[index] = {
      ...updated[index],
      answer: updated[index].originalAnswer,
      editing: false,
    };
    setAnswers(updated);
  }

  // 미답변 갯수
  useEffect(() => {
    const fetchUnansweredCount = async () => {
      try {
        const count = await getUnansweredCountApi(rentId);
        setUnansweredCount(count);
      } catch (err) {
        console.error("미답변 수 불러오기 실패:", err);
      }
    };
    fetchUnansweredCount();
  }, []);

  return (
    <div>
      <div className="table-container">
        <div className="flex">
          <button
            onClick={handleViewAll}
            style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom: "25px" }}>
            <h3><FontAwesomeIcon icon={faComments} /> Q&A 리스트</h3>
          </button>
          <Link
            onClick={() => {
              setSearchParams((prev) => ({
                ...prev,
                isSearchMode: true,
                searchType: "hasReply",
                searchKeyword: "false",
              }));
              setPage(0);
            }}
            className="text-red-500 text-[12px] underline cursor-pointer inline-block self-start mt-[3px] ml-3.5"
          >
            미답변: {unansweredCount} 개
          </Link>
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
            <button onClick={handleDelete}>삭제</button>
          </div>
        </div>
        <table className="user-table mt-5">
          <thead>
            <tr>
              <th className="w-[60px]">
                <input
                  type="checkbox"
                  className="align-middle"
                  checked={allChecked}
                  onChange={handleAllCheck}
                />
              </th>
              <th className="w-[120px]">상태</th>
              <th>상품</th>
              <th>제목</th>
              <th className="w-[120px]">작성자</th>
              <th className="w-[120px]">작성일</th>
            </tr>
          </thead>
          <tbody>
            {qnaList.map((qna, index) => (
              <React.Fragment key={qna.qnaId || index}>
                <tr className="hover:bg-gray-100">
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="align-middle"
                      checked={checkedItems[index]}
                      onChange={() => handleItemCheck(index)}
                    />
                  </td>
                  <td onClick={() => handleToggle(index)}>
                    {answers[index]?.saved ? "답변 완료" : "미답변"}
                  </td>
                  <td onClick={() => handleToggle(index)}>{qna.itemName}</td>
                  <td onClick={() => handleToggle(index)}>
                    {qna.title}
                    {qna.secret && (
                      <FontAwesomeIcon icon={faLock} className="ml-1.5" />
                    )}
                  </td>
                  <td onClick={() => handleToggle(index)}>{qna.username}</td>
                  <td onClick={() => handleToggle(index)}>{qna.createdAt?.substring(0, 10)}</td>
                </tr>
                {openIndex === index && (
                  <tr className="no-hover">
                    <td colSpan={6}>
                      <div className="p-4 bg-gray-50">
                        <p className="mb-2 text-left">
                          <strong>문의 내용:</strong> {qna.content}
                          {qna.updatedAt && qna.updatedAt !== qna.createdAt && (
                            <span className="text-[12px] text-gray-500 ml-6 self-center">
                              (수정일: {qna.updatedAt.replace('T', ' ').substring(0, 19)})
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
                                {/* ✅ 버튼은 항상 보이되 클릭 시 권한 체크 */}
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
                                    handleDeleteReply(index, qna.qnaId);
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
                                  onClick={() => handleSave(index, qna.qnaId)}
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
                                onClick={() => handleSave(index, qna.qnaId)}
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
        {qnaList.length === 0 ? (
          <div className="text-center font-bold text-gray-500 mt-5">
            문의가 존재하지 않습니다.
          </div>
        ) : (
          <AdminPagination
            currentPage={page + 1}
            totalItems={totalElements}
            pageSize={size}
            groupSize={10}
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        )}
      </div>
    </div>
  )
}
export default AdminQnaList;