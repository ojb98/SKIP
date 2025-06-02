import { useEffect, useState } from "react";
import { cartListApi } from "../../api/cartApi";
import { useSelector } from "react-redux";
import { createReservationApi } from "../../api/ReserveApi";
import { useNavigate } from "react-router-dom";

const CartList=()=>{
    const navigate = useNavigate();

    const [cartGroups, setCartGroups] = useState([]);

    // 체크된 상세 항목 키를 저장 (cartId)
    const [checkedItems, setCheckedItems] = useState(new Set());  

    const profile = useSelector(status => status.loginSlice);
    
    //장바구니 목록 불러오기
    const getcartList=()=>{
        //userId값 넣어주기
        cartListApi(profile.userId).then(data=>{
            setCartGroups([...data]);
            setCheckedItems(new Set());
        })
    }

    useEffect(()=>{
        // userId 없으면 로그인 페이지로 리디렉트
        if (!profile?.userId) {
            navigate("/login");
            return;
        }

        getcartList();
    },[profile.userId]);

    // 대여시간/반납시간 날짜포맷
    const formatDate = (rentDate) => {
        if (!rentDate) return "-";
        const date = new Date(rentDate);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTime = (rentDate) => {
        if (!rentDate) return "-";
        const date = new Date(rentDate);
        const hours = `${date.getHours()}`.padStart(2, "0");
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    // 개별선택 체크박스
    const toggleCheck=(cartId)=>{
        setCheckedItems((prev)=>{
            const newSet = new Set(prev);
            if(newSet.has(cartId)){
                newSet.delete(cartId);
            }else{
                newSet.add(cartId);
            }
            return newSet;
        })
        
    }

    // 전체선택 체크박스
    const toggleAllCheck=()=>{
        // 현재 체크된 항목 개수와 전체 항목 개수를 비교
        // flatMap() : 배열들을 하나로 쭉 펼쳐(flatten)서(1차원 배열로) 반환
        if(checkedItems.size === cartGroups.flatMap(group => group.items).length){
            //모두 체크된 상태면 전체 해제
            setCheckedItems(new Set());
        }else{
            // 일부라도 체크 안 된 게 있으면 모두 체크
            const newSet = new Set();
            //cartGroups 배열을 순회
            cartGroups.forEach(group =>{
                //각 그룹 내 items 배열을 순회
                group.items.forEach(item =>{
                    //모든 item의 cartId를 allKeys Set에 추가
                    newSet.add(item.cartId);
                })
            })
            //체크 상태를 모든 항목이 선택된 상태로 업데이트
            setCheckedItems(newSet);
        }
    }

    // 선택된 항목의 총 가격 계산
    const totalPrice = cartGroups.flatMap((group)=> group.items)
        .filter((item)=> checkedItems.has(item.cartId))
        .reduce((sum,item) => sum + item.price, 0);
    

    const handlePayment= async()=>{
        if (checkedItems.size === 0) {
            alert("결제할 상품을 선택해주세요.");
            return;
        }

        // 예약 생성에 필요한 데이터 구조 만들기
        // group: rentId, userId는 profile.userId
        // 선택된 CartItem들을 기반으로 ReservationItem 배열 생성
        // 예시 구조 참고해서 실제 백엔드 API 스펙에 맞게 조정 필요

        const selectedItems = cartGroups.flatMap((group) => group.items)
            .filter((item) => checkedItems.has(item.cartId));

        // 예시: rentId가 동일하다고 가정 (보통 같은 렌트 업체 내 상품만 예약)
        const rentId = cartGroups[0]?.rentId || null;
            if (!rentId) {
            alert("예약할 상품이 없습니다.");
            return;
        }

        const reservationData = {
            userId: profile.userId,
            rentId: rentId,
            totalPrice: totalPrice,
            cartIds: selectedItems.map(item => item.cartId),
        };

        console.log("예약결과 ======>",reservationData);

        try {
            const reservationResult = await createReservationApi(reservationData);

            const reserveId = reservationResult.reserveId;
            
            //포트원 결제 요청
            const IMP = window.IMP;
            IMP.init("imp57043461");  //포트원(아임포트)에서 발급받은 가맹점 식별코드

            const merchanUid = `order_${newDate().getTime()}`;  // 유니크한 주문번호

            IMP.request_pay({
                pg: "kakaopay",
                pay_method: "card",
                merchant_uid: `mid_${Date.now()}`,
                name: "대여 결제",
                amount: totalPrice,
                buyer_email: profile.email,
                buyer_name: profile.name,
            }, async (rsp) => {
                if (rsp.success) {
                    // 성공 시 결제 검증 요청
                    await fetch("/api/payment/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        impUid: rsp.imp_uid,
                        merchantUid: rsp.merchant_uid,
                        reserveId: reserveId,
                        amount: rsp.paid_amount
                    })
                })

                    alert("예약이 완료되었습니다! 결제 페이지로 이동합니다.");
                    //navigate("/payment", { state: { reservation: reservationResult } }); // 예: 예약 결과 넘기며 결제 페이지 이동
            
                }else{
                    alert("결제 실패:" + rep.error_msg);
                }

            })


        } catch (error) {
            alert("예약 처리 중 오류가 발생했습니다.");
            console.error(error);
        }
        
    }


    return(
        <>
            <h1 className="top=subject">장바구니</h1>
            <div className="">
                <div className="">
                    <button onClick={toggleAllCheck} className="select-btn">전체 선택</button>
                </div>
                {
                    cartGroups.map((group,groupIdx)=>(
                        <div key={group.rentId} className="">
                            <h3>{group.name}</h3>
                                {
                                    group.items.map((item,itemIdx) => (
                                        
                                        <div key={item.cartId} className="border-1">
                                            <input type="checkbox" id={`checkbox-${item.cartId}`}  checked={checkedItems.has(item.cartId)} onChange={()=>toggleCheck(item.cartId)}/>
                                            
                                            <label htmlFor={`checkbox-${item.cartId}`} className="flex items-center">
                                                <img className="item-img" src={`http://localhost:8080${item.image}`} style={{ width: '120px', height: 'auto', objectFit: 'cover', marginRight: '10px' }}/>
                                                
                                                <div className="">
                                                    <div className="">
                                                        <strong>{item.itemName}</strong><br/>
                                                        <p>대여날짜: 
                                                            {formatDate(item.rentStart) === formatDate(item.rentEnd)
                                                                ? formatDate(item.rentStart)
                                                                : `${formatDate(item.rentStart)} ~ ${formatDate(item.rentEnd)}`}</p>
                                                        <p>대여시간: {formatTime(item.rentStart)} ~{formatTime(item.rentEnd)}</p>
                                                        <p>사이즈 : {item.size}</p>
                                                    </div>
                                                    <div className="">
                                                        <p>수량: {item.quantity}개</p><br/>
                                                        <p>가격: {item.price.toLocaleString()}원</p>
                                                    </div>
                                                </div>    
                                            </label>
                                        </div>
                                    ))
                                }
                        </div>
                    ))
                }
                {/* 총 금액 및 결제 버튼 */}
                <div>
                    <div>
                        총 결제 금액: {totalPrice.toLocaleString()}원
                    </div>
                    <div>
                        <button onClick={handlePayment} disabled={checkedItems.size === 0}>결제하기</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CartList;