import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../css/custom-swiper.css';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { click, listOrderedBanner } from "../api/bannerApi";
import { Link, useNavigate } from "react-router-dom";

const host = __APP_BASE__;

const BannerSlide = () => {
    const swiperRef = useRef();
    const [playing, setPlaying] = useState(true);
    const [banners, setBanners] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        listOrderedBanner().then(res => {
            if (res.success) {
                setBanners(res.data);
                console.log(res.data);
            }
        });
    }, []);


    const toggleAutoplay = () => {
        const swiper = swiperRef.current.swiper;

        if (playing) {
            swiper.autoplay.stop();
        } else {
            swiper.autoplay.start();
        }

        setPlaying(!playing);
    };

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="w-full h-90 py-5">
                    {
                        banners?.length > 0
                        &&
                        <Swiper
                            ref={swiperRef}
                            modules={[Autoplay, Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView="auto"
                            navigation={{
                                prevEl: '.custom-prev',
                                nextEl: '.custom-next'
                            }}
                            pagination={{
                                el: '.custom-progressbar',
                                type: 'progressbar'
                            }}
                            speed={1000}
                            initialSlide={banners.length}
                            loop={true}
                            loopAdditionalSlides={2}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false
                            }}
                            className="w-full h-full !px-[15%] overflow-visible"
                        >
                            {
                                banners?.map((banner, index) => {(
                                    console.log(banner.image);
                                    <SwiperSlide
                                        key={index}
                                        className="!w-[50%] rounded-2xl"
                                    >
                                        <Link
                                            to={`/rent/detail/${banner.rentId}`}
                                            onClick={() => click(banner.bannerId)}
                                        >
                                            <img
                                                src={host + '/images' +  banner.bannerImage}
                                                className="rounded-2xl w-full h-full object-cover cursor-pointer"
                                            ></img>
                                        </Link>
                                    </SwiperSlide>
                                )})
                            }
                        </Swiper>
                    }
                </div>

                <div className="w-[1150px] flex items-center gap-5">
                    <div className="custom-progressbar w-full !h-0.5 !bg-gray-200"></div>

                    <div>
                        <div className="flex gap-2">
                            <div className="flex">
                                <button
                                    className="custom-prev w-12 h-10 flex justify-center items-center rounded-tl-2xl rounded-bl-2xl shadow-md cursor-pointer hover:bg-gray-50"
                                >
                                    <ChevronLeft></ChevronLeft>
                                </button>

                                <button
                                    className="custom-next w-12 h-10 flex justify-center items-center rounded-tr-2xl rounded-br-2xl shadow-md cursor-pointer hover:bg-gray-50"
                                >
                                    <ChevronRight></ChevronRight>
                                </button>
                            </div>

                            <button
                                className="w-10 h-10 flex justify-center items-center rounded-full shadow-md cursor-pointer hover:bg-gray-50"
                                onClick={toggleAutoplay}
                            >
                                {
                                    playing
                                    &&
                                    <Pause></Pause>
                                    ||
                                    <Play></Play>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default BannerSlide;