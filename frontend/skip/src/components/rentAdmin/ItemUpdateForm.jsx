import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCategoryOptions from "../../hooks/useCategoryoptions";
import axios from "axios";

const ItemUpdateForm=()=>{

    const {rentId, itemId}=useParams();

    const navigate = useNavigate();

    const fileRef = useRef();

    const [formData, setFormData] = useState({
        rentId: rentId,
        itemId: itemId,
        name: "",
        category: ""
    });

    const [timePrices, setTimePrices] = useState([{ rentHour: "", price: "" }]);
    const [commonSizeStocks, setCommonSizeStocks] = useState([{ size: "", totalQuantity: "", stockQuantity: ""}]);

    const [categories, setCategories] = useState([]);

    const selectedOptions = useCategoryOptions(formData.category);
    
    // 카테고리 목록을 가져오는 useEffect
    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const response = await axios.get("/api/enums/itemCategory");
                setCategories(response.data);
            } catch (error) {
                console.error("카테고리 불러오기 실패:", error);
                setCategories([]);
            }
        }

        fetchCategories();

    }, []);

    // 장비 정보를 가져오는 useEffect
    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/items/${rentId}/${itemId}`);
                console.log("아이템 조회===>",response);
                
                const item = response.data;
                    setFormData({
                        rentId: rentId,
                        itemId: itemId,
                        name: item.name,
                        category: item.category,
                    });
                    setTimePrices(
                        item.detailList.map((detail) => ({
                            rentHour: detail.rentHour,
                            price: detail.price,
                        }))
                    );
                    setCommonSizeStocks(
                        item.detailList.flatMap((detail) =>
                            detail.sizeStockList.map((sizeStock) => ({
                                size: sizeStock.size,
                                totalQuantity: sizeStock.totalQuantity,
                                stockQuantity: sizeStock.stockQuantity,
                            })
                        ))
                    );
            } catch (error) {
                console.error("장비 정보 불러오기 실패:", error);
            }
        }
        fetchItemDetails();
    }, [rentId, itemId]);


// 폼 데이터 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 시간/가격 변경 핸들러
  const handleTimePriceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...timePrices];
    updated[index][name] = value;
    setTimePrices(updated);
  };

  // 사이즈/수량 변경 핸들러
  const handleSizeStockChange = (index, field, value) => {
    const updated = [...commonSizeStocks];
    updated[index][field] = value;
    setCommonSizeStocks(updated);
  };

  // 시간/가격 추가
  const addTimePrice = () => {
    setTimePrices([...timePrices, { rentHour: "", price: "" }]);
  };

  // 시간/가격 삭제
  const removeTimePrice = (index) => {
    setTimePrices(timePrices.filter((_, i) => i !== index));
  };

  // 사이즈/수량 추가
  const addSizeStock = () => {
    setCommonSizeStocks([
      ...commonSizeStocks,
      { size: "", totalQuantity: "", stockQuantity: "" },
    ]);
  };

  // 사이즈/수량 삭제
  const removeSizeStock = (index) => {
    setCommonSizeStocks(commonSizeStocks.filter((_, i) => i !== index));
  };

  // 이미지 파일 리셋
  const resetFileInput = () => {
    if (fileRef.current) {
      fileRef.current.value = null;
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 장비명과 카테고리 검증
    if (!formData.name || !formData.category) {
      alert("장비명과 카테고리를 입력하세요.");
      return;
    }

    // 이미지 검증
    const imageInput = fileRef.current;
    if (!imageInput || imageInput.files.length === 0) {
      alert("이미지는 필수입니다.");
      return;
    }

    // 시간/가격 검증
    if (
      timePrices.some((tp) => !tp.rentHour || !tp.price)
    ) {
      alert("모든 대여 시간/가격 정보를 입력하세요.");
      return;
    }

    // 사이즈/수량 검증
    if (
      commonSizeStocks.some(
        (s) => !s.size || !s.totalQuantity || !s.stockQuantity
      )
    ) {
      alert("모든 사이즈/수량 정보를 입력하세요.");
      return;
    }

    // 데이터 변환
    const transformedDetails = timePrices.map((tp) => ({
      rentHour: tp.rentHour,
      price: tp.price,
      sizeStockList: commonSizeStocks.map((s) => ({
        size: s.size,
        totalQuantity: parseInt(s.totalQuantity) || 0,
        stockQuantity: parseInt(s.stockQuantity) || 0,
      })),
    }));

    const requestDTO = {
      ...formData,
      detailList: transformedDetails,
    };

    const submitData = new FormData();
    submitData.append(
      "itemRequest",
      new Blob([JSON.stringify(requestDTO)], { type: "application/json" })
    );
    if (imageInput && imageInput.files.length > 0) {
      submitData.append("image", imageInput.files[0]);
    }

    try {
      await axios.put(`http://localhost:8080/api/items/update`,submitData,{
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("장비 수정 완료!");
      navigate(`/itemAdmin/${rentId}`);
    } catch (error) {
      console.error("장비 수정 실패:", error);
      alert("장비 수정에 실패했습니다.");
    }
  };


    return (
        <div className="form-container">
            <h1>장비 수정</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="rentId" value={formData.rentId} />

                <div className="form-group">
                    <label htmlFor="category">카테고리</label>
                    <select name="category" id="category" value={formData.category} onChange={handleFormChange}>
                        <option value="">카테고리를 선택하세요</option>
                        {
                            categories.map((cat, index) => (
                            <option key={index} value={cat.code}>{cat.label}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="name">장비명</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} placeholder="일반의류 or 고급의류" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="image">이미지</label>
                    <input type="file" id="image" name="image" ref={fileRef} accept="image/*" />
                </div>

                <h1>대여 옵션</h1>

                <div className="form-group">
                    {
                        
                        timePrices.map((tp, idx) => (
                        <div key={idx}>
                            <label htmlFor="rentHour">시간</label>
                            <select name="rentHour" value={tp.rentHour} onChange={(e) => handleTimePriceChange(idx, e)}>
                            <option value="">시간 선택</option>
                            {
                                selectedOptions.hours.map(hour => (
                                    <option key={hour} value={hour}>{hour}시간</option>
                                ))
                            }
                            </select>
                            <label htmlFor="price">가격</label>
                            <input type="number" name="price" value={tp.price} onChange={(e) => handleTimePriceChange(idx, e)} placeholder="가격"/>
                            <button type="button" className="delete-btn" onClick={() => removeTimePrice(idx)}>시간 삭제</button>
                        </div>
                        ))
                    }
                </div>
                    <button type="button" onClick={addTimePrice}>+ 시간 추가</button>

                    <hr/><br/>

                    <h2>사이즈 / 수량</h2>
                    <table>
                        <thead>
                            <tr><th>사이즈</th><th>수량</th><th>재고</th></tr>
                        </thead>
                        <tbody>
                            {
                                commonSizeStocks.map((s, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <select value={s.size} onChange={(e) => handleSizeStockChange(idx, "size", e.target.value)}>
                                            <option value="">사이즈 선택</option>
                                            {
                                                selectedOptions.sizes.map(size => (
                                                <option key={size} value={size}>{size}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td>
                                    <input
                                        type="number"
                                        value={s.totalQuantity}
                                        onChange={(e) => {
                                        const updated = [...timePrices];
                                        updated[idx].sizeStockList[sIdx].totalQuantity = e.target.value;
                                        setTimePrices(updated);
                                        }}
                                    />
                                    </td>
                                    <td>
                                    <input
                                        type="number"
                                        value={s.stockQuantity}
                                        onChange={(e) => {
                                        const updated = [...timePrices];
                                        updated[idx].sizeStockList[sIdx].stockQuantity = e.target.value;
                                        setTimePrices(updated);
                                        }}
                                    />

                                    </td>
                                    <td>
                                    <button type="button" onClick={() => {
                                        const updated = [...timePrices];
                                        updated[idx].sizeStockList.splice(sIdx, 1);
                                        setTimePrices(updated);
                                    }}>삭제</button>
                                    </td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button type="button" onClick={() => {
                    const updated = [...timePrices];
                    updated[idx].sizeStockList.push({ size: "", totalQuantity: "", stockQuantity: "" });
                    setTimePrices(updated);
                    }}>+ 사이즈 추가</button>
           
                    <hr/><br/>

                <button type="submit">장비 수정</button>
            </form>
        </div>
    )
}
export default ItemUpdateForm;