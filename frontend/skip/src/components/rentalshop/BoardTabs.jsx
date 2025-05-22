import { useState } from "react";
import ReviewList from "./ReviewList";
import QnaList from "./QnaList";

const BoardTabs=()=>{
  const [tab, setTab] = useState('review');

  const tabList = [
    {key: "review", label: "리뷰"},
    {key: "qna", label: "Q&A"},
  ]

  return(
    <>
      <div className="tab-menu">
        {
          tabList.map((item)=>(
            <button
            key={item.key}    
            className={`tab-btn ${tab === item.key ? "active" : ""}`}
            onClick={()=>setTab(item.key)}
            >
              {item.label}
            </button>
          ))
        }
      </div>
      {tab === 'review' && <ReviewList />}
      {tab === 'qna' && <QnaList />}
    </>
  )
}
export default BoardTabs;