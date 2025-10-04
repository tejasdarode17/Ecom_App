import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useSelector } from "react-redux";
import DeleteBanner from "./DeleteBanner";


const FixedBanners = () => {
    const { banners } = useSelector((store) => store.banners)

    return (
        <div className="flex flex-col gap-5">
            {banners.map((banner, i) => (
                <FixedBannersCard key={i} banner={banner} />
            ))}
        </div>
    )
}

const FixedBannersCard = ({ banner }) => {
    console.log(banner);

    return (
        <Card className="my-10">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{banner?.type}</CardTitle>
                <DeleteBanner banner={banner}></DeleteBanner>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <img className="w-full h-70 object-contain" src={banner?.image?.url} alt="" />
                </div>
            </CardContent>
        </Card>
    )
}


export default FixedBanners