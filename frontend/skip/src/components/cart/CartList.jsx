import { useEffect, useState } from "react";
import { cartListApi } from "../../api/cartApi";
import { useSelector } from "react-redux";

const CartList=()=>{

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
        getcartList();
    },[profile.userId]);

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
    
    const handlePayment=()=>{
        const selectedItems = Array.from(checkedItems);
        alert(`총 ${totalPrice.toLocaleString()}원 결제를 진행합니다.`);
        //결제로직
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