import { useEffect, useState } from "react";
import { cartListApi } from "../../api/cartApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCartItemApi } from "../../api/cartApi";
import { updateCartItemApi } from "../../api/cartApi";
import axios from "axios";
import "../../css/cartList.css";

const CartList=()=>{
    const navigate = useNavigate();

    const [cartGroups, setCartGroups] = useState([]);

    // 체크된 상세 항목 키를 저장 (cartId)
    const [checkedItems, setCheckedItems] = useState(new Set());  

    const profile = useSelector(status => status.loginSlice);

    useEffect(()=>{
        // userId 없으면 로그인 페이지로 리디렉트
        if (!profile?.userId) {
            navigate("/login");
            return;
        }

        getcartList();
    },[profile.userId]);

    
    //장바구니 목록 불러오기
    const getcartList=()=>{
        //userId값 넣어주기
        cartListApi(profile.userId).then(data=>{
            setCartGroups([...data]);
            setCheckedItems(new Set());  //선택된 항목들을 초기화
        })
    }


    // 대여날짜/반납날짜 날짜포맷
    const formatDate = (rentDate) => {
        if (!rentDate) return "-";
        const date = new Date(rentDate);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 대여시간/반납시간 날짜포맷
    const formatTime = (rentDate) => {
        if (!rentDate) return "-";
        const date = new Date(rentDate);
        const hours = `${date.getHours()}`.padStart(2, "0");
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    // // 반납시간 - 대여시간 = 시간구하기 
    // const getDurationHour = (start, end) => {
    //     const startDate = new Date(start);
    //     const endDate = new Date(end);
    //     const diffMs = endDate - startDate;
    //     return diffMs / (1000 * 60 * 60);  // ms → 시간
    // };


    // 개별선택 체크박스
    const toggleCheck=(cartId)=>{
        setCheckedItems((prev)=>{
            const newSet = new Set(prev);
            //has() : Set 안에 특정 값이 존재하는지 여부
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

    // 장바구니 개별 삭제
    const deleteCartItem= async(cartId)=>{
        try {
            await removeCartItemApi([cartId]);   
            getcartList();                     // 장바구니 목록 다시 불러오기
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    }

    // 장바구니 선택 삭제
    const deleteSelectedCheck = async()=>{
        if (checkedItems.size === 0) {
            alert("삭제할 장비를 선택해주세요.");
            return;
        }

        const itemCount = checkedItems.size;
        const confirmDelete = window.confirm(`${itemCount}개의 장비를 삭제하시겠습니까?`);
        if (!confirmDelete) return;

        try {
            // Array.from() : Set을 배열로 변환
            const cartIds = Array.from(checkedItems);
            await removeCartItemApi(cartIds);

            getcartList(); // 삭제 후 장바구니 목록 다시 불러오기
        } catch (err) {
            console.error("선택 삭제 실패:", err);
            alert("선택 삭제 중 오류가 발생했습니다.");
        }
    }

    // 수량 변경
    const updateQuantity = async(cartId, delta) => {
        // 현재 수량 찾기
        const currentItem = cartGroups.flatMap(group => group.items).find(item => item.cartId === cartId);
        if (!currentItem) return;

        // 새 수량 계산 (최소 1 이상)
        const newQuantity = Math.max(1, currentItem.quantity + delta);

        try {
            // 서버에 수량 변경 요청
            await updateCartItemApi(cartId, newQuantity);

            // 성공하면 상태(화면) 업데이트
            setCartGroups(prevGroups => prevGroups.map(group => ({
                ...group,
                items: group.items.map(item =>
                    item.cartId === cartId? {
                        ...item,
                        quantity: newQuantity,
                        // 단가 = (기존 총 가격 / 기존 수량) 
                        // 총 가격 = 단가 * 새로운 수량
                        price: (item.price / item.quantity) * newQuantity
                    }
                    : item
                )
            })));

        } catch (error) {
            console.error("수량 변경 실패", error);
            alert("수량 변경 중 오류가 발생했습니다.");
        }
    }

    // 실제로 결제할 항목들만 배열로 추출
    // flatMap() : 배열들을 하나로 쭉 펼쳐(flatten)서(1차원 배열로) 반환
    const selectedItems = cartGroups.flatMap(group => group.items)
        .filter(item => checkedItems.has(item.cartId));

    // 선택된 항목의 총 가격 계산
    // reduce() : 배열의 모든 요소를 하나의 값으로 축약(누적)할 때 사용
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

    // 결제   
    const handlePayment = async () => {

        if (checkedItems.size === 0) {
            alert("결제할 상품을 선택해주세요.");
            return;
        }
        
        if (cartGroups.length === 0) {
            alert("예약할 상품이 없습니다.");
            return;
        }

        // 선택된 장바구니만 필터링해서 결제에 사용할 예약 데이터 
        const reservationItems = cartGroups.flatMap(group =>
            group.items.filter(item => checkedItems.has(item.cartId))
                // 새로운 객체 형태로 변환
                .map(item => ({
                    cartId: item.cartId,
                    rentId: group.rentId,
                    rentStart: new Date(item.rentStart).toISOString(),
                    rentEnd: new Date(item.rentEnd).toISOString(),
                    quantity: item.quantity,
                    subtotalPrice: item.price,
                }))
        );

        console.log("reservationItems ==>",reservationItems);


        const merchantUid = `order_${new Date().getTime()}`;
        const IMP = window.IMP;
        IMP.init("imp57043461");

        //결제 요청(아임포트에 보낼 결제 정보)
        IMP.request_pay({
            pg: "kakaopay.TC0ONETIME",
            pay_method: "card",
            merchant_uid: merchantUid,
            name: "대여 결제",
            amount: totalPrice,
            buyer_email: profile.email,
            buyer_name: profile.name,
        }, async (resp) => {  //결제 완료 시 실행할 콜백 함수 정의 (resp는 아임포트 응답 객체)
            console.log("결제 응답 ===>",resp);
            if (resp.success) {  
                try {
                    // 결제 정보를 보내어 결제 검증 및 예약 처리 
                    const res = await axios.post("/api/payments/complete", {
                        impUid: resp.imp_uid,
                        merchantUid: resp.merchant_uid,
                        amount: resp.paid_amount,
                        userId: profile.userId,
                        totalPrice,
                        reservationItems, // 리스트 전송
                    });

                    console.log("결제 완료:", res.data);
                    alert("결제가 완료되었습니다!");
                    // navigate("/payment", { state: { payment: resp.data } });

                } catch (err) {
                    console.error("결제 검증 또는 예약 실패:", err);
                    alert("결제 완료 처리 중 오류가 발생했습니다.");
                }
            } else {
                alert("결제 실패: " + resp.error_msg);
            }
        });
    }


    return(
        <div className="cart-container">
            <h1 className="top-subject">장바구니</h1>
            {cartGroups.length === 0 || cartGroups.every(group => group.items.length === 0) ? (
                <div className="empty-cart-message">장바구니가 비어 있습니다.</div>
            ) : (
                <>
                <div className="select-group">
                    <div className="left-btn">
                        <button onClick={toggleAllCheck} className="select-btn">전체 선택</button>
                    </div>
                    <div className="right-btn">
                        <button onClick={deleteSelectedCheck} className="select-del-btn">선택 삭제</button>
                    </div>
                </div>

                <span className="block mt-4 text-sm text-gray-500 italic">
                    * 자동으로 일주일단위로 비워집니다
                </span>
                <div className="cart-items-container">
                {
                    cartGroups.map(group => (
                        <div key={group.rentId} className="cart-group">
                        {
                            group.items.map(item => (
                            <div key={item.cartId} className="item-group">
                    
                                <label htmlFor={`checkbox-${item.cartId}`} className={`item-wrapper ${checkedItems.has(item.cartId) ? "checked" : ""}`}>
                            
                                <input type="checkbox" id={`checkbox-${item.cartId}`} checked={checkedItems.has(item.cartId)}
                                    onChange={() => toggleCheck(item.cartId)} className="checkbox-btn" />    
                                    <div className="item-content">
                                        <button type="button" onClick={(e) => {
                                            // 버튼 클릭 시 오직 삭제 기능만 작동하기 위함
                                                e.preventDefault();  // label의 기본 동작 (checkbox 토글)을 막음
                                                e.stopPropagation();  // label까지 이벤트가 전달되지 않도록 막음
                                                deleteCartItem(item.cartId);
                                            }} 
                                            className="cart-remove-btn" title="장바구니에서 제거">
                                            X
                                        </button>

                                        <img className="item-img" src={`http://localhost:8080${item.image}`} alt={item.itemName} />

                                        <div className="itemdatail-group">
                                            <div className="item-content-group">
                                                <h4 onClick={() => navigate(`/rent/product/${group.rentId}/${item.itemId}`,{
                                                    state : {
                                                        date: formatDate(item.rentStart),
                                                        startTime: formatTime(item.rentStart),
                                                        duration: getDurationHour(item.rentStart, item.rentEnd),
                                                        size: item.size,
                                                    }
                                                })} className="link-area">
                                                    <strong>{group.name}</strong>
                                                </h4> 
                                                <span>{item.itemName}</span><br />
                                                <p>대여날짜: {
                                                formatDate(item.rentStart) === formatDate(item.rentEnd)
                                                    ? formatDate(item.rentStart)
                                                    : `${formatDate(item.rentStart)} ~ ${formatDate(item.rentEnd)}`
                                                }</p>
                                                <p>대여시간: {formatTime(item.rentStart)} ~ {formatTime(item.rentEnd)}</p>
                                                <p>사이즈: {item.size}</p>
                                            </div>
                                            <div className="update-div">
                                                <div className="count-btn">
                                                    <p>수량:</p>
                                                    <div className="quantity-btn">
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartId, -1); }}>-</button>
                                                        <span>{item.quantity}</span>
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartId, 1); }}>+</button> 개
                                                    </div>
                                                </div>
                                                <p>가격: {item.price.toLocaleString()}원</p>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            ))
                        }
                        </div>
                    ))
                }
                </div>

                <div className="payment-group">
                    <div className="totalPrice-div">
                        <p>총 결제 금액: {totalPrice.toLocaleString()}원</p>
                    </div>
                        <button onClick={handlePayment} className="payment-btn" disabled={checkedItems.size === 0}>결제하기</button>
                </div>
                </>
            )}
        </div>
    )    
}
export default CartList;