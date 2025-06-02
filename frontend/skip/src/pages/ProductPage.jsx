import { useEffect, useState } from "react";
import BoardTabs from "../components/rentalshop/BoardTabs";
import { useParams } from "react-router-dom";
import { fetchItemDetailPage } from "../api/itemApi";

const ProductPage=()=>{
  const { rentId, itemId } = useParams();
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

  useEffect(() => {
    fetchItemDetailPage(parsedRentId, parsedItemId)
      .then((data) => {
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

    const matched = itemData.detailList.find(d => d.rentHour === hour && (isSizeFree || d.size === size));
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

    // 기본 가격 0, 나중에 itemDetail에서 가격 찾으면 반영 가능
    setSelectedOptions((prev) => [...prev, {text: optionText, count: 1, price: matched.price}]); 

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
            <button href="#none" className="cart-btn">장바구니</button>
            <button href="#none" className="wish-btn">찜하기</button>
            <button href="#none" className="buy-btn">구매하기</button>
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