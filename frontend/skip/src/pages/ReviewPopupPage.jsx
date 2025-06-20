import { useLocation } from "react-router-dom";
import ReviewWrite from "../components/review/ReviewWrite";

const ReviewPopupPage=({})=>{
  const location = useLocation();
  const isEdit = location.pathname.includes("/edit");
  return(
    <main>
      <ReviewWrite mode={isEdit ? "edit" : "write"} />
    </main>
  )
}


export default ReviewPopupPage;