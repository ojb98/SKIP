const UserQnaList = () => {
  return (
    <div className="m-[15px]">
      <div className="flex justify-between px-[15px] pb-[15px] border-b border-[#cecece]">
        <h2 className="text-[24px] font-bold">상품 Q&A</h2>
        <div className="flex justify-end">
          <select name="" id="">
            <option value="">전체</option>
            <option value="">답변</option>
            <option value="">미답변</option>
          </select>
          <select name="" id="" className="ml-4">
            <option value="">1주일</option>
            <option value="">1개월</option>
            <option value="" selected>3개월</option>
          </select>
        </div>
      </div>
      <div className="m-2.5">
        <div className="border flex p-2.5">
          <div className="border">
            <h4>리프트 1일권</h4>
            <img src="../images/1.png" alt="리프트 1일권" className="w-[180px] h-[180px] border-[#cecece]" />
          </div>
          <div className="border flex-1">
            <div className="border flex justify-between">
              <div className="border">
                <p>문의제목: 문의제목입니다.</p>
                <p>문의내용: 문의내용입니다.</p>
                <span>최근수정일:25-06-03</span>
              </div>
              <div className="border flex items-center">
                <p>2025-06-01</p>
              </div>
            </div>
            <div className="border flex justify-between">
              <div className="border">
                <p>답변: 답변입니다.</p>
                <span>최근수정일:25-06-03</span>
              </div>
              <div className="border">
                <p>2025-06-02</p>
              </div>
            </div>
          </div>
          <div className="border p-2.5 flex flex-col justify-between">
            <div className="border">
              <p>답변 완료</p>
            </div>
            <div className="border flex flex-col gap-1.5">
              <button className="border cursor-pointer">수정</button>
              <button className="border cursor-pointer">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserQnaList;