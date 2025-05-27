import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { writeReviewApi } from "../../api/reviewApi";
import { useSelector } from "react-redux";

//임의의 예약, 유저 값
 const reserveId = 1;
// const userId = 1;

//마이페이지 에서 props로 reserveId와 userId를 받을 경우 아래와 같이 수정
//const ReviewPopupPage = ({reserveId, userId}) => {}
  
  const ReviewWrite=()=>{
    const profile = useSelector(state => state.loginSlice);
    console.log(profile);

 const [imageFile, setImageFile] = useState(null); //실제 이미지 파일
   const [previewUrl, setPreviewUrl] = useState(null); //이미지 미리보기 URL
   const [hoverIndex, setHoverIndex] = useState(-1);
   const [selectedRating, setSelectedRating] = useState(0);
   const [reviewText, setReviewText] = useState("");
   const [ratingError, setRatingError] = useState("");
   const [textError, setTextError] = useState("");
 
   const handleFileChange = (e) => {
     const file = e.target.files[0];
     if(!file) return;
 
     const fileName = file.name;
     const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
     
     if(fileExtension !== 'jpg') {
       alert('jpg 파일만 업로드 할 수 있습니다.');
       e.target.value = ''; // 파일 선택 취소
       setImageFile(null);
       setPreviewUrl(null);
       return;
     }
 
     setImageFile(file);
     setPreviewUrl(URL.createObjectURL(file));
   }
 
   // 별점에 따른 텍스트 반환
   const getRatingText = (rating) => {
     switch(rating) {
       case 1: return "최악이에요!";
       case 2: return "별로예요...";
       case 3: return "보통이에요.";
       case 4: return "좋아요~";
       case 5: return "최고였어요!";
       default: return "";
     }
   }
 
   // submit버튼 이벤트 처리
   const handleSubmit = async (e) => {
     e.preventDefault(); //새로고침 방지
 
     let valid = true;
 
     if(selectedRating === 0) {
       setRatingError("별점을 입력해주세요.");
       valid = false;
     } else {
       setRatingError("");
     }
 
     if(reviewText.trim() === ""){
       setTextError("리뷰 내용을 작성해주세요.");
       valid = false;
     } else {
       setTextError("");
     }
 
     if (!valid) return;
 
     const formData = new FormData();
     formData.append("reserveId", reserveId);
     formData.append("rating", selectedRating);
     formData.append("content", reviewText);
     if(imageFile) {
       formData.append("imageFile", imageFile);
     }
 
     try {
       const response = await writeReviewApi(formData, profile.userId);
       console.log("리뷰 등록 성공:", response);
       alert("리뷰가 성공적으로 등록되었습니다.");
       window.close();
     } catch(error) {
       console.error("리뷰 등록 실패:", error);
       alert("리뷰 등록에 실패하였습니다.");
     }
   };
 
 
   return(
     <div className="flex justify-center m-[50px]">
       <div className="min-w-[450px]">
         <form action="post" onSubmit={handleSubmit} encType="multipart/form-data">
           <h2 className="text-[24px] font-bold text-center">리뷰 작성</h2>
           <div className="flex justify-start items-center gap-[30px] mt-2.5">
             <div>
               <img src="/images/1.png" className="w-[150px] h-[150px]" />
             </div>
             <div>
               <p><span className="font-bold">상품명:</span> 리프트 1일권</p>
               <p><span className="font-bold">상품상세정보:</span> 리프트1일권</p>
             </div>
           </div>
           <div>
             <p className="text-center font-bold mt-[30px]">별점을 선택하세요:</p>
             <div className="text-center mt-[10px]">
               {[0, 1, 2, 3, 4].map((index) => (
                 <FontAwesomeIcon 
                   key={index}
                   icon={faStar}
                   className="text-[40px] cursor-pointer transition duration-200"
                   onMouseEnter={() => setHoverIndex(index)}
                   onMouseLeave={() => setHoverIndex(-1)}
                   onClick={() => setSelectedRating(index + 1)}
                   style={{
                     color:
                       index <= (hoverIndex !== -1 ? hoverIndex : selectedRating - 1)
                         ? "#e9d634"
                         : "#bfbfbf",
                   }}
                 />
               ))}
             </div>
             {selectedRating > 0 && (
               <p className="mt-[10px] text-red-500 text-center">
                 {getRatingText(selectedRating)}
               </p>
             )}
             {ratingError && (
               <p className="text-red-600 text-center mt-2.5">{ratingError}</p>
             )}
           </div>
 
           <div className="mt-[30px]">
             <p className="text-center font-bold">리뷰 내용을 작성하세요.</p>
             <textarea 
               className="w-[100%] h-[200px] mt-[15px] p-[10px] border rounded-[5px] resize-none"
               value={reviewText}
               onChange={(e) => setReviewText(e.target.value)}>
             </textarea>
             {textError && (
               <p className="text-red-600 text-center mt-2.5">{textError}</p>
             )}
           </div>
 
           <div className="mt-[30px]">
             <label htmlFor="file" className="text-[#5399f5] font-bold flex justify-center items-center w-full h-[50px] border rounded-[5px] bg-white cursor-pointer">이미지 업로드</label>
             <input 
               type="file"
               accept=".jpg"
               onChange={handleFileChange}
               id="file"
               className="w-0 overflow-hidden"
               />
 
             {previewUrl && (
               <img
                 src={previewUrl}
                 className="w-[100px] border rounded"
               />
             )}
           </div>
           <div className="mt-[10px]">
             <button type="submit" className="text-white w-full h-[50px] rounded-[5px] bg-[#5399f5] cursor-pointer">리뷰 등록</button>
           </div>
         </form>
       </div>
     </div>
   )
 }

export default ReviewWrite;