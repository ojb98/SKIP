import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPagedItems } from "../../api/itemApi";
import Pagination from "../pagination";

const ProductList = ({ rentId, category }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const size = 10;

  useEffect(() => {
    fetchPagedItems(rentId, category, page).then((data) => {
      setItems(data.content);
      setTotalPages(data.totalPages);
    });
  }, [rentId, category, page]);

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
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            size={5}
          />
        </>
      )}
    </div>
  )
}
export default ProductList;