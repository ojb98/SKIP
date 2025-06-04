import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getQnaListByItemApi } from "../../api/qnaApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../pagination";

const QnaList = () => {
  const { rentId, itemId } = useParams();
  const [qnaList, setQnaList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const profile = useSelector(state => state.loginSlice);
  const isLogin = !!profile.username;

  const fetchQnaList = async (pageNum) => {
    try {
      const res = await getQnaListByItemApi(itemId, null, null, pageNum);
      setQnaList(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Q&A 목록 조회 실패", err);
    }
  }

  useEffect(() => {
    fetchQnaList(page);
  }, [page]);

  const handleWriteClick = () => {
    if (!isLogin) {
      alert("로그인한 사용자만 Q&A 작성이 가능합니다.");
      return;
    }
    window.open(`/rent/product/${rentId}/${itemId}/qna/write`, "_blank", "width=600, height=600");
  }

  const toggleDetail = (index, isSecret, writerUsername) => {
    if (isSecret) {
      if (!isLogin || profile.username !== writerUsername) {
        alert("작성자만 확인이 가능합니다.");
        return;
      }
    }
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const maskUsername = (username) => {
    if (!username) return "";
    const visible = username.slice(0, 3);
    const masked = "*".repeat(username.length - 3 > 0 ? username.length - 3 : 0);
    return visible + masked;
  }


  return (
    <div className="qna-wrapper">
      <div className="qna-header">
        <div className="qna-summary">
          <div className="mr-7">
            <span className="mr-2">전체문의수</span>
            <span>{totalElements}건</span>
          </div>
          <div className="qna-control">
            <select className="qna-select">
              <option value="">전체</option>
              <option value="">답변</option>
              <option value="">미답변</option>
            </select>
            <button
              className="qna-write-btn"
              onClick={handleWriteClick}
            >Q&A 작성</button>
          </div>
        </div>
      </div>
      <div className="qna-list">
        <div className="qna-list-title">
          <div>답변상태</div>
          <div className="flex-1">제목</div>
          <div>작성자</div>
          <div>작성일</div>
        </div>
        {qnaList.map((qna, index) => (
          <div key={qna.qnaId} className="qna-item">
            <div className="qna-question">
              <div>{qna.replyId ? "답변완료" : "미답변"}</div>
              <div
                className="qna-question-title"
                onClick={() => toggleDetail(index, qna.secret, qna.username)}
              >
                {(qna.secret && (!isLogin || profile.username !== qna.username))
                  ? (
                    <>
                      비밀글입니다. <FontAwesomeIcon icon={faLock} />
                    </>
                  )
                  : (
                    <>
                      {qna.title} {qna.secret && <FontAwesomeIcon icon={faLock} />}
                    </>
                  )}
              </div>
              <div>{maskUsername(qna.username)}</div>
              <div>{qna.createdAt.slice(0, 10)}</div>
            </div>
            {openIndex === index && (
              (!qna.secret || (isLogin && profile.username === qna.username)) && (
                <div className="qna-question-detail active">
                  <div className="qna-question-content">
                    <p>{qna.content}</p>
                  </div>
                  {qna.replyId && (
                    <div className="qna-answer">
                      <div className="qna-answer-content">
                        <span>└</span>
                        <span className="answer-icon">답변</span>
                        <span>{qna.replyContent}</span>
                      </div>
                      <div>{qna.replyUsername}</div>
                      <div>{qna.replyCreatedAt.slice(0, 10)}</div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
      {qnaList.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};
export default QnaList;