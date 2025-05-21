import { useState } from "react";
import ProductList from "./ProductList";

const productData = {
  lift: [
    { id: 1, name: "리프트 1일권", price: 40000, img: "/images/1.png" },
    { id: 2, name: "리프트 2일권", price: 75000, img: "/images/2.png" },
    { id: 11, name: "리프트 1일권", price: 40000, img: "/images/1.png" },
    { id: 12, name: "리프트 2일권", price: 75000, img: "/images/2.png" },
    { id: 13, name: "리프트 1일권", price: 40000, img: "/images/1.png" },
    { id: 14, name: "리프트 2일권", price: 75000, img: "/images/2.png" },
    { id: 15, name: "리프트 1일권", price: 40000, img: "/images/1.png" },
    { id: 16, name: "리프트 2일권", price: 75000, img: "/images/2.png" },
    { id: 17, name: "리프트 1일권", price: 40000, img: "/images/1.png" },
    { id: 18, name: "리프트 2일권", price: 75000, img: "/images/2.png" },
  ],
  ski: [
    { id: 3, name: "스키 세트", price: 60000, img: "/images/3.png" },
    { id: 4, name: "스키 부츠", price: 20000, img: "/images/4.png" },
  ],
  board: [
    { id: 5, name: "보드 세트", price: 65000, img: "/images/5.png" },
    { id: 6, name: "보드 부츠", price: 25000, img: "/images/6.png" },
  ],
  ppe: [
    { id: 7, name: "헬멧", price: 10000, img: "/images/7.png" },
    { id: 8, name: "고글", price: 8000, img: "/images/8.png" },
  ],
  clo: [
    { id: 9, name: "스키복 상의", price: 15000, img: "/images/9.png" },
    { id: 10, name: "스키복 하의", price: 15000, img: "/images/10.png" },
  ],
};

const ProductTabs=()=>{
  const [tab,setTab] = useState('lift');

  const tabList = [
    {key: "lift", label: "리프트권"},
    {key: "ski", label: "스키"},
    {key: "board", label: "보드"},
    {key: "ppe", label: "보호장비"},
    {key: "clo", label: "의류"},
  ];

  return(
    <div>
      <h2 className="h2-title">렌탈샵명</h2>
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
      <ProductList items={productData[tab]} />
    </div>
  )
}
export default ProductTabs;