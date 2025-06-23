import { useEffect, useState } from "react";
import BoardTabs from "../components/rentalshop/BoardTabs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchItemDetailPage } from "../api/itemApi";
import { addCartItemApi } from "../api/cartApi";
import { useSelector } from "react-redux";
import { addWishApi } from "../api/wishApi";
import '../css/paymentModel.css';
import axios from "axios";


const ProductPage=()=>{
  const { rentId, itemId } = useParams();
  // 유저아이디 꺼내오기
  const profile = useSelector(status=> status.loginSlice);
  const navigate = useNavigate();
  //현재 페이지(컴포넌트)의 URL 정보와 함께 전달된 상태(state)
  //const location = useLocation();
  // const passedState = location.state;
  // console.log("location에서 넘어온 데이터 ==> ",location.state); 

  const parsedRentId = parseInt(rentId, 10);
  const parsedItemId = parseInt(itemId, 10);

  // 상품 상세 정보 저장
  const [itemData, setItemData] = useState(null);
  const [date, setDate] = useState("");
  const [size, setSize] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  // 유저가 선택한 옵션들을 배열로 저장
  const [selectedOptions, setSelectedOptions] = useState([]);
 
  // 결제 선택모달
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  
  // 선택 항목들을 초기화하는 함수
  const resetOptions=()=>{
    setDate("");
    setSize("");
    setStartTime("");
    setDuration("");
  };

  // 반납 예정시간 (대여시간시작 + 대여시간)
  const calculateEndTime = (date, startTime, duration) => {

    // 초 붙여주기 (파싱 문제 방지)
    const start = new Date(`${date}T${startTime}:00`);
    const durationNum = Number(duration);
    start.setHours(start.getHours() + durationNum);

    // 로컬 시간을 YYYY-MM-DDTHH:mm:ss 형식으로 반환
    //padStart(2, "0") : 항상 두 자리로 만들기
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const day = String(start.getDate()).padStart(2, "0");
    const h = String(start.getHours()).padStart(2, "0");
    const m = String(start.getMinutes()).padStart(2, "0");
    const s = String(start.getSeconds()).padStart(2, "0");

    // 시간 정보를 문자열로 변환
    return `${year}-${month}-${day}T${h}:${m}:${s}`;
  };

  // 상품 정보 불러오기
  useEffect(() => {
    fetchItemDetailPage(parsedRentId, parsedItemId)
      .then((data) => {
        setItemData(data);
      })
      .catch((err) => console.error("아이템 로딩 실패: ", err));
  }, [parsedRentId, parsedItemId]);

  // 모든 상세 항목의 사이즈가 없거나 "Free"이면 true
  const isSizeFree = itemData &&
    itemData.detailList.every(d => !d.size || d.size.toLowerCase() == "free" || d.size == null)

  useEffect(()=>{
    if(!date || !startTime || !duration) return;
    if(!isSizeFree && !size) return; 

    const hour = parseInt(duration, 10);


    const matched = itemData.detailList.find(d => d.rentHour === hour && (isSizeFree || d.size?.trim() === size));
    if(!matched) {
      alert("해당 조건에 맞는 상품이 존재하지 않습니다.");
      return;
    }

    // 동일한 옵션이 이미 선택되었는지 확인
    const optionText = `${date} / ${isSizeFree ? '' : size + '/'} ${startTime} / ${duration} 시간`;

    // selectedOptions 배열에 같은 옵션 텍스트가 이미 있으면 중복으로 간주
    const exists = selectedOptions.find((opt) => opt.text === optionText);
    if (exists) {
      alert("이미 선택된 옵션입니다.");
      resetOptions();
      return;
    } 

    // 반납예정시간
    const endTime = calculateEndTime(date,startTime,hour);

    // 기본 가격 0, 나중에 itemDetail에서 가격 찾으면 반영 가능
    setSelectedOptions((prev) => [...prev, 
      {
        text: optionText,
        count: 1,
        price: matched.price,
        itemDetailId: matched.itemDetailId,
        size: matched.size,
        date,
        startTime,
        duration: hour,
        endTime,
      }
    ]); 

    //초기화하는 함수 호출
    resetOptions();
  }, [date, size, startTime, duration]);

  // 옵션 수량을 증가/감소
  const changeCount = (idx, delta)=>{
    setSelectedOptions(prev =>
      prev.map((opt, i) =>
        i === idx ? { ...opt, count: Math.max(1, opt.count + delta)} : opt
      )
    );
  };

  // 옵션 항목을 삭제
  const removeOption = (idx) => {
    setSelectedOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  //장바구니 담기
  const handleAddToCart = async() => {
    if(selectedOptions.length === 0){
      alert("장비을 선택해주세요");
      return;
    }

    try{
      for(const opt of selectedOptions){
        console.log("옵션 확인:", opt);

        //서버에 cartItem 저장, quantity는 count사용
        await addCartItemApi(profile.userId,[{
            itemDetailId: opt.itemDetailId,
            quantity: opt.count,
            rentStart: `${opt.date}T${opt.startTime}`,
            rentEnd: opt.endTime,
        }])
      }

      setSelectedOptions([]);  //선택된 옵션 목록을 초기화

      const goToCart = window.confirm("장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?");
      if(goToCart){
        navigate("/cart/list")
      }

    }catch(error){
      alert("장바구니 추가 실패");
    }

  }


  // 찜 추가
  const handleAddToWish = async() =>{
    if (!itemData || !itemData.detailList || itemData.detailList.length === 0) {
    alert("찜 등록할 수 있는 상품이 없습니다.");
    return;
    }

    // 사이즈를 선택하지 않아도 사용자 선택과 관계없이 첫 번째 장비가 찜되는 구조
    const defaultDetail = itemData.detailList[0];

    try {
      await addWishApi(profile.userId, defaultDetail.itemDetailId);
      alert("찜에 추가되었습니다.");
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 500) {
        alert(err.response.data?.message || "이미 찜한 상품이거나 오류가 발생했습니다.");
      } else {
        alert("찜 등록 중 오류가 발생했습니다.");
      }
    }
  }

  //결제 전 작업
  const preparePayment = async () => {
  const totalAmount = selectedOptions.reduce((sum, item) => sum + item.price * item.count, 0);

  const reservationItems = selectedOptions.map(opt => ({
    rentId: parsedRentId,
    itemDetailId: opt.itemDetailId,
    rentStart: `${opt.date}T${opt.startTime}:00`,
    rentEnd: opt.endTime,
    quantity: opt.count,
    subtotalPrice: opt.price * opt.count,
  }));

  const response = await axios.post("/api/payments/prepare", {
    userId: profile.userId,
    totalPrice: totalAmount,
    reservationItems,
  });

  return response.data; // { merchantUid, impUid (optional) }
}

  //결재하기
  const handlePayment = async (pg) => {
    setShowPaymentModal(false); // 모달 닫기

    const merchantUid = `order_${new Date().getTime()}`;
    const IMP = window.IMP;
    IMP.init("imp57043461");

    const totalAmount = selectedOptions.reduce((sum, item) => sum + item.price * item.count, 0);

    IMP.request_pay({
      pg,
      pay_method: "card",
      merchant_uid: merchantUid,
      name: "대여 결제",
      amount: totalAmount,
      buyer_email: profile.email,
      buyer_name: profile.name,
      buyer_username: profile.username,
    }, async (rsp) => {
      console.log("결제 결과", rsp);

      if (rsp.success) {
        try { 
          const reservationItems = selectedOptions.map(opt => ({
            rentId: parsedRentId,
            itemDetailId: opt.itemDetailId,
            rentStart: `${opt.date}T${opt.startTime}:00`,
            rentEnd: opt.endTime,   
            quantity: opt.count,
            subtotalPrice: opt.price * opt.count,
          }));

          await axios.post("/api/payments/direct", {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
            amount: rsp.paid_amount,
            userId: profile.userId,
            totalPrice: totalAmount,
            pgProvider: pg,
            reservationItems,
          });

          alert("결제가 완료되었습니다!");
          // navigate("/mypage/reservations"); // 예시 이동
          console.log("결제 완료:", res.data);

        } catch (err) {
          console.log(err.response.data.error);
          alert("결제 실패:" + err.response.data.error);
        }
      } else {
        alert("결제 실패: " + resp.error_msg);
      }
            
    });
  }

  return(
    <main className="w-[900px]">
      {itemData ? (
      <div className="product-wrapper">
        <div className="product-image">
          <img src={`http://localhost:8080${itemData.image}`} alt="itemData.name" />
        </div>
        <div className="product-info">
          <h2 className="product-title">{itemData.name}</h2>
          <p className="product-price">{itemData.detailList[0]?.price.toLocaleString()}원</p>
          <div className="product-option">
            <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {
            !isSizeFree && (
              <div className="product-option">
                <select onChange={(e) => setSize(e.target.value)} value={size}>
                  <option value="" disabled hidden>사이즈를 선택하세요.</option>
                  {[...new Set(itemData.detailList.map((d) => d.size))].map((size, i) => (
                    <option key={i} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          <div className="product-option">
            <select onChange={(e) => setStartTime(e.target.value)} value={startTime}>
              <option value="" disabled hidden>대여시작시간을 선택하세요.</option>
              {
                Array.from({length: 24}, (_, i) => {
                  const hour = i.toString().padStart(2, "0") + ":00";
                  return <option key={hour} value={hour}>{hour}</option>;
                })
              }
            </select>
          </div>
          <div className="product-option">
            <select onChange={(e) => setDuration(e.target.value)} value={duration}>
              <option value="" disabled hidden>이용시간을 선택하세요.</option>
              {
                Array.from(
                  new Map(itemData.detailList.map(d => [d.rentHour, d.price])).entries()
                ).map(([hour, price], i) =>(
                  <option key={i} value={hour}>
                    {hour}시간 ({price.toLocaleString()}원)
                  </option>
                ))
              }
            </select>
          </div>
          <div className="product-added-options">
            {selectedOptions.map((opt, idx) => (
              <div className="add-options" key={idx}>
                <label>{opt.text}</label>
                <div className="btns">
                  <div className="count-btn">
                    <button onClick={() => changeCount(idx, -1)}>-</button>
                    <span>{opt.count}</span>
                    <button onClick={() => changeCount(idx, 1)}>+</button>
                  </div>
                  <div>
                    <span className="option-price">{(opt.count * opt.price).toLocaleString()}원</span>
                    <button className="remove-btn" onClick={() => removeOption(idx)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="product-actions">
            <button onClick={handleAddToCart} className="cart-btn">장바구니에 담기</button>
            <button onClick={handleAddToWish} className="wish-btn">찜하기</button>
            <button onClick={() => {
              if (selectedOptions.length === 0) {
                alert("장비를 선택해주세요"); return;
              }
              setShowPaymentModal(true);
              }} className="buy-btn">바로결제</button>
          </div>
        </div>
      </div>
      ) : (
        <p>상품 정보를 불러오는 중입니다.....</p>
      )}
      <BoardTabs rentId={parsedRentId} itemId={parsedItemId}/>

      {/* 결제 모달 영역 추가 */}
      {showPaymentModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>결제 수단을 선택하세요</h3>
            <div className="modal-buttons">
              <button onClick={() => handlePayment("kakaopay.TC0ONETIME")}>카카오페이</button>
              <button onClick={() => handlePayment("tosspay.tosstest")}>토스페이</button>
              <button onClick={() => handlePayment("smilepay.cnstest25m")}>스마일페이</button>
              <button className="modal-cancel-btn" onClick={() => setShowPaymentModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
      </main>
  )
}
export default ProductPage;