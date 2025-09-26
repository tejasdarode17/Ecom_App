import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";


const BannerForm = ({ initialData = {}, onSubmit, loading }) => {

    const [bannerFrom, setBannerForm] = useState({
        type: "",
        image: null,
        link: "",
        ...initialData
    })

    //cleanUP this doesnt have anything with the image selection 
    useEffect(() => {
        return () => {
            if (bannerFrom.image && typeof bannerFrom.image !== "string") {
                URL.revokeObjectURL(bannerFrom.image)
            }
        }
    }, [bannerFrom.image])


    function submitHandler(e) {
        e.preventDefault()
        onSubmit(bannerFrom, setBannerForm, initialData?._id)
    }

    return (

        <form
            className="flex flex-col gap-5"
            onSubmit={submitHandler}
        >

            <div className="flex flex-col gap-3 w-full">
                <Label className="text-sm font-medium text-muted-foreground">
                    Select where you want to display
                </Label>
                <Select className="" value={bannerFrom?.type} onValueChange={(val) => setBannerForm((prev) => ({ ...prev, type: val }))}>
                    <SelectTrigger className="flex justify-between border rounded px-3 py-2 text-sm text-left">
                        <SelectValue placeholder="Please Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fixed">Below Front Page Carousel</SelectItem>
                        <SelectItem value="sale">Some Where Else</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            <div className="flex flex-col gap-3 w-full">
                <Label className="text-sm font-medium text-muted-foreground">Link</Label>
                <Input placeholder="if you want to make banner clickable" type="text"></Input>
            </div>



            <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-muted-foreground">Select banner image</Label>
                <input
                    id="image"
                    name="image"
                    type="file"
                    className="hidden"
                    onChange={(e) => setBannerForm((prev) => ({ ...prev, image: e.target.files[0] }))}
                />
                <label htmlFor="image">
                    {
                        bannerFrom.image ? (
                            <div className="">
                                <img className="h-24 w-24 object-cover border rounded" src={typeof bannerFrom.image === "string" ? bannerFrom.image : URL.createObjectURL(bannerFrom.image)} alt="" />
                            </div>
                        ) : (
                            <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground pointer">
                                <CloudUpload />
                            </div>
                        )
                    }
                </label>
            </div>


            <div className="flex justify-center">
                <Button type="submit" variant="outline" className="w-25" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-25" /> : initialData?.id ? "Update" : "Save"}
                </Button>
            </div>

        </form>

    )
}



export default BannerForm