import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteQnaByAdminApi, getQnaListByAdminApi } from "../../api/qnaApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const AdminQnaList = () => {

  const [qnaList, setQnaList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("username");
  const [searchParams, setSearchParams] = useState({ isSearchMode: false, searchType: "username", searchKeyword: ""});
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

        const data = await getQnaListByAdminApi(rentId, null, username, itemName, null, page, size);
        setQnaList(data.content);
        setCheckedItems(Array(data.content.length).fill(false));
        setAnswers(data.content.map(() => ({ answers: "", saved: false})));
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch(err) {
        console.error("QnA 불러오기 실패:", err);
      }
    };
    fetchQnaList();
  },[page, searchParams]);

  useEffect(() => {
    setOpenIndex(null);
  },[page]);

    useEffect(() => {
    setOpenIndex(null);
  },[searchParams]);

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

  const handleSearch = async () => {
    if(!searchKeyword.trim()) {
      alert("검색조건을 입력하세요.");
      return;
    }
    setSearchParams({ isSearchMode: true, searchType, searchKeyword});
    setPage(0);
  }

  const handleViewAll = async () => {
    setSearchParams({ isSearchMode: false, searchType: "username", searchKeyword: ""});
    setSearchType("username");
    setSearchKeyword("");
    setPage(0);
  }

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  const handleAnswerchange = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);
  }

  const handleSave = (index) => {
    const updated = [...answers];
    updated[index].saved = true;
    setAnswers(updated);
  }

  const pagenation = () => {
    const pageButtons = [];
    const startPage = Math.floor(page / 10) * 10;
    const endPage = Math.min(startPage + 10, totalPages);

    for (let i = startPage; i < endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={i === page ? "active" : ""}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="admin-pagenation">
        {startPage > 0 && <button onClick={() => setPage(startPage - 1)}>이전</button>}
        {pageButtons}
        {endPage < totalPages && <button onClick={() => setPage(endPage)}>다음</button>}
      </div>
    )
  }

  const handleDelete = async () => {
    const toDelete = qnaList.filter((_, index) => checkedItems[index]);
    if(toDelete.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if(!confirmed) return;

    try {
      for(let qna of toDelete) {
        await deleteQnaByAdminApi(qna.qnaId, rentId);
      }
      alert("삭제가 완료되었습니다.");
      
      setPage(0);
      setSearchParams({ ...searchParams});
    } catch(err) {
      console.error("삭제 실패:", err);
    }
  }
  

  return (
    <div>
      <div className="table-container">
        <div className="flex">
          <button 
            onClick={handleViewAll} 
            style={{ cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', marginBottom: "25px" }}>
            <h3><FontAwesomeIcon icon={faComments} /> Q&A 리스트</h3>
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
             onKeyDown={(e) => {if(e.key === 'Enter') handleSearch();}}
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
                <td onClick={() => handleToggle(index)}>{qna.title}</td>
                <td onClick={() => handleToggle(index)}>{qna.username}</td>
                <td onClick={() => handleToggle(index)}>{qna.createdAt?.substring(0, 10)}</td>
              </tr>
              {openIndex === index && (
                <tr className="no-hover">
                  <td colSpan={6}>
                    <div className="p-4 bg-gray-50">
                      <p className="mb-2 text-left"><strong>문의 내용:</strong> {qna.content}</p>
                      {answers[index].saved ? (
                        <p className="text-left"><strong>답변:</strong> {answers[index].answer}</p>
                      ) : (
                        <>
                          <textarea
                            placeholder="답변을 입력하세요."
                            className="w-full mt-2 p-2 border rounded resize-none"
                            rows="3"
                            value={answers[index].answer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                          />
                          <button
                            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded cursor-pointer"
                            onClick={() => handleSave(index)}
                          >
                            답변 저장
                          </button>
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
        ): (
          pagenation()
        )}
      </div>
    </div>
  )
}
export default AdminQnaList;