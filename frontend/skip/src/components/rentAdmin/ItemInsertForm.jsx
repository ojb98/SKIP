import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCategoryOptions from "../../hooks/useCategoryoptions";

const ItemInsertForm=()=>{

    const {rentId} = useParams();

    const [categories, setCategories]=useState([]);

    //아이템 초기값 셋팅
    const [formData, setFormData]=useState({
        rentId:rentId,
        name:"",
        category:"",
    });

    //시간/가격 셋팅
    const [timePrices, setTimePrices] = useState([
        { rentHour: "", price: "" }
    ]);

    // 사이즈/수량 셋팅
    const [commonSizeStocks, setCommonSizeStocks] = useState([
        { size: "", quantity: "" }
    ]);

    // 이미지 
    const fileRef = useRef();
    // 커스텀 훅 사용(카테고리마다 사이즈,시간대여 변환)
    const selectedOptions = useCategoryOptions(formData.category);
    
    // 카테고리 백엔드에서 값 가져오기
    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/enums/itemCategory');
                console.log("카테고리 데이터: ", response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("카테고리 불러오기 실패==>", error);
                setCategories([]);
            }
        };

        fetchCategories();
    },[]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };


    // 시간/가격 핸들러
    const handleTimePriceChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...timePrices];
        updated[index][name] = value;
        setTimePrices(updated);
    };

    const addTimePrice = () => {
        setTimePrices([...timePrices, { rentHour: "", price: "" }]);
    };

    const removeTimePrice = (idx) => {
        setTimePrices(timePrices.filter((_, i) => i !== idx));
    };

    // 사이즈/수량 핸들러
    const handleSizeStockChange = (index, field, value) => {
        const updated = [...commonSizeStocks];
        updated[index][field] = value;
        setCommonSizeStocks(updated);
    };

    const addSizeStock = () => {
        setCommonSizeStocks([...commonSizeStocks, { size: "", quantity: "" }]);
    };

    const removeSizeStock = (idx) => {
        setCommonSizeStocks(commonSizeStocks.filter((_, i) => i !== idx));
    };


    //등록
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.category) {
            alert("장비명과 카테고리를 입력하세요.");
            return;
        }

        const { category } = formData;

        // 시간/가격 검증
        if (category === "LIFT_TICKET" || category !== "PROTECTIVE_GEAR") {
            if (timePrices.some(tp => !tp.rentHour || !tp.price)) {
                alert("모든 대여 시간/가격 정보를 입력하세요.");
                return;
            }
        }

        // 사이즈/수량 검증
        if (category === "PROTECTIVE_GEAR" || category !== "LIFT_TICKET") {
            if (commonSizeStocks.some(s => !s.size || !s.quantity)) {
                alert("모든 사이즈/수량 정보를 입력하세요.");
                return;
            }
        }

        const transformedDetails = timePrices.map(tp => ({
            rentHour: tp.rentHour,
            price: tp.price,
            sizeStockList: commonSizeStocks.map(s => {
                const q = Math.max(0, parseInt(s.quantity) || 0);
                return { size: s.size, totalQuantity: q, stockQuantity: q };
            })
        }));

        //전체 DTO를 JSON 객체로 묶어서 itemRequest라는 키로 전달
        const requestDTO = {
            ...formData,
            detailList: transformedDetails,
        };

        const submitData = new FormData();

        // JSON을 Blob으로 변환해서 itemRequest라는 이름으로 추가
        submitData.append("itemRequest", new Blob(
            [JSON.stringify(requestDTO)],
            { type: "application/json" }
        ));

        // 이미지 추가
        if (fileRef.current && fileRef.current.files.length > 0) {
            submitData.append("image", fileRef.current.files[0]);
        }

        axios.post("http://localhost:8080/api/items", submitData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
            console.log("장비등록완료 ===>", resp);
            alert("장비등록 완료!");

            // 초기화
            setFormData({ rentId, name: "", category: "" });
            setTimePrices([{ rentHour: "", price: "" }]);
            setCommonSizeStocks([{ size: "", quantity: "" }]);

            if (fileRef.current) {
                fileRef.current.value = null;
            }
        })
        .catch(err => {
            console.log("장비등록 실패", err);
                alert("장비등록 실패했습니다.");
        });
    };

    return (
        <div className="form-container">
            <h1>장비 등록</h1>
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
                            <tr><th>사이즈</th><th>수량</th><th>삭제</th></tr>
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
                                        <input type="number" value={s.quantity} onChange={(e) => handleSizeStockChange(idx, "quantity", e.target.value)}/>
                                    </td>
                                    <td>
                                        <button type="button" className="delete-btn" onClick={() => removeSizeStock(idx)}>삭제</button>
                                    </td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button type="button" onClick={addSizeStock}>+ 사이즈 추가</button>
           
                    <hr/><br/>

                <button type="submit">장비 등록</button>
            </form>
        </div>
    )
}
export default ItemInsertForm;