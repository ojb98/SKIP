import { useSelector } from "react-redux";

const MyReviewPage = () => {
    const profile = useSelector(state => state.loginSlice);
    console.log(profile.username);

    return (
        <>
            review
        </>
    )
}

export default MyReviewPage;