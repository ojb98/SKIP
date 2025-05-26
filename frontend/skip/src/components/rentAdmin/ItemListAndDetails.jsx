import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import '../../css/itemList.css';

const ItemListAndDetails=()=>{

    const { rentId } = useParams();
    const [items, setItems] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});  // 카테고리 코드 -> 한글명 매핑
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 체크된 상세 항목 키를 저장 (itemId_rentHour 형태)
    const [checkedDetails, setCheckedDetails] = useState(new Set());

    const navigate=useNavigate();

    //카테고리 한글명 매핑 가져오기
    const fetchCategoryMap = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/enums/itemCategory");
            const map = {};
            res.data.forEach(cat => {
                map[cat.code] = cat.label;
            });
            setCategoryMap(map);
        } catch (err) {
            console.error("카테고리 목록 불러오기 실패", err);
        }
    };

    //아이템 리스트 불러오기
    const fetchItems = () => {
        if(!rentId) rentId;

        axios.get(`http://localhost:8080/api/items/list/${rentId}`)
            .then(response => {
                setItems(response.data);
                setCheckedDetails(new Set()); //체크박스 초기화
            }) 
            .catch(error => {
                console.error("장비 목록 불러오기 실패:", error);
            });
    }

    // 데이터 불러오기
    useEffect(() => {
        fetchCategoryMap();
        fetchItems();
    }, [rentId]);


    // 선택된 카테고리에 따라 필터링
    const filteredItems = 
        selectedCategory? items.filter(item => item.category === selectedCategory) : items;


    // 체크박스 클릭시 toggle처리
    const toggleCheck = (itemId, itemDetailId) =>{
        const key=`${itemId}_${itemDetailId}`;
        setCheckedDetails(prev => {
            const newSet = new Set(prev);
            if(newSet.has(key)){
                newSet.delete(key);
            }else{
                newSet.add(key);
            }
            return newSet;
        })
    }

    // 체크박스 전체 선택/해제
    const toggleAllCheck = (itemId, detailList) => {
        setCheckedDetails(prev => {
            const newSet = new Set(prev);
            const allKeys = detailList.map(detail => `${itemId}_${detail.itemDetailId}`);
            const isAllChecked = allKeys.every(key => newSet.has(key)); // 모두 체크되어 있는지 확인

            if (isAllChecked) {
                // 모두 체크되어 있으면 해제
                allKeys.forEach(key => newSet.delete(key));
            } else {
                // 하나라도 안 되어 있으면 전체 체크
                allKeys.forEach(key => newSet.add(key));
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
        if(checkedDetails.size === 0){
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        if(!window.confirm("선택한 장비항목들을 삭제하시겠습니까?")) return;

        const payload = Array.from(checkedDetails).map(key => {
            const [itemId, itemDetailId] = key.split('_');
            return {
                itemId: Number(itemId),
                itemDetailId: Number(itemDetailId)
            };
        });

        try {
            await axios.patch("http://localhost:8080/api/items/delete", payload);
            alert("선택한 장비 항목이 삭제되었습니다.");
            fetchItems();   // 리스트 재호출

        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    }

    return(
        <div className="item-list-container">
            <h1 className="top-subject">장비 목록</h1>
            <div className="category-buttons">
                <button  className={`cetegory-selected ${selectedCategory === null ? 'active' : ''}`}
                    onClick={()=> setSelectedCategory(null)}>전체보기</button> 
                {
                    Object.entries(categoryMap).map(([code,label]) => (
                        <button key={code} className={`cetegory-selected ${selectedCategory === code ? 'active' : ''}`}
                            onClick={()=> setSelectedCategory(code)}> {label}
                        </button>
                    )
                )}
                   
            </div>

            {
                filteredItems.length === 0 ? (
                <div className="none-item">
                    <h1 className="sub-subject">등록된 장비가 없습니다.</h1>

                    <div className="move-item">
                        <Link to={`/itemAdmin/insert/${rentId}`} className="register-link">
                            장비 등록하러 가기
                        </Link>
                    </div>
                </div>
            ) : (

                filteredItems.map(item => (
                <div key={item.itemId} className="item-card">
                    <h2 className="bottom-subject2">{item.name}</h2>
                    <p>카테고리: {categoryMap[item.category]}</p>
                    <img src={`http://localhost:8080${item.image}`}  width="150" />
                    
                    <ul className="button-list">
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
                                <div className="select-div">
                                    <button onClick={() => toggleAllCheck(item.itemId, item.detailList)}
                                        className="select-all-btn">전체 선택</button>
                                </div>
                            </th>
                            <th>시간</th>
                            <th>가격</th>
                            <th>사이즈</th>
                            <th>총 수량</th>
                            <th>재고 수량</th>
                        </tr>
                    </thead>
                    <tbody className="list-tbody">
                        {(item.detailList ?? []).map((detail) => {
                            const key = `${item.itemId}_${detail.itemDetailId}`;
                            const inputId= `checkbox_${key}`;

                            return (
                                <tr key={key}>
                                    <td>
                                        <label htmlFor={inputId} className="block w-full h-full cursor-pointer">
                                        <input type="checkbox" id={inputId} checked={checkedDetails.has(key)}
                                            onChange={()=> toggleCheck(item.itemId, detail.itemDetailId)} className="cursor-pointer" />
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
        </div>
    )
}
export default ItemListAndDetails;