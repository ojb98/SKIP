import { Link } from "react-router-dom";

const ProductList=({items})=>{
  return(
    <div className="product-list">
      <ul>
        {items.map((item) => (
          <li key={item.id} className="product-item">
            <Link to={`/rent/product/:rentId/:itemId`}>
              <div>
                <img
                  src={item.img}
                  className="product-img"
                />
              </div>
              <p className="item-title">{item.name}</p>
              <p className="item-price">{item.price.toLocaleString()}원</p>
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <div className="pagelist">
          <a href="#none">이전</a>
          <a href="#none" className="active">1</a>
          <a href="#none">2</a>
          <a href="#none">다음</a>
        </div>
      </div>
    </div>
  )
}
export default ProductList;