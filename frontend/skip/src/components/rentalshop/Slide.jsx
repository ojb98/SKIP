import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slide=()=>{
  return(
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      // autoplay={{delay:3000}} //오토플레이
      loop
    >
      <SwiperSlide>
        <div style={{ background: '#ddd', height: '300px' }}>Slide 1</div>
      </SwiperSlide>
      <SwiperSlide>
        <div style={{ background: '#ddd', height: '300px' }}>Slide 2</div>
      </SwiperSlide>
      <SwiperSlide>
        <div style={{ background: '#ccc', height: '300px' }}>Slide 3</div>
      </SwiperSlide>
    </Swiper>
  )
}
export default slide;