import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

const ProductTabs=({rentId, tab, setTab, shopName, shopPhone, shopAddress, shopDescription})=>{

  const tabList = [
    {key: "LIFT_TICKET", label: "리프트권"},
    {key: "PAGE", label: "패키지"},
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
      <div className="flex justify-center gap-14">
        <p><FontAwesomeIcon icon={faPhoneAlt} className="mr-[5px]" style={{ color: '#4072c0' }}/>{shopPhone}</p>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-[5px] text-gray-400" style={{ color: '#4072c0' }}/> {shopAddress}</p>
      </div>
      <div>
        <p className="text-center mt-2.5">{shopDescription}</p>
      </div>
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