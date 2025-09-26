import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import { useSelector } from "react-redux";
import EditCarousal from "./EditCarousel";

const Carousels = () => {
    const { carousels } = useSelector((store) => store.banners)
    return (
        <div className="flex flex-col gap-5">
            {carousels.map((c, i) => (
                <CarouselCard key={i} carousel={c} />
            ))}
        </div>
    )
}

const CarouselCard = ({ carousel }) => {
    return (
        <Card className="my-10">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{carousel?.title}</CardTitle>
                <EditCarousal carousel={carousel}></EditCarousal>
            </CardHeader>
            <CardContent>
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
                        {carousel?.images?.map((i) => (
                            <CarouselItem>
                                <img
                                    src={i?.url}
                                    alt=""
                                    className="w-full h-[300px] object-cover"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                    <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                </Carousel>
            </CardContent>
        </Card>
    )
}

export default Carousels