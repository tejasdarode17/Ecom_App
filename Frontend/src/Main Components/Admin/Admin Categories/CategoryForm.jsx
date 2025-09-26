import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


const CategoryForm = ({ initialData = {}, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
        ...initialData,
    })

    const id = initialData._id

    function handleChange(e) {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }))
        }
    }

    useEffect(() => {
        return () => {
            if (formData.image && typeof formData.image !== "string") {
                URL.revokeObjectURL(formData.image)
            }
        }
    }, [formData.image])

    function submitHandler(e) {
        e.preventDefault()
        onSubmit(formData, setFormData, id)
    }

    return (
        <form onSubmit={submitHandler} className="grid gap-6">

            <div className="flex flex-col gap-2">
                <Label>Category Name</Label>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter category description"
                />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
                <Label>Category Image</Label>
                <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="category-image"
                    onChange={handleImageChange}
                />
                <label htmlFor="category-image" className="cursor-pointer w-fit">
                    {formData.image ? (
                        <img
                            src={
                                typeof formData.image === "string"
                                    ? formData.image
                                    : formData.image?.url
                                        ? formData.image.url
                                        : URL.createObjectURL(formData.image)
                            }
                            alt="Preview"
                            className="h-24 w-24 object-cover border rounded"
                        />
                    ) : (
                        <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                            <CloudUpload />
                        </div>
                    )}
                </label>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
                <Button type="submit" variant="outline" className="w-25" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-25" /> : initialData?.id ? "Update" : "Save"}
                </Button>
            </div>
        </form>
    )
}


export default CategoryForm