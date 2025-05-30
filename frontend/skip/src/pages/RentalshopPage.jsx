import Slide from "../components/rentalshop/Slide";
import ProductTabs from "../components/rentalshop/ProductTabs";
import { useParams } from "react-router-dom";

const RentalshopPage=()=>{
  const { rentId } = useParams(); // URL에서 rentId 받아오기

  return(
    <main className="w-[1000px]">
      <Slide rentId={rentId}/>
      <ProductTabs rentId={rentId}/>
    </main>
  )
}
export default RentalshopPage;