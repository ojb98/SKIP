import { useEffect, useState } from "react";
import BoardTabs from "../components/rentalshop/BoardTabs";

const ProductPage=()=>{
  const [date, setDate] = useState("");
  const [clotOption, setClotOption] = useState("");
  const [size, setSize] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const resetOptions=()=>{
    setDate("");
    setClotOption("");
    setSize("");
    setStartTime("");
    setDuration("");
  };

  useEffect(()=>{
    if(!date || !clotOption || !size || !startTime || !duration) return;

    const optionText = `${date} / ${clotOption} / ${size} / ${startTime} / ${duration}`;

    const exists = selectedOptions.find(opt => opt.text === optionText);
    if (exists) {
      alert("이미 선택된 옵션입니다.");
      resetOptions();
      return;
    } 

    setSelectedOptions(prev => [...prev, {text: optionText, count: 1, price: 0}]); 

    resetOptions();
  }, [date, clotOption, size, startTime, duration]);


  const changeCount = (idx, delta)=>{
    setSelectedOptions(prev =>
      prev.map((opt, i) =>
        i === idx ? { ...opt, count: Math.max(1, opt.count + delta)} : opt
      )
    );
  };

  const removeOption = (idx) => {
    setSelectedOptions(prev => prev.filter((_, i) => i !== idx));
  };

  return(
    <main className="w-[900px]">
      <div className="product-wrapper">
        <div className="product-image">
          <img src="/images/1.png" />
        </div>
        <div className="product-info">
          <h2 className="product-title">스키복1</h2>
          <p className="product-price">30,000원</p>
          <div className="product-option">
            <input type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="product-option">
            <select onChange={(e) => setClotOption(e.target.value)} value={clotOption}>
              <option value="" disabled selected hidden>의류를 선택하세요.</option>
              <option value="1">1번째 옵션</option>
              <option value="2">2번째 옵션</option>
              <option value="3">3번째 옵션</option>
              <option value="4">4번째 옵션</option>
              <option value="5">5번째 옵션</option>
            </select>
          </div>
          <div className="product-option">
            <select onChange={(e) => setSize(e.target.value)} value={size}>
              <option value="" disabled selected hidden>사이즈를 선택하세요.</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
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
              <option>4시간</option>
              <option>6시간</option>
              <option>8시간</option>
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
                    <span className="option-price">{opt.price.toLocaleString()}원</span>
                    <button className="remove-btn" onClick={() => removeOption(idx)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="product-actions">
            <a href="#none" className="cart-btn">장바구니</a>
            <a href="#none" className="wish-btn">찜하기</a>
            <a href="#none" className="buy-btn">구매하기</a>
          </div>
        </div>
      </div>
      <BoardTabs />
    </main>
  )
}
export default ProductPage;