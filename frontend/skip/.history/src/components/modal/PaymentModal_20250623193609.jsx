import React from "react";

const PaymentModal = ({ show, onClose, onSelect }) => {
  if (!show) return null;
  return (
    <div className="skip-cart-modal-backdrop">
      <div className="skip-cart-modal">
        <h3>결제 수단을 선택하세요</h3>
        <div className="skip-cart-modal-buttons">
          <button onClick={() => onSelect("kakaopay.TC0ONETIME")}><img src="">카카오페이</button>
          <button onClick={() => onSelect("tosspay.tosstest")}>토스페이</button>
          <button onClick={() => onSelect("smilepay.cnstest25m")}>스마일페이</button>
          <button className="skip-cart-modal-cancel-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 