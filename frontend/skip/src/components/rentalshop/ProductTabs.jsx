import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import axios from "axios";

const ProductTabs=({rentId})=>{
  const [shopName, setShopName] = useState("");
  const [tab,setTab] = useState("LIFT_TICKET");

  useEffect(() => {
    axios.get(`/api/rents/${rentId}`).then(res => {
      setShopName(res.data.name);
    });
  }, [rentId]);

  const tabList = [
    {key: "LIFT_TICKET", label: "리프트권"},
    {key: "SKI", label: "스키"},
    {key: "SNOWBOARD", label: "보드"},
    {key: "PROTECTIVE_GEAR", label: "보호장비"},
    {key: "TOP", label: "상의"},
    {key: "BOTTOM", label: "하의"},
    {key: "BOOTS", label: "신발"}
  ];

  return(
    <div>
      <h2 className="h2-title">{shopName}</h2>
      <div className="tab-menu">
        {tabList.map((item)=>(
          <button 
            key={item.key}
            className={`tab-btn ${tab === item.key ? "active" : ""}`}
            onClick={()=>setTab(item.key)}
            >
              {item.label}
            </button>
        ))
        }
      </div>
      <ProductList rentId={rentId} category={tab} />
    </div>
  )
}
export default ProductTabs;