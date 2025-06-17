import Slide from "../components/rentalshop/Slide";
import ProductTabs from "../components/rentalshop/ProductTabs";
import { rentSlideApi } from "../api/rentListApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RentalshopPage=()=>{
  const { rentId } = useParams(); // URL에서 rentId 받아오기

  const[images, setImages] = useState([]);
  const[shopName, setShopName] = useState("");
  const[tab, setTab] = useState("LIFT_TICKET");

  useEffect(() => {
    rentSlideApi(rentId).then(res => {
      const { thumbnail, image1, image2, image3 } = res;
      const imageList = [thumbnail, image1, image2, image3].filter(Boolean);
      setImages(imageList);
      setShopName(res.name);
    });
  }, [rentId]);
  

  return(
    <main className="w-[1000px]">
      <Slide images={images}/>
      <ProductTabs rentId={rentId} tab={tab} setTab={setTab} shopName={shopName}/>
    </main>
  )
}
export default RentalshopPage;