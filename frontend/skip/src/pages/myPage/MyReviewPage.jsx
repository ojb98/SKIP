import { useSelector } from "react-redux";
import UserReviewList from "../../components/review/UserReviewList";

const MyReviewPage = () => {
    const profile = useSelector(state => state.loginSlice);
    console.log(profile.username);

    return (
        <>
            {/* <UserReviewList></UserReviewList> */}
        </>
    )
}

export default MyReviewPage;