import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";

const MyReviewPage = () => {
    const profile = useSelector(state => state.loginSlice);
    console.log(profile.username);

    return (
        <>
            <div className="w-6xl flex justify-between">
                <SideBar active="review"></SideBar>

                <div className="w-[800px]">
                    
                </div>
            </div>
        </>
    )
}

export default MyReviewPage;