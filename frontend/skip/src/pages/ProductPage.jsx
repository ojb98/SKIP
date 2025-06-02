import { useEffect, useState } from "react";
import BoardTabs from "../components/rentalshop/BoardTabs";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItemDetailPage } from "../api/itemApi";
import { addCartItemApi } from "../api/cartApi";
import { useSelector } from "react-redux";

const ProductPage=()=>{
  const { rentId, itemId } = useParams();
  //유저아이디 꺼내오기
  const profile = useSelector(status=> status.loginSlice);
  const navigate = useNavigate();

  const parsedRentId = parseInt(rentId, 10);
  const parsedItemId = parseInt(itemId, 10);

  const [itemData, setItemData] = useState(null);
  const [date, setDate] = useState("");
  const [size, setSize] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const resetOptions=()=>{
    setDate("");
    setSize("");
    setStartTime("");
    setDuration("");
  };

  // 반납 예정시간 (대여시간시작 + 대여시간)
  const calculateEndTime = (date, startTime, duration) => {
    const [hour, minute] = startTime.split(":").map(Number);
    // 초 붙여주기 (파싱 문제 방지)
    const start = new Date(`${date}T${startTime}:00`);
    const durationNum = Number(duration);
    start.setHours(start.getHours() + durationNum);

    // 로컬 시간을 YYYY-MM-DDTHH:mm:ss 형식으로 반환
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const day = String(start.getDate()).padStart(2, "0");
    const h = String(start.getHours()).padStart(2, "0");
    const m = String(start.getMinutes()).padStart(2, "0");
    const s = String(start.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${h}:${m}:${s}`;
  };

  
  useEffect(() => {
    fetchItemDetailPage(parsedRentId, parsedItemId)
      .then((data) => {
        console.log("itemData ==>", data);
        setItemData(data);
      })
      .catch((err) => console.error("아이템 로딩 실패: ", err));
  }, [parsedRentId, parsedItemId]);

  const isSizeFree = itemData &&
    itemData.detailList.every(d => !d.size || d.size.toLowerCase() == "free" || d.size == null)

  useEffect(()=>{
    if(!date || !startTime || !duration) return;
    if(!isSizeFree && !size) return; // 사이즈가 필요한 경우

    const hour = parseInt(duration, 10);


    const matched = itemData.detailList.find(d => d.rentHour === hour && (isSizeFree || d.size?.trim() === size));
    if(!matched) {
      alert("해당 조건에 맞는 상품이 존재하지 않습니다.");
      return;
    }

    const optionText = `${date} / ${isSizeFree ? '' : size + '/'} ${startTime} / ${duration} 시간`;

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

    resetOptions();
  }, [date, size, startTime, duration]);

  
  const changeCount = (idx, delta)=>{
    setSelectedOptions(prev =>
      prev.map((opt, i) =>
        i === idx ? { ...opt, count: Math.max(1, opt.count + delta)} : opt
      )
    );
  };

  const removeOption = (idx) => {
    setSelectedOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  //장바구니 담기 함수
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

      alert("장바구니에 추가되었습니다.");
      setSelectedOptions([]);  //초기화

      const goToCart = window.confirm("장바구니로 이동하시겠습니까?");
      if(goToCart){
        navigate("/cart/list")
      }

    }catch(error){
      alert("장바구니 추가 실패");
    }

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
                  <option value="" disabled selected hidden>사이즈를 선택하세요.</option>
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
              <option value="" disabled selected hidden>대여시작시간을 선택하세요.</option>
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
              <option value="" disabled selected hidden>이용시간을 선택하세요.</option>
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
            <a href="#none" className="wish-btn">찜하기</a>
            <a href="#none" className="buy-btn">구매하기</a>
          </div>
        </div>
      </div>
      ) : (
        <p>상품 정보를 불러오는 중입니다.....</p>
      )}
      <BoardTabs rentId={parsedRentId} itemId={parsedItemId}/>
    </main>
  )
}
export default ProductPage;