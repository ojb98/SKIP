import React from "react";

const PaymentModal = ({ show, onClose, onSelect }) => {
  if (!show) return null;
  return (
    <div className="skip-cart-modal-backdrop">
      <div className="skip-cart-modal">
        <h3>결제 수단을 선택하세요</h3>
        <div className="skip-cart-modal-buttons">
          <button onClick={() => onSelect("kakaopay.TC0ONETIME")}><img src="/public/images/kakaoPay.png" className="kakaopay"/>카카오페이</button>
          <button onClick={() => onSelect("tosspay.tosstest")}><img src="/public/images/TossPay.png" className="tosspay"/>토스페이</button>
          <button onClick={() => onSelect("smilepay.cnstest25m")}><img src="/public/images/SmilePay.png" className="smilepay"/>스마일페이</button>
          <button className="skip-cart-modal-cancel-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 