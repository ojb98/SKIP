import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCategoryOptions from "../../hooks/useCategoryoptions";
import axios from "axios";
import '../../css/itemInsertForm.css';

const ItemUpdateForm = () => {
    const { rentId, itemId } = useParams();
    const navigate = useNavigate();
    const fileRef = useRef(); 

    const [formData, setFormData] = useState({
        rentId: rentId,
        itemId: itemId,
        name: "",
        category: ""
    });

    const [timePrices, setTimePrices] = useState([{ rentHour: "", price: "" }]);
    const [commonSizeStocks, setCommonSizeStocks] = useState([
        { size: "", totalQuantity: "", stockQuantity: "" }
    ]);
    const [categories, setCategories] = useState([]);

    const selectedOptions = useCategoryOptions(formData.category);

    // 카테고리 목록 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/enums/itemCategory");
                setCategories(response.data);
            } catch (error) {
                console.error("카테고리 불러오기 실패:", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    // 아이템 상세 불러오기
    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/items/${rentId}/${itemId}`);
                console.log("아이템 조회 ===>", response);

                const item = response.data;

                setFormData({
                    rentId: rentId,
                    itemId: itemId,
                    name: item.name,
                    category: item.category
                });

                setTimePrices(
                    item.detailList.map((detail) => ({
                        rentHour: detail.rentHour,
                        price: detail.price
                    }))
                );

                setCommonSizeStocks(
                    item.sizeStockList.map((sizeStock) => ({
                        size: sizeStock.size,
                        totalQuantity: sizeStock.totalQuantity,
                        stockQuantity: sizeStock.stockQuantity
                    }))
                );
            } catch (error) {
                console.error("장비 정보 불러오기 실패:", error);
            }
        };

        fetchItemDetails();
    }, [rentId, itemId]);

    // 공통 입력 핸들러
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 시간/가격 핸들러
    const handleTimePriceChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...timePrices];
        updated[index][name] = value;
        setTimePrices(updated);
    };

    // 사이즈/수량 핸들러
    const handleSizeStockChange = (index, field, value) => {
        const updated = [...commonSizeStocks];
        updated[index][field] = value;
        setCommonSizeStocks(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("수정 버튼 클릭!")

        if (!formData.name || !formData.category) {
            alert("장비명과 카테고리를 입력하세요.");
            return;
        }

        if (timePrices.some((tp) => !tp.rentHour || !tp.price)) {
            alert("모든 대여 시간/가격 정보를 입력하세요.");
            return;
        }

        if (commonSizeStocks.some((s) => !s.size || !s.totalQuantity || !s.stockQuantity)) {
            alert("모든 사이즈/수량 정보를 입력하세요.");
            return;
        }

        //requestDTO 객체 만들기
        // 이 전체 구조가 백엔드의 ItemConfirmDTO와 일치
        const requestDTO = {
            ...formData,
            detailList: timePrices.map((tp) => ({
                rentHour: tp.rentHour,
                price: tp.price
            })),
            sizeStockList: commonSizeStocks.map((s) => ({
                size: s.size,
                totalQuantity: parseInt(s.totalQuantity),
                stockQuantity: parseInt(s.stockQuantity)
            }))
        };

        const submitData = new FormData();

        submitData.append("itemRequest",new Blob(
            [JSON.stringify(requestDTO)],
            { type: "application/json" }
        ));

        //이미지 추가
        if (fileRef.current && fileRef.current.files.length > 0) {
            submitData.append("image", fileRef.current.files[0]);
        }

        axios.put("http://localhost:8080/api/items/update", submitData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
            alert("장비 수정 완료!");
            navigate(`/itemAdmin/list/${rentId}`);
        })
        .catch(error => {
            console.error("장비 수정 실패:", error);
            alert("장비 수정에 실패했습니다.");
        });

    }

    return (
        <div className="form-container">
            <h1 className="top-subject">장비 수정</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="rentId" value={formData.rentId} />

                <div className="item-group">
                    <div className="form-group">
                        <label htmlFor="category">카테고리</label>
                        <select name="category" id="category" value={formData.category} onChange={handleFormChange}>
                            <option value="">카테고리를 선택하세요</option>
                            {   
                                categories.map((cat, index) => (
                                <option key={index} value={cat.code}>
                                    {cat.label}
                                </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">장비명</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} placeholder="장비명" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">이미지</label>
                        <input type="file" id="image" name="image" ref={fileRef} accept="image/*" />
                    </div>
                </div>

                
                <h2 className="sub-subject">대여 옵션</h2>
                <div className="time-group">
                    {
                        timePrices.map((tp, idx) => (
                            <div key={idx}> 
                                <div className="form-inline-row">
                                    <label>시간</label>
                                    <select name="rentHour" value={tp.rentHour} onChange={(e) => handleTimePriceChange(idx, e)}>
                                        <option value="">시간 선택</option>
                                        {selectedOptions.hours.map((hour) => (
                                            <option key={hour} value={hour}>
                                                {hour}시간
                                            </option>
                                        ))}
                                    </select>

                                    <label>가격</label>
                                    <input type="number" name="price" value={tp.price} onChange={(e) => handleTimePriceChange(idx, e)} placeholder="가격"/>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <hr/><br/>

                <h2 className="sub-subject">사이즈 / 수량</h2>
                <table className="item-table">
                    <thead className="item-thead">
                        <tr>
                            <th>사이즈</th><th>총 수량</th><th>재고 수량</th>
                        </tr>
                    </thead>
                    <tbody className="item-tbody">
                        {
                            commonSizeStocks.map((s, idx) => (
                            <tr key={idx}>
                                <td>
                                    <select value={s.size} onChange={(e) => handleSizeStockChange(idx, "size", e.target.value)}>
                                        <option value="">사이즈 선택</option>
                                        {
                                            selectedOptions.sizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <input type="number" value={s.totalQuantity} onChange={(e) => handleSizeStockChange(idx, "totalQuantity", e.target.value)}/>
                                </td>
                                <td>
                                    <input type="number" value={s.stockQuantity} onChange={(e) => handleSizeStockChange(idx, "stockQuantity", e.target.value)}/>
                                </td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>

                <hr/><br/>
                <button type="submit" className="update-btn">장비 수정</button>
            </form>
        </div>
  )
}

export default ItemUpdateForm;