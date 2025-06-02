import { useState } from "react";
import { updateReviewApi } from "../../api/reviewApi";

const ReviewUpdate=({ reviewId, reserveId, userId, initialRating = 0, initialContent = "", initialImageUrl = null}) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialContent);
  const [ratingError, setRatingError] = useState("");
  const [textError, setTextError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

    if(fileExtension !== 'jpg') {
      alert('jpg 파일만 업로드 할 수 있습니다.');
      e.target.value = '';
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    if (selectedRating === 0) {
      setRatingError("별점을 입력해주세요.");
      valid = false;
    } else {
      setRatingError("");
    }

    if(reviewText.trim() === "") {
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
      const response = await updateReviewApi(reviewId, formData, userId);
      console.log("리뷰 수정 성공:", response);
      alert("리뷰가 성공적으로 수정되었습니다.");
      window.close();
    } catch(error) {
      console.error("리뷰 수정 실패:", error);
      alert("리뷰 수정에 실패하였습니다.");
    }
  };
  
  return(
    <div className="flex justify-center m-[50px]">
      <div className="min-w-[450px]">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className="text-[24px] font-bold text-center">리뷰 수정</h2>

          {/* 별점 */}
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
                  color: index <= (hoverIndex !== -1 ? hoverIndex : selectedRating - 1)
                    ? "#e9d634"
                    : "#bfbfbf",
                }}
              />
            ))}
            {ratingError && (
              <p className="text-red-600 text-center mt-2.5">{ratingError}</p>
            )}
          </div>

          {/* 내용 */}
          <div className="mt-[30px]">
            <textarea
              className="w-full h-[200px] p-[10px] border rounded-[5px]"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            {textError && (
              <p className="text-red-600 text-center mt-2.5">{textError}</p>
            )}
          </div>

          {/* 이미지 업로드 */}
          <div className="mt-[30px]">
            <label htmlFor="file" className="cursor-pointer bg-white border text-[#5399f5] font-bold flex justify-center items-center h-[50px] rounded-[5px]">
              이미지 업로드
            </label>
            <input
              type="file"
              accept=".jpg"
              onChange={handleFileChange}
              id="file"
              className="hidden"
            />
            {previewUrl && (
              <img src={previewUrl} className="w-[100px] border rounded mt-2" />
            )}
          </div>

          {/* 제출 */}
          <div className="mt-[10px]">
            <button type="submit" className="text-white w-full h-[50px] rounded-[5px] bg-[#5399f5]">
              리뷰 수정
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ReviewUpdate;