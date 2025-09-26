import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useState } from "react";
import AddCarousal from "./Carousel/AddCarousel";
import Carousels from "./Carousel/Carousels";
import AddBanner from "./AddBanner";


const Banners = () => {
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
                <BannersTable></BannersTable>
            </div>
        </div>
    )
}

export default Banners



const BannersTable = () => {
    //We will Fetch From the api and will show here
    const { banners } = useSelector((store) => store.banners)
    const [loading, setLoading] = useState(false)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Banners List</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(banners || []).map((banner) => (
                            <TableRow key={banner._id}>
                                <TableCell>
                                    <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
                                        <img
                                            className="object-cover w-full h-full"
                                            src={banner?.image?.url}
                                            alt={banner.name}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium text-gray-800">{banner.name}</p>
                                </TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <EditCategory cat={banner} />
                                    <DeleteCategory cat={banner} />
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!banners || banners.length === 0) && (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-gray-500 py-6"
                                >
                                    {loading ? "Loading categories..." : "No Banners found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )

}

