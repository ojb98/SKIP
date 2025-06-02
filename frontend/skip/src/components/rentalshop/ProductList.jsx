import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPagedItems } from "../../api/itemApi";

const ProductList = ({ rentId, category }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const size = 10;
  const pageBlockSize = 10;

  useEffect(() => {
    fetchPagedItems(rentId, category, page, size).then((data) => {
      setItems(data.content);
      setTotalPages(data.totalPages);
    });
  }, [rentId, category, page]);

  const currentBlock = Math.floor(page / pageBlockSize);
  const startPage = currentBlock * pageBlockSize;
  const endPage = Math.min(startPage + pageBlockSize, totalPages);

  return (
    <div className="product-list">
      {items.length === 0 ? (
        <p className="text-center font-bold">등록된 아이템이 존재하지 않습니다.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.itemId} className="product-item">
                <Link to={`/rent/product/${rentId}/${item.itemId}`}>
                  <div>
                    <img
                      src={`http://localhost:8080${item.image}`}
                      className="product-img"
                      alt={item.name}
                    />
                  </div>
                  <p className="item-title">{item.name}</p>
                  <p className="item-price">{item.detailList[0].price.toLocaleString()}원</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pagelist">
            {/* 이전 블록 이동 버튼 */}
            {currentBlock > 0 && (
              <button onClick={() => setPage(startPage - 1)}>이전</button>
            )}

            {Array.from({ length: endPage - startPage }, (_, idx) => (
              <button
                key={idx}
                className={page === startPage + idx ? "active" : ""}
                onClick={() => setPage(startPage + idx)}
              >
                {startPage + idx + 1}
              </button>
            ))}

            {/* 다음 블록 이동 버튼 */}
            {endPage < totalPages && (
              <button onClick={() => setPage(endPage)}>다음</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default ProductList;