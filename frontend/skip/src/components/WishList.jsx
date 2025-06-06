import { useEffect, useState } from "react";
import { removeWishApi, wishListApi, addWishApi } from "../api/wishApi";
import { useSelector } from "react-redux";
import '../css/wishList.css';
import { useNavigate } from "react-router-dom";


const WishList = () => {
    const profile = useSelector(state => state.loginSlice);
    const [wishlist, setWishlist] = useState([]);
    const [removedId, setRemovedId] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (profile.userId) {
            wishListApi(profile.userId).then(data => setWishlist([...data]));
        }
    }, [profile.userId]);

    const refreshWishList = async () => {
        const data = await wishListApi(profile.userId);
        setWishlist([...data]);
    };

    const handleToggleWish = async (item) => {
        const itemId = item.itemDetailId;

        if (removedId.includes(itemId)) {
            try {
                await addWishApi(profile.userId, itemId);
                setRemovedId(prev => prev.filter(id => id !== itemId));
                await refreshWishList();
            } catch (e) {
                alert("찜 추가 실패");
            }
            return;
        }

        const exists = wishlist.find(w => w.itemDetailId === itemId);
        if (exists) {
            try {
                await removeWishApi(exists.wishlistId);
                setRemovedId(prev => [...prev, itemId]);
            } catch (e) {
                alert("찜 삭제 실패");
            }
        }
    };

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
                                    {removedId.includes(item.itemDetailId) ? "🤍" : "❤️"}
                                </button>
                                <img src={`http://localhost:8080${item.image}`} />
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