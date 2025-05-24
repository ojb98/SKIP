import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

const ItemList=()=>{

    const { rentId } = useParams();

    const [items, setItems] = useState([]);

    // 데이터 불러오기
    useEffect(() => {
        if(!rentId) return;

        axios.get(`http://localhost:8080/api/items/list/${rentId}`)
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            console.error("장비 목록 불러오기 실패:", error);
        });
    }, [rentId]);


    return(
        <div className="item-list-container">
            <h1>장비 목록</h1>
            {
                items.length === 0 ? (
                <h1>등록된 장비가 없습니다.</h1>) : (
                items.map(item => (
                <div key={item.itemId} className="item-card">
                    <h2>{item.name}</h2>
                    <p>카테고리: {item.category}</p>
                    <img src={`http://localhost:8080${item.image}`}  width="150" />

                    <h4>상세 정보:</h4>
                    <table border="1">
                    <thead>
                        <tr>
                        <th>시간(시간당)</th>
                        <th>가격</th>
                        <th>사이즈</th>
                        <th>총 수량</th>
                        <th>재고 수량</th>
                        </tr>
                    </thead>
                    <tbody>
                    {(item.itemDetails ?? []).map((detail, index) => (
                        <tr key={index}>
                        <td>{detail.rentHour || "-"}</td>
                        <td>{detail.price}원</td>
                        <td>{detail.size || "-"}</td>
                        <td>{detail.totalQuantity}</td>
                        <td>{detail.stockQuantity}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
                ))
            )}
        </div>
    )
}
export default ItemList;