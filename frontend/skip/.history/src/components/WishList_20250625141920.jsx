import { useEffect, useState } from "react";
import { removeWishApi, wishListApi, addWishApi } from "../api/wishApi";
import { useSelector } from "react-redux";
import '../css/wishList.css';
import { useNavigate } from "react-router-dom";


const WishList = () => {
    const profile = useSelector(state => state.loginSlice);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    
    useEffect(() => {
        if (profile.userId) {
            wishListApi(profile.userId).then(data => setWishlist([...data]));
        }
    }, [profile.userId]);


    const handleToggleWish = async (item) => {
        const newStatus = item.useYn === 'Y' ? 'N' : 'Y';  // 상태 토글: Y -> N 또는 N -> Y
        try {
            // 1. 서버에 상태 변경 요청 (비동기 처리)
            await removeWishApi(item.wishlistId, newStatus);

            // 2. 로컬 UI 즉시 반영
            setWishlist(prev =>
                prev.map(w =>
                    w.wishlistId === item.wishlistId 
                    ? { ...w, useYn: newStatus }    // 이 항목만 상태 바꿈
                    : w                            // 나머지는 그대로 유지
                    
                )
            )

        } catch (e) {
            alert("찜 상태 변경 실패");
        }
    }


    return (
        <div className="cart-container">
            <h1 className="top-subject">찜 목록</h1>
            <div className="wish-group">
            {
                wishlist.length === 0 ? (
                    <div className="empty-message">찜한 상품이 없습니다.</div>
                ) : (
                        wishlist.map(item => (
                            <div key={item.wishlistId} onClick={() => navigate(`/rent/product/${item.rentId}/${item.itemId}`)} 
                                className={`wish-items ${item.isActive === 'N' ? 'disabled' : ''}`}>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleWish(item)
                                }} className="wish-check">
                                    {item.useYn === 'Y' ?  "❤️" : "🤍" }
                                </button>
                                <img src={`{${_APP_BASE__}${item.image}`} />
                                <span className="wish-rentNeme"><strong>{item.rentName}</strong></span>
                                <span className="wish-itemName">{item.itemName}</span><br/>
                               
                                <div className="wish-footer">
                                    <div className="wish-sizeAndprice">
                                        <span className="wish-size">{item.size}</span>
                                        <span className="wish-price">{item.price.toLocaleString()}원</span>
                                    </div>
                                    {item.isActive === 'N' && (
                                        <div className="inactive-label">사용 중지</div>
                                    )}
                                </div>

                            </div>
                        ))
                    )
            }
            </div>
        </div>
    )
}

export default WishList;