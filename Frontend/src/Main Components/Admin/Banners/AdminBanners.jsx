import AddCarousal from "./Carousel/AddCarousel";
import Carousels from "./Carousel/Carousels";
import AddBanner from "./Fixed Banner/AddBanner";
import FixedBanners from "./Fixed Banner/FixedBanners";


const AdminBanners = () => {
    return (
        <div>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Banner Management</h1>
                <div className="flex gap-3">
                    <AddCarousal></AddCarousal>
                    <AddBanner></AddBanner>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                <Carousels></Carousels>
                <FixedBanners></FixedBanners>
            </div>
        </div>
    )
}

export default AdminBanners



