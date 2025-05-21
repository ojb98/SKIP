import SideBar from "../components/SideBar";
import useProfile from "../hooks/useProfile";

const MyReviewPage = () => {
    const profile = useProfile();
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