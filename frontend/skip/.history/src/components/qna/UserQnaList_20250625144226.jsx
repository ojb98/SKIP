import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteQnaByUserApi, getQnaListByUserApi } from "../../api/qnaApi";
import Pagination from "../pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";


const UserQnaList = () => {
  const profile = useSelector((state) => state.loginSlice);
  const userId = profile?.userId;

  const [qnaList, setQnaList] = useState([]);
  const [hasReply, setHasReply] = useState("");
  const [period, setPeriod] = useState("3months");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  // 기간에 따라 시작 날짜 계산
  const getStartDate = (period) => {
    const now = new Date();
    if (period === "1week") now.setDate(now.getDate() - 7);
    else if (period === "1month") now.setMonth(now.getMonth() - 1);
    else now.setMonth(now.getMonth() - 3);
    return now.toISOString();
  }

  // Q&A 리스트 불러오기
  useEffect(() => {
    const fetchQnaList = async () => {
      if (!userId) return;

      try {
        const data = await getQnaListByUserApi(
          userId,
          hasReply === "" ? null : hasReply === "answered",
          getStartDate(period),
          page,
          size
        );
        setQnaList(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Q&A 불러오기 실패:", err);
      }
    }
    fetchQnaList();
  }, [userId, hasReply, period, page]);

  // Q&A 수정
  const handleEdit = (qnaId, itemId, rentId) => {
    window.open(
      `/rent/product/${rentId}/${itemId}/qna/edit/${qnaId}`,
      "_blank",
      "width=600, height=600"
    );
  };


  // Q&A 삭제
  const handleDelete = async (qnaId) => {
    if (!window.confirm("정말로 이 Q&A를 삭제하시겠습니까?")) return;

    try {
      await deleteQnaByUserApi(qnaId, userId);
      alert("삭제가 완료되었습니다.");

      // 삭제 후 리스트 새로고침
      const data = await getQnaListByUserApi(
        userId,
        hasReply === "" ? null : hasReply === "answered",
        getStartDate(period),
        page,
        size
      );
      setQnaList(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  }


  return (
    <div className="m-[15px]">
      <div className="flex justify-between px-[15px] pb-[15px] border-b border-[#cecece]">
        <h2 className="text-[24px] font-bold">
          상품 Q&A
          <span className="text-[14px] text-red-500 ml-1.5">
            Q&A는 3개월 후 자동 삭제됩니다.
          </span>
        </h2>
        <div className="flex justify-end">
          <select className="px-3 w-[100px] border rounded border-[#cdcdcd]" value={hasReply} onChange={(e) => setHasReply(e.target.value)}>
            <option value="">전체</option>
            <option value="answered">답변</option>
            <option value="unanswered">미답변</option>
          </select>
          <select className="ml-4 px-3 w-[100px] border rounded border-[#cdcdcd]" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1week">1주일</option>
            <option value="1month">1개월</option>
            <option value="3months">3개월</option>
          </select>
        </div>
      </div>

      {qnaList.length === 0 ? (
        <div className="p-5 text-center text-gray-500">문의 내역이 없습니다.</div>
      ) : (
        qnaList.map((qna) => (
          <div key={qna.qnaId} className="mt-5 mx-2.5">
            <div
              className="p-5 border border-[#ddd] rounded-[5px] bg-white flex"
              style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}>
              <div>
                <Link to={`/rent/product/${qna.rentId}/${qna.itemId}`}>
                  <h4 className="text-[18px] font-bold"><FontAwesomeIcon icon={faTag} className="mr-1.5 text-blue-500 !align-middle"/>{qna.itemName}</h4>
                  <img
                    src={`${__APP_BASE__}${qna.itemImage}`}
                    alt={qna.itemName}
                    className="w-[180px] h-[180px] mt-[5px] border-[#cecece]"
                  />
                </Link>
              </div>
              <div className="mx-4.5 py-2.5 flex-1">
                <div className="flex justify-between">
                  <div>
                    <p>{qna.title}</p>
                    <p className="mt-1.5 text-[14px]">{qna.content}</p>
                  </div>
                  <div className="mt-2.5 text-[14px]">
                    <p>{formatDate(qna.createdAt)}</p>
                  </div>
                </div>

                {qna.replyId && (
                  <div className="mt-[20px] flex justify-between">
                    <div>
                      <p>
                        └
                        <span className="text-[14px]">
                          <strong className="answer-icon">답변</strong>{" "}
                          {qna.replyContent}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2.5 text-[14px]">
                      <p>{formatDate(qna.replyCreatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2 flex flex-col justify-between">
                <div className="text-center font-bold w-[80px]">
                  <p>{qna.replyId ? "답변 완료" : "미답변"}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button 
                    className="text-blue-500 border border-blue-500 rounded-[5px] cursor-pointer hover:bg-blue-500 hover:text-white"
                    onClick={() => handleEdit(qna.qnaId, qna.itemId, qna.rentId)}
                  >
                    수정
                  </button>
                  <button
                    className="text-blue-500 border border-blue-500 rounded-[5px] cursor-pointer hover:bg-blue-500 hover:text-white"
                    onClick={() => handleDelete(qna.qnaId)}
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
  )
}

// 날짜열 문자 포맷
const formatDate = (isoString) => {
  return isoString ? isoString.slice(0, 10) : "-";
}

export default UserQnaList;