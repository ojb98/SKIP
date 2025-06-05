import { useEffect } from "react";
import { wishListApi } from "../api/wishApi";

const WishList=()=>{

    //userId값 꺼내오기
    const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);

    const [wishlist, setWishlist] = useState([]);


    useEffect(() => {
        wishListApi(profile.userId).then(data=>{
            setWishlist([...data]);
        })
    },[profile.userId]);



    return(
        <>
            <h1>찜 목록</h1>
            {
               
            }
        </>
    )
}
export default WishList;