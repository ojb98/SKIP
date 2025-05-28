import { useState } from "react";
import ReviewList from "../review/ReviewList";
import QnaList from "../qna/QnaList";

const BoardTabs=({ rentId, itemId })=>{
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
      {tab === 'review' && <ReviewList rentId={rentId} itemId={itemId} />}
      {tab === 'qna' && <QnaList rentId={rentId} itemId={itemId} />}
    </>
  )
}
export default BoardTabs;