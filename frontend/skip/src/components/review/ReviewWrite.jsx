import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { createReviewApi } from "../../api/reviewApi";

//임의의 예약 ID
const reserveId = 15;

const ReviewWrite = () => {

  const [imageFile, setImageFile] = useState(null); //실제 이미지 파일
  const [previewUrl, setPreviewUrl] = useState(null); //이미지 미리보기 URL
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [textError, setTextError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== 'jpg') {
      alert('jpg 파일만 업로드 할 수 있습니다.');
      e.target.value = '';
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  // 별점에 따른 텍스트 반환
  const getRatingText = (rating) => {
    switch (rating) {
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
    e.preventDefault();

    let valid = true;

    if (selectedRating === 0) {
      setRatingError("별점을 입력해주세요.");
      valid = false;
    } else {
      setRatingError("");
    }

    if (reviewText.trim() === "") {
      setTextError("리뷰 내용을 작성해주세요.");
      valid = false;
    } else {
      setTextError("");
    }

    if (!valid) return;

    const reviewData = {
      rating: selectedRating,
      content: reviewText,
    };

    try {
      const response = await createReviewApi(reserveId, reviewData, imageFile);
      console.log("리뷰 등록 성공:", response);
      alert("리뷰가 성공적으로 등록되었습니다.");
      window.close();
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패하였습니다.");
    }
  };


  return (
    <div className="">
      <div className="">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className="text-[32px] text-[#fff] font-bold text-center p-[24px] bg-[#5399f5]">리뷰 작성</h2>
          <div className="mx-[50px]">
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
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewWrite;