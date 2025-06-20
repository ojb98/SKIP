import Slide from "../components/rentalshop/Slide";
import ProductTabs from "../components/rentalshop/ProductTabs";
import { rentSlideApi } from "../api/rentListApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RentalshopPage=()=>{
  const { rentId } = useParams(); // URL에서 rentId 받아오기

  const[images, setImages] = useState([]);
  const[shopName, setShopName] = useState("");
  const[shopPhone, setShopPhone] = useState("");
  const[shopAddress, setShopAddress] = useState("");
  const[shopDescription, setShopDescription] = useState("");
  const[tab, setTab] = useState("LIFT_TICKET");

  useEffect(() => {
    rentSlideApi(rentId).then(res => {
      const { image1, image2, image3 } = res;
      const imageList = [ image1, image2, image3].filter(Boolean);
      setImages(imageList);
      setShopName(res.name);
      setShopPhone(res.phone);
      setShopAddress(res.streetAddress);
      setShopDescription(res.description);
    });
  }, [rentId]);

  return(
    <main className="w-[1000px]">
      <Slide images={images}/>
      <ProductTabs rentId={rentId} tab={tab} setTab={setTab} shopName={shopName} shopPhone={shopPhone} shopAddress={shopAddress} shopDescription={shopDescription}/>
    </main>
  )
}
export default RentalshopPage;