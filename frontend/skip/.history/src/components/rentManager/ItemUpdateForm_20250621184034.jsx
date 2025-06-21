import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCategoryOptions from "../../hooks/useCategoryOptions";
import axios from "axios";
import '../../css/itemInsertForm.css';
import caxios from "../../api/caxios";
import { rentNameApi } from "../../api/rentListApi";

const ItemUpdateForm = () => {
    const { rentId, itemId } = useParams();
    const navigate = useNavigate();
    const fileRef = useRef(); 
    const [rentName, setRentName] = useState("");

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
    

    useEffect(() => {
        const fetchRentName = async () => {
            if (!rentId) return;
            try {
                const data = await rentNameApi(rentId);
                setRentName(data); 
            } catch (error) {
                console.error("렌탈샵 이름 조회 실패:", error);
            }
        };
        fetchRentName();
    }, [rentId]);


    // 카테고리 목록 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await caxios.get("/api/enums/itemCategory");
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
                const response = await caxios.get(`/api/items/${rentId}/${itemId}`);
                const item = response.data;

                setFormData({
                    rentId,
                    itemId,
                    name: item.name,
                    category: item.category
                });

                // 리프트권이면 options 사용
                if (item.category === "LIFT_TICKET" && item.options) {
                    setTimePrices(
                        item.options.map(opt => ({
                            rentHour: opt.rentHour,
                            price: opt.price
                        }))
                    );
                    setCommonSizeStocks(
                        item.options.map(opt => ({
                            size: "", // 리프트권은 사이즈 없음
                            totalQuantity: opt.totalQuantity,
                            stockQuantity: opt.stockQuantity
                        }))
                    );
                } else {
                    setTimePrices(
                        item.detailList.map(detail => ({
                            rentHour: detail.rentHour,
                            price: detail.price
                        }))
                    );
                    setCommonSizeStocks(
                        item.sizeStockList.map(sizeStock => ({
                            size: sizeStock.size,
                            totalQuantity: sizeStock.totalQuantity,
                            stockQuantity: sizeStock.stockQuantity
                        }))
                    );
                }
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

        if (formData.category !== "LIFT_TICKET" &&
            commonSizeStocks.some((s) => !s.size || !s.totalQuantity || !s.stockQuantity)) {
            alert("모든 사이즈/수량 정보를 입력하세요.");
            return;
        }

        //requestDTO 객체 만들기
        // 이 전체 구조가 백엔드의 ItemConfirmDTO와 일치
        const requestDTO = {
            ...formData,
            ...(formData.category === "LIFT_TICKET"
                ? {
                    options: timePrices.map((tp, idx) => ({
                    rentHour: parseInt(tp.rentHour),
                    price: parseInt(tp.price),
                    totalQuantity: parseInt(commonSizeStocks[idx]?.totalQuantity || 0),
                    stockQuantity: parseInt(commonSizeStocks[idx]?.stockQuantity || 0),
                    })),
                }
                : {
                    detailList: timePrices.map(tp => ({
                    rentHour: parseInt(tp.rentHour),
                    price: parseInt(tp.price),
                    })),
                    sizeStockList: commonSizeStocks.map(s => ({
                    size: s.size,
                    totalQuantity: parseInt(s.totalQuantity),
                    stockQuantity: parseInt(s.stockQuantity),
                    })),
                }),
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

        const url = formData.category === "LIFT_TICKET"
        ? "/api/items/updateLiftTicket"
        : "/api/items/update";

        caxios.put(url, submitData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
            alert("장비 수정 완료!");
            navigate(`/rentAdmin/item/list/${rentId}`);
        })
        .catch(error => {
            console.error("장비 수정 실패:", error);
            alert("장비 수정에 실패했습니다.");
        });

    }

    return (
        <div className="item-page-wrapper">
            <h1 className="top-subject">장비 수정</h1>
            <div className="item-detail-wrapper">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label>상호명</label>
                        <input type="hidden" name="rentId" value={formData.rentId} />
                        <input type="text" name="rentname" value={rentName} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>카테고리</label>
                        <select name="category" value={formData.category} onChange={handleFormChange} disabled>
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat.code}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label><span className="required-asterisk">*</span>장비명</label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="장비명" required />
                    </div>
                    <div className="form-group">
                        <label><span className="required-asterisk">*</span>이미지</label>
                        <input type="file" name="image" ref={fileRef} accept="image/*" />
                    </div>
                    <div className="sub-subject">대여 옵션</div>
                    <table className="item-table">
                    <thead>
                        <tr><th>시간</th><th>가격</th></tr>
                    </thead>
                    <tbody>
                        {timePrices.map((tp, i) => (
                        <tr key={i}>
                            <td>
                            <select name="rentHour" value={tp.rentHour} onChange={e => handleTimePriceChange(i, e)} className="form-hour-select">
                                <option value="">시간 선택</option>
                                {selectedOptions.hours.map(h => (
                                <option key={h} value={h}>{h === 8760 ? "1년" : `${h}시간`}</option>
                                ))}
                            </select>
                            </td>
                            <td>
                            <input type="number" name="price" value={tp.price} onChange={e => handleTimePriceChange(i, e)} placeholder="가격" className="form-price-input" />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    <div className="sub-subject">사이즈 / 수량</div>
                    {formData.category !== "LIFT_TICKET" ? (
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th>사이즈</th><th>총 수량</th><th>재고 수량</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commonSizeStocks.map((s, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <select value={s.size} onChange={e => handleSizeStockChange(idx, "size", e.target.value)}>
                                                <option value="">사이즈 선택</option>
                                                {selectedOptions.sizes.map((size) => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input type="number" value={s.totalQuantity} onChange={e => handleSizeStockChange(idx, "totalQuantity", e.target.value)} />
                                        </td>
                                        <td>
                                            <input type="number" value={s.stockQuantity} onChange={e => handleSizeStockChange(idx, "stockQuantity", e.target.value)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="item-table">
                            <thead>
                                <tr><th>총 수량</th><th>재고 수량</th></tr>
                            </thead>
                            <tbody>
                                {commonSizeStocks.map((s, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input type="number" value={s.totalQuantity} onChange={e => handleSizeStockChange(idx, "totalQuantity", e.target.value)} />
                                        </td>
                                        <td>
                                            <input type="number" value={s.stockQuantity} onChange={e => handleSizeStockChange(idx, "stockQuantity", e.target.value)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div style={{ textAlign: "center" }}>
                        <button type="submit" className="item-insert-btn">장비 수정</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ItemUpdateForm;