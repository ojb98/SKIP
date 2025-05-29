import { useState } from "react";

const QnaWrite = () => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const handleSubmit = (e) => {
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

    if(isValid) {
      alert("Q&A가 등록되었습니다.");
      window.close();
    }
  }

  return(
    <div>
      <h2 className="qna-popup-header">상품Q&A 작성하기</h2>
      <form onSubmit={handleSubmit} action="post">
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
              placeholder="문의하실 내용을 작성해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}>
            </textarea>
            {contentError && <p className="qna-error-msg">{contentError}</p>}
          </div>
          <div className="qna-secret">
            <input type="checkbox" id="secretCheck" />
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