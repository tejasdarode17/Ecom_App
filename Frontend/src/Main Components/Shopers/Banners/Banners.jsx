import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react'
import { useSelector } from 'react-redux';

const Banners = () => {
    const { banners } = useSelector((store) => store.banners)
    const { carousels } = useSelector((store) => store.banners);
    const mainCarousel = carousels.find((c) => c?.title === "Main") || null
    const saleBanner = banners.find((b) => b.type === "sale") || null
    return (
        <div>
            {mainCarousel && <MainCarousal mainCarousel={mainCarousel}></MainCarousal>}
            {saleBanner && <SaleBanner saleBanner={saleBanner}></SaleBanner>}
        </div>
    )
}


const MainCarousal = ({ mainCarousel }) => {

    return (
        <div className="relative w-full hidden xl:block mb-2">
            <Carousel
                className="w-full overflow-hidden"
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                    }),
                ]}
            >
                <CarouselContent>

                    {
                        mainCarousel?.images?.map((image) => (
                            <CarouselItem key={image._id}>
                                <img
                                    src={image?.url}
                                    alt=""
                                    className="w-full h-[300px] object-cover"
                                />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>

                <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
            </Carousel>
        </div>
    )
}

const SaleBanner = ({ saleBanner }) => {
    return (
        <div className='my-2'>
            <a href={saleBanner?.link} >
                <img className='w-full object-contain h-50' src={saleBanner?.image?.url} alt="" />
            </a>
        </div >
    )
}

export default Banners