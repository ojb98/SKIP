import { useState } from "react";
import { useParams } from "react-router-dom";

const QnaList = () => {
    const { rentId, itemId } = useParams();
    const [openIndex, setOpenIndex] = useState(null);

    const toggleDetail = (index, isSecret = false) => {
      if (isSecret) {
        alert("작성자만 확인이 가능합니다.");
        return;
      }
      setOpenIndex(prev => (prev === index ? null : index));
    };


  return(
    <div className="qna-wrapper">
      <div className="qna-header">
        <div className="qna-summary">
          <div className="mr-7">
            <span className="mr-2">전체문의수</span>
            <span>100건</span>
          </div>
          <div>
            <button
            className="qna-write-btn"
            onClick={() => window.open(`/rent/product/${rentId}/${itemId}/qna/write`, "_blank","width=600,height=550")}
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
          <div className="qna-item">
            <div className="qna-question">
              <div>답변대기</div>
              <div 
                className="qna-question-title"
                onClick={() => toggleDetail(0)}
              >제목입니다.</div>
              <div>abc***</div>
              <div>2025-05-01</div>
            </div>
            <div className={`qna-question-detail ${openIndex === 0 ? "active" : ""}`}>
              <div className="qna-question-content">
                <p>내용입니다.</p>
              </div>
              <div className="qna-answer">
                <div className="qna-answer-content">
                  <span className="answer-icon">답변</span>
                  <span>관리자 답변입니다.</span>
                </div>
                <div>관리자</div>
                <div>2024-05-01</div>
              </div>
            </div>
          </div>
          <div className="qna-item">
            <div className="qna-question">
              <div>답변대기</div>
              <div 
                className="qna-question-title"
                onClick={() => toggleDetail(1, true)}
              >비밀글 입니다.</div>
              <div>abc***</div>
              <div>2025-05-01</div>
            </div>
            <div className="qna-question-detail">
              <div className="qna-question-content">
                <p>내용입니다.</p>
              </div>
              <div className="qna-answer">
                <div className="qna-answer-content">
                  <span className="answer-icon">답변</span>
                  <span>관리자 답변입니다.</span>
                </div>
                <div>관리자</div>
                <div>2024-05-01</div>
              </div>
            </div>
          </div>
        </div>
        <div className="pagelist">
          <a href="#none">이전</a>
          <a href="#none" className="active">1</a>
          <a href="#none">2</a>
          <a href="#none">다음</a>
        </div>
    </div>
  )
}
export default QnaList;