import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

const CarouselForm = ({ initialData = {}, onSubmit, loading }) => {
    const [carouselType, setCarouselType] = useState("");
    const [carouselImages, setCarouselImages] = useState([]);

    const id = initialData?._id;
    console.log(id);


    useEffect(() => {
        if (initialData?.title) setCarouselType(initialData?.title);
        if (initialData?.images) setCarouselImages(initialData?.images);
    }, [initialData]);

    //this function is storing files one by one in an array which is createe by this Array.from method 
    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        setCarouselImages((prev) => [...prev, ...files]);
    }

    function sumitHandler(e) {
        e.preventDefault();
        onSubmit(carouselType, carouselImages, id);
    }

    return (
        <div>
            <form className="flex flex-col gap-5" onSubmit={sumitHandler}>
                {/* Select carousel type */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-muted-foreground">
                        Select where you want to display
                    </label>
                    <Select value={carouselType} onValueChange={setCarouselType}>
                        <SelectTrigger className="flex justify-between border rounded px-3 py-2 text-sm text-left">
                            <SelectValue placeholder="Please Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Main">Main</SelectItem>
                            <SelectItem value="Category">Category</SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                {/* Image input + previews */}
                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Select images in order you want to show in carousel</Label>
                    <Input
                        id="image"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-wrap gap-3">

                        {carouselImages.length > 0 ? (
                            carouselImages.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="h-24 w-24 border rounded overflow-hidden relative group"
                                >
                                    <img
                                        src={file.url ? file.url : URL.createObjectURL(file)}
                                        alt={`carousel-${idx}`}
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCarouselImages(carouselImages.filter((_, index) => index !== idx))
                                        }
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <label
                                htmlFor="image"
                                className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground cursor-pointer"
                            >
                                <CloudUpload className="h-6 w-6" />
                            </label>
                        )}

                        <label
                            htmlFor="image"
                            className={`h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground cursor-pointer ${carouselImages.length > 0 ? "flex" : "hidden"
                                }`}
                        >
                            <div className="flex flex-col justify-center items-center">
                                <CloudUpload className="h-6 w-6" />
                                Add More
                            </div>
                        </label>
                    </div>
                </div>

                <Button type="submit" variant="outline" disabled={loading}>
                    {loading ? "Saving..." : "Save Carousel"}
                </Button>
            </form>
        </div>
    );
};

export default CarouselForm;
