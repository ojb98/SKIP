import { useState } from "react";
import { useParams } from "react-router-dom";
import { createQnaApi } from "../../api/qnaApi";
import { useSelector } from "react-redux";

const QnaWrite = () => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [secret, setSecret] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const { itemId } = useParams();
  const profile = useSelector(state => state.loginSlice);
  const userId = profile.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if(title.trim() === "") {
      setTitleError("제목을 입력해주세요.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if(content.trim() === "") {
      setContentError("내용을 입력해주세요.");
      isValid = false;
    } else {
      setContentError("");
    }

    if (!isValid) return;

    const qnaData = {
      itemId: parseInt(itemId, 10),
      title,
      content,
      secret
    };

    try {
      await createQnaApi(userId, qnaData);
      console.log("Q&A 등록:", qnaData);
      alert("Q&A가 등록되었습니다.");
      window.opener.location.reload();
      window.close();
    } catch(err) {
      console.error("Q&A 등록 실패:", err);
      alert("Q&A 등록에 실패했습니다.");
    }
  }

  return(
    <div>
      <h2 className="qna-popup-header">상품Q&A 작성하기</h2>
      <form onSubmit={handleSubmit}>
        <div className="qna-popup-form">
          <div>
            <input 
              type="text"
              className="qna-popup-title"
              placeholder="제목을 작성해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <p className="qna-error-msg">{titleError}</p>}
          </div>
          <div>
            <textarea 
              className="qna-popup-content"
              placeholder="문의하실 내용을 작성해주세요. (100자를 초과할 수 없습니다.)"
              maxLength={100}
              value={content}
              onChange={(e) => setContent(e.target.value)}>
            </textarea>
            {contentError && <p className="qna-error-msg">{contentError}</p>}
          </div>
          <div className="qna-secret">
            <input 
              type="checkbox" 
              id="secretCheck" 
              checked={secret}
              onChange={() => setSecret(!secret)}
            />
            <label htmlFor="secretCheck">비공개</label>
            <span>(체크하시면 해당 글은 비공개처리 됩니다.)</span>
          </div>
          <div className="qna-popup-btns">
            <button type="submit" className="add-btn">등록</button>
            <button 
              className="close-btn"
              onClick={() => window.close()}
            >취소</button>
          </div>
        </div>
      </form>
    </div>
  )
}
export default QnaWrite;