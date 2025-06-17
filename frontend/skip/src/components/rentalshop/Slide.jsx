import { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from "axios";

const slide=({ images })=>{


  return(
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      spaceBetween={10}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      autoplay={{delay:3000}}
      loop = {images.length > 1}
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <img 
            src={`http://localhost:8080${img}`}
            alt={`slide-${idx}`}
            style={{ width: "100%", height: "300px", objectFit: "cover"}}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
export default slide;