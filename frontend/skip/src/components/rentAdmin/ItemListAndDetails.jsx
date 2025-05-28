import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import '../../css/itemList.css';
import useCategoryOptions from "../../hooks/useCategoryoptions";

const ItemListAndDetails=()=>{

    const { rentId } = useParams();
    const [items, setItems] = useState([]);  //서버에서 불러온 장비
    const [categoryMap, setCategoryMap] = useState({});  // 카테고리 코드 -> 한글명 매핑
    const [selectedCategory, setSelectedCategory] = useState(null);  //현재 선택된 카테고리 (필터용)

    // 체크된 상세 항목 키를 저장 (itemId_rentHour 형태)
    const [checkedDetails, setCheckedDetails] = useState(new Set());  //Set형식 객체 (중복없이 저장)

    //다른 페이지로 이동할 때 사용 (수정)
    const navigate=useNavigate();

    // 모달 관련 상태 관리용
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItemId, setModalItemId] = useState(null);
    const [modalItemCategory, setModalItemCategory] = useState(null);
    // 카테고리별로 제공되는 사이즈, 시간 옵션을 불러오는 커스텀 훅.
    const { sizes, hours } = useCategoryOptions(modalItemCategory); 

    // 사용자가 추가할 시간/가격 옵션.
    const [newOptions, setNewOptions] = useState([
        { rentHour: '', price: '' }
    ]);

    // 사이즈별 재고 입력 상태
    const [sizeStockInputs, setSizeStockInputs] = useState({});


    // 사이즈/재고 입력 변경 핸들러
    const handleSizeStockChange = (size, field, value) => {
        setSizeStockInputs(prev => ({
            ...prev,
            [size]: {
                ...prev[size],
                [field]: value
            }
        }));
    };


    //카테고리 한글명 매핑 가져오기
    const fetchCategoryMap = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/enums/itemCategory");
            const map = {};  //빈 객체 만들기
            console.log("category불러오기===>",res);
            res.data.forEach(cat => {
                //{ "SKI": "스키", "BOARD": "보드" } 객체형식으로 저장
                map[cat.code] = cat.label;
            });
            setCategoryMap(map);  //categoryMap에 저장
        } catch (err) {
            console.error("카테고리 목록 불러오기 실패", err);
        }
    };

    //아이템 리스트 불러오기
    const fetchItems = () => {
        if(!rentId) return;  // rentId 없으면 함수 실행 안 함

        // rentId에 해당하는 장비 리스트를 요청
        axios.get(`http://localhost:8080/api/items/list/${rentId}`)
            .then(response => {
                setItems(response.data);   // 받아온 데이터를 상태로 저장
                setCheckedDetails(new Set());  // 체크박스 선택 상태도 초기화 (비우기)
            }) 
            .catch(error => {
                console.error("장비 목록 불러오기 실패:", error);
            });
    }

    // rentId가 변화할때마다 데이터 불러오기
    useEffect(() => {
        fetchCategoryMap();
        fetchItems();
    }, [rentId]);


    // 선택된 카테고리에 따라 필터링
    const filteredItems = 
        // selectedCategory? 사용자가 선택한 카테고리 상태
        // items.filter(item => item.category === selectedCategory) : 해당 카테고리와 일치하는 장비만 보여주기
        // 만약 선택된 카테고리가 없으면 (null) : 전체 장비 리스트
        selectedCategory? items.filter(item => item.category === selectedCategory) : items;

    console.log("filteredItems ====> ",filteredItems);

    // (item.detailList ?? []) 과 같은 방식
    // const detailList = item.detailList !== null && item.detailList !== undefined? item.detailList: [];


    // 개별 체크박스 클릭시 toggle처리
    const toggleCheck = (itemId, itemDetailId) =>{
        const key=`${itemId}_${itemDetailId}`;
        console.log("개별 체크 클릭됨 → key:", key);

        setCheckedDetails(prev => {
            console.log("개별 체크박스 prev===>",prev)

            const newSet = new Set(prev);  // 이전 상태를 복사(새 Set 생성)
            if(newSet.has(key)){
                newSet.delete(key); // 이미 체크되어 있으면 해제(삭제)
            }else{
                newSet.add(key); // 체크 안되어 있으면 추가
            }
            return newSet;
        })
    }

    // 체크박스 전체 선택/해제
    const toggleAllCheck = (itemId, detailList) => {
        console.log("전체 체크 클릭됨 → itemId:", itemId, "detailList:", detailList);

        setCheckedDetails(prev => {
            const newSet = new Set(prev); // 이전 상태를 복사(새 Set 생성)
            // 해당 장비의 모든 상세 항목을 체크박스용 고유 키로 변환 (체크박스 추적용)
            const allKeys = detailList.map(detail => `${itemId}_${detail.itemDetailId}`);
            // every()를 통해 모든 항목이 체크되어 있는지를 확인
            const isAllChecked = allKeys.every(key => newSet.has(key)); //모두체크:true ,하나라도 안되어있다면:false

            if (isAllChecked) {
                // 모두 체크되어 있으면 해제
                allKeys.forEach(key => newSet.delete(key));   //Set메소드 - delete() : 삭제
            } else {
                // 하나라도 안 되어 있으면 전체 체크
                allKeys.forEach(key => newSet.add(key));   //Set메소드 - add() : 추가
            }

            return newSet;
        })
    }

    //수정 폼으로 이동
    const goToUpdate = (itemId) => {
        navigate(`/itemAdmin/update/${rentId}/${itemId}`);
    };


    // 선택한 항목 삭제 처리
    const deleteSelectedDetails= async()=>{
        if(checkedDetails.size === 0){  // 체크된 항목이 없으면 경고창 띄우고 중단
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        if(!window.confirm("선택한 장비항목들을 삭제하시겠습니까?")) return;  //정말 삭제할 것인지 확인 요청

        // checkedDetails는 Set 객체 (예: Set { "1_101", "1_102" })
        //Array.from(...)은 Set을 배열로 변환
        const payload = Array.from(checkedDetails).map(key => {
            const [itemId, itemDetailId] = key.split('_');  //key 문자열을 _제외하고 객체로 변환
            return {
                // [{ itemId: 1, itemDetailId: 101 },{ itemId: 1, itemDetailId: 102 }] 형식으로 저장
                itemId: Number(itemId),
                itemDetailId: Number(itemDetailId)
            };
        });

        try {
            // payload : 서버에 보낼 삭제 요청 데이터를 배열 보냄
            await axios.patch("http://localhost:8080/api/items/delete", payload);
            alert("선택한 장비 항목이 삭제되었습니다.");
            fetchItems();   // 리스트 재호출

        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    }


    //모달 제어

    // 모달 열기
    const openModal = (itemId, category) => {
        setModalItemId(itemId);
        setModalItemCategory(category);
        setNewOptions([{ rentHour: '', price: '' }]);
        setSizeStockInputs({});
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setModalItemId(null);
        setModalItemCategory(null);
    };

    // 옵션 추가
    const addEmptyTimePriceOption = () => {
        const base = newOptions[0];
        if (!base.rentHour || !base.price) {
            alert("시간과 가격을 입력해주세요.");
            return;
        }
    setNewOptions(prev => {
        // 새 옵션 추가
        const newList = [...prev, { rentHour: base.rentHour, price: base.price }];
        // 첫 번째 입력폼 초기화
        newList[0] = { rentHour: '', price: '' };
        return newList;
    });
};
    


    // 옵션 변경 핸들러
    const handleOptionChange = (index, field, value) => {
        setNewOptions(prev => {
        const copy = [...prev];
        copy[index][field] = value;
        return copy;
        });
    };

    // 옵션 삭제
    const removeOption = (index) => {
        setNewOptions(prev => prev.filter((_, i) => i !== index));
    };


    // 저장
    const handleFinalSave = async () => {
        for (const option of newOptions) {
            if (!option.rentHour || !option.price) {
                alert("모든 시간/가격 조합을 확인해주세요.");
                return;
            }
        }

        const sizeStocks = Object.entries(sizeStockInputs)
            .filter(([size]) => size !== 'selectedSize')  // selectedSize 제외
            .map(([size, stock]) => ({
                size,
                totalQuantity: Number(stock.totalQuantity || 0),
                stockQuantity: Number(stock.stockQuantity || 0),
            }));

        try {
        for (const option of newOptions) {
            await axios.post(`http://localhost:8080/api/items/optionAdd/${modalItemId}`, {
            rentHour: Number(option.rentHour),
            price: Number(option.price),
            sizeStocks,
            });
        }
        alert("옵션이 저장되었습니다.");
        closeModal();
        fetchItems();
        } catch (error) {
        console.error("옵션 저장 실패:", error);
        alert("옵션 저장 중 오류가 발생했습니다.");
        }
    };


    return(
        <div className="item-list-container">
            <h1 className="top-subject">장비 목록</h1>
            <div className="category-buttons">
                <button  className={`category-selected ${selectedCategory === null ? 'active' : ''}`}
                    onClick={()=> setSelectedCategory(null)}>전체보기</button> 
                {
                    // Object.entries : 객체형식을 배열식으로 변환
                    // 객체는 직접 .map()을 못 써서 Object.entries()로 배열로 바꾼 뒤 .map()을 사용
                    //[code,label] : 구조분해 할당 => code = "SKI", label = "스키"
                    Object.entries(categoryMap).map(([code,label]) => (
                        <button key={code} className={`category-selected ${selectedCategory === code ? 'active' : ''}`}
                            onClick={()=> setSelectedCategory(code)}> {label}
                        </button>
                    )
                )}
                   
            </div>

            {
                // 필터링된 항목이 없다면
                filteredItems.length === 0 ? (
                    <h1 className="sub-subject">등록된 장비가 없습니다.</h1>
                ) : (

                filteredItems.map(item => (
                    
                <div key={item.itemId} className="item-card">
                    <h2 className="bottom-subject2">{item.name}</h2>
                    {/* 카테고리 한글명 (categoryMap[item.category]로 변환) */}
                    <p>카테고리: {categoryMap[item.category]}</p>
                    <img src={`http://localhost:8080${item.image}`}  width="150" />
                    
                    <ul className="button-list">
                        <li>
                            {/* 옵션 추가 버튼 */}
                            <button className="add-option-btn" onClick={() => openModal(item.itemId,item.category)}>옵션 추가</button>
                        </li>

                        <li>
                            {/* 수정버튼 */}
                            <button className="update-btn" onClick={() => goToUpdate(item.itemId)}>수정</button>
                        </li>
                        <li>
                            {/* 삭제버튼 */}
                            <button className="delete-btn" onClick={deleteSelectedDetails} >선택 항목 삭제</button>
                        </li>
                    </ul>

                    <h4 className="bottom-subject4">상세 정보:</h4>
                    <table border="1" className="table-list">
                    <thead className="list-thead">
                        <tr>
                            <th>
                                {/* 전체 선택 버튼 */}
                                <button onClick={() => toggleAllCheck(item.itemId, item.detailList)} className="select-all-btn" type="button">
                                    전체 선택
                                </button>
                            </th>
                            <th>시간</th>
                            <th>가격</th>
                            <th>사이즈</th>
                            <th>총 수량</th>
                            <th>재고 수량</th>
                        </tr>
                    </thead>
                    <tbody className="list-tbody">

                        {
                            // (item.detailList ?? []) : item.detailList가 null이나 undefined인 경우 → []로 대체해서 map() 사용(null error 방지)
                            // 그렇지 않으면 → 원래의 item.detailList를 사용
                            // 아이템 상세 목록을 표로 그리되, 항목이 없어도 에러 없이 처리하는 안전한 렌더링 방식
                            (item.detailList ?? []).map((detail) => {  // detail : 시간·가격·사이즈·재고

                            console.log("detail객체===>", detail);
                            const key = `${item.itemId}_${detail.itemDetailId}`;
                            const inputId= `checkbox_${key}`;

                            return (
                                <tr key={key}>                            
                                    <td>
                                        <label htmlFor={inputId} className="block w-full h-full cursor-pointer">
                                            {/* checkedDetails.has(key) : 해당 값이 Set에 존재하는지 확인하는 메서드(true,false 반환) 
                                                checked = { 현재 key가 Set에 들어 있으면 체크된 상태로 보여줌 }
                                            */}
                                            {/* 선택 버튼 */}
                                            <input type="checkbox" id={inputId} checked={checkedDetails.has(key)}
                                                onChange={() => {
                                                    toggleCheck(item.itemId, detail.itemDetailId)}
                                                } className="cursor-pointer"/>
                                        </label>
                                    </td>
                                    <td>{detail.rentHour}시간</td>
                                    <td>{detail.price}원</td>
                                    <td>{detail.size}</td>
                                    <td>{detail.totalQuantity}</td>
                                    <td>{detail.stockQuantity}</td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                    </table>
                </div>
                ))
            )}
            <div className="move-item">
                <Link to={`/itemAdmin/insert/${rentId}`} className="register-link">
                    장비 추가하러 가기
                </Link>
            </div>

            {/* 옵션 추가 모달 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-subject">옵션 추가</h2>
                        <div className="model-size-group">
                            <select value={newOptions[0].rentHour} onChange={e => handleOptionChange(0, 'rentHour', e.target.value)}>
                                <option value="">시간 선택</option>
                                {
                                    Array.isArray(hours) && hours.map(hour => (
                                        <option key={hour} value={hour}>{hour}시간</option>
                                    ))
                                }
                            </select>
                            <input type="number" placeholder="가격 (숫자만 입력)" value={newOptions[0].price} onChange={e => handleOptionChange(0, 'price', e.target.value)}/>
                            <button type="button" onClick={addEmptyTimePriceOption} className="modal-add-btn">추가</button>
                        </div>

                        <div className="model-add-group">
                        {newOptions.length > 1 && ( 
                            <div>
                                <h4>추가된 시간/가격</h4>
                                <ul>
                                {newOptions.slice(1).map((opt, idx) => (
                                    <li key={idx}>
                                        {opt.rentHour}시간 - {opt.price}원
                                        <button onClick={() => removeOption(idx + 1)} className="modal-del-btn">삭제</button>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        )}
                        </div>

                        <table className="model-size-table">
                            <thead className="model-thead">
                                <tr>
                                    <th>사이즈</th><th>총 수량</th><th>재고 수량</th>
                                </tr>
                            </thead>
                            <tbody className="model-tbody">
                                <tr>
                                    <td>
                                        <select value={sizeStockInputs.selectedSize || ''}
                                            onChange={e => {const selectedSize = e.target.value;
                                                // 사이즈 선택 시 선택된 사이즈만 상태에 저장
                                                setSizeStockInputs(prev => ({
                                                    selectedSize,
                                                    [selectedSize]: prev[selectedSize] || { totalQuantity: '', stockQuantity: '' },
                                                }));
                                            }}>
                                                <option value="">사이즈 선택</option>
                                                {sizes.map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" placeholder="숫자만 입력"
                                            value={sizeStockInputs[sizeStockInputs.selectedSize]?.totalQuantity || ''}
                                            onChange={e => handleSizeStockChange(sizeStockInputs.selectedSize, 'totalQuantity', e.target.value)}
                                            disabled={!sizeStockInputs.selectedSize} // 사이즈 선택 전 비활성화
                                        />
                                    </td>
                                    <td>
                                        <input type="number" placeholder="숫자만 입력"
                                            value={sizeStockInputs[sizeStockInputs.selectedSize]?.stockQuantity || ''}
                                            onChange={e => handleSizeStockChange(sizeStockInputs.selectedSize, 'stockQuantity', e.target.value)}
                                            disabled={!sizeStockInputs.selectedSize} // 사이즈 선택 전 비활성화
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="modal-actions">
                            <button type="button" onClick={handleFinalSave} className="option-save-btn">옵션 저장</button>
                            <button type="button" onClick={closeModal} className="option-cancel-btn">취소</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};
export default ItemListAndDetails;