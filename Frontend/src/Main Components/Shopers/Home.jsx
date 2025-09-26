import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react'
import { useSelector } from 'react-redux';
const Home = () => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);

    return (
        <div>
            <Categories></Categories>
            <MainCarousal></MainCarousal>
            <SaleBanner></SaleBanner>
        </div>
    )


}


const Categories = () => {

    const { categories } = useSelector((store) => store.categories)

    return (
        <div className="bg-white shadow-md p-6 my-2 mx-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col items-center text-center p-3 rounded-xl border hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <img
                            src={cat?.image?.url}
                            alt={cat.name}
                            className="w-20 h-20 object-contain mb-2"
                        />
                        <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};



const MainCarousal = () => {
    return (
        <div className="relative w-full hidden xl:block">
            <Carousel
                className="w-full overflow-hidden"
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 3000, // 3 seconds
                        stopOnInteraction: false, // keep autoplay even after interaction
                    }),
                ]}
            >
                <CarouselContent>
                    <CarouselItem>
                        <img
                            src="https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/0a08b3795f997b1d.jpg?q=60"
                            alt=""
                            className="w-full h-[300px] object-cover"
                        />
                    </CarouselItem>
                    <CarouselItem>
                        <img
                            src="https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/b9e7fd4833d5cdb5.jpg?q=60"
                            alt=""
                            className="w-full h-[300px] object-cover"
                        />
                    </CarouselItem>
                    <CarouselItem>
                        <img
                            src="https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/6f5f906e42f0b8cc.jpeg?q=60"
                            alt=""
                            className="w-full h-[300px] object-cover"
                        />
                    </CarouselItem>
                    {/* Add more items */}
                </CarouselContent>

                {/* Navigation Buttons */}
                <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
            </Carousel>
        </div>
    )
}


const SaleBanner = () => {
    return (
        <div className='my-2'>
            <img src="https://rukminim1.flixcart.com/fk-p-flap/3200/460/image/c6e003e409dd71c8.jpg?q=60" alt="" />
        </div >
    )
}

export default Home