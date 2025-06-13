import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCategoryOptions from "../../hooks/useCategoryOptions";
import '../../css/itemInsertForm.css';

const ItemInsertForm=()=>{

    const {rentId} = useParams();

    const [categories, setCategories]=useState([]);

    //장비 기본 초기값 셋팅
    const [formData, setFormData]=useState({
        rentId:rentId,
        name:"",
        category:"",
    });

    // 장비 대여 시간 및 가격 정보 셋팅 (복수 입력 가능)
    const [timePrices, setTimePrices] = useState([
        { rentHour: "", price: "" }
    ]);

    // 장비 사이즈 및 수량 정보 셋팅(복수 입력 가능)
    const [commonSizeStocks, setCommonSizeStocks] = useState([
        { size: "", quantity: "" }
    ]);

    // 사용자가 업로드한 이미지파일 읽기 위함 
    const fileRef = useRef();

    // 커스텀 훅 사용(카테고리마다 사이즈,시간대여 변환)
    const selectedOptions = useCategoryOptions(formData.category);
    
    // 처음 렌더링될 때 카테고리 백엔드에서 값 가져오기
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
        updated[index][field] = value;  // 예시) updated[1]["size"] = "XL";
        setCommonSizeStocks(updated);
    };

    const addSizeStock = () => {
        setCommonSizeStocks([...commonSizeStocks, { size: "", quantity: "" }]);
    };

    const removeSizeStock = (idx) => {
        // filter 조건을 만족하는 요소만 남기는 배열 메서드
        // 선택했을때 선택한 인덱스번호와 일치하지 않는거만 보여주기(같은 인덱스번호는 안보임)
        setCommonSizeStocks(commonSizeStocks.filter((_, i) => i !== idx)); 
    };


    //등록
    const handleSubmit = (e) => {
        e.preventDefault();

        // 장비명과 카테고리 검증
        if (!formData.name || !formData.category) {
            alert("장비명과 카테고리를 입력하세요.");
            return;
        }

        //ref값 얻어오기
        const imageInput = fileRef.current;

        // 이미지 검증
        if (!imageInput || imageInput.files.length === 0) {
            alert("이미지는 필수입니다.");
            return;
        }

        const { category } = formData;

        // 시간/가격 검증
        // some() : 배열 안의 요소 중 하나라도 조건을 만족하면 true를 반환
        if (timePrices.some(tp => !tp.rentHour || !tp.price)) {
            alert("모든 대여 시간/가격 정보를 입력하세요.");
            return;
        }
        

        // 사이즈/수량 검증
        if (category !== "LIFT_TICKET") {
            // some() : 배열 안의 요소 중 하나라도 조건을 만족하면 true를 반환
            if (commonSizeStocks.some(s => !s.size || !s.quantity)) {
                alert("모든 사이즈/수량 정보를 입력하세요.");
                return;
            }
        }

        //timePrices 배열을 순회하면서 각 시간/가격 객체를 생성
        const transformedDetails = timePrices.map(tp => ({
            rentHour: tp.rentHour,
            price: tp.price,

            //sizeStockList : 백엔드 DTO 필드명과 반드시 일치
            //commonSizeStocks 배열을 순회하면서 각 사이즈/수량 객체를 생성
            sizeStockList: commonSizeStocks.map(s => {
            const q = Math.max(0, parseInt(s.quantity) || 0); 
                return {
                    size: s.size,
                    totalQuantity: q,
                    stockQuantity: q
                };
            })
        }));

        //requestDTO 객체 만들기
        // 이 전체 구조가 백엔드의 ItemRequestDTO와 일치
        const requestDTO = {
            ...formData,
            //detailList는 시간/가격 + 사이즈/재고를 묶은 구조.
            detailList: transformedDetails,
        };

        // FormData는 파일 업로드가 포함된 multipart/form-data 전송을 위해 사용
        // 텍스트 + 파일을 한 번에 보낼 수 있는 특수한 객체
        const submitData = new FormData();


        // 전체 DTO를 JSON 객체로 묶어서 itemRequest라는 키로 전달
        // Blob : 파일처럼 다루는 JSON 데이터 (파일이나 이진 데이터를 나타내는 객체)
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
            <h1 className="top-subject">장비 등록</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="rentId" value={formData.rentId} />


                <div className="item-group">
                    <div className="form-group">
                        <label htmlFor="category">*카테고리</label>
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
                        <label htmlFor="name">*장비명</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} placeholder="일반의류 or 고급의류" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">*이미지</label>
                        <input type="file" id="image" name="image" ref={fileRef} accept="image/*" />
                    </div>
                </div>


                <h2 className="sub-subject">대여 옵션</h2>
                <div className="time-group">
                    {
                        timePrices.map((tp, idx) => (
                        <div key={idx}>
                            <div className="form-inline-row">
                                <label htmlFor="rentHour">시간</label>
                                <select name="rentHour" value={tp.rentHour} onChange={(e) => handleTimePriceChange(idx, e)}>
                                <option value="">시간 선택</option>
                                {
                                    selectedOptions.hours.map(hour => (
                                        <option key={hour} value={hour}>
                                            {hour === 8760 ? "1년" : `${hour}시간`}
                                        </option>
                                    ))
                                }
                                </select>
                                <label htmlFor="price">가격</label>
                                <input type="number" name="price" value={tp.price} onChange={(e) => handleTimePriceChange(idx, e)} placeholder="가격"/>
                                <button type="button" className="delete-btn" onClick={() => removeTimePrice(idx)}>시간 삭제</button>
                            </div>
                        </div>
                        ))
                    }
                </div>
                    <div className="add-group">
                        <button type="button" onClick={addTimePrice} className="add-btn">+ 시간 추가</button>
                    </div>
                    

                    <hr/><br/>

                    <h2 className="sub-subject">사이즈 / 수량</h2>
                    <table className="item-table">
                        <thead className="item-thead">
                            <tr><th>사이즈</th><th>수량</th><th>삭제</th></tr>
                        </thead>
                        <tbody className="item-tbody">
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
                                        <input type="number" value={s.quantity} onChange={(e) => handleSizeStockChange(idx, "quantity", e.target.value)} required/>
                                    </td>
                                    <td>
                                        <button type="button" className="delete-btn" onClick={() => removeSizeStock(idx)}>삭제</button>
                                    </td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="add-group">
                        <button type="button" onClick={addSizeStock} className="size-add-btn">+ 사이즈 추가</button>
                    </div>
                
                    <hr/><br/>

                <button type="submit" className="add-btn">장비 등록</button>
            </form>
        </div>
    )
}
export default ItemInsertForm;