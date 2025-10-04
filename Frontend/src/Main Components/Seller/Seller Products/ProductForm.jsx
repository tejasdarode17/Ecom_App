import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CloudUpload, Loader2, X } from 'lucide-react'
import { useSelector } from 'react-redux'

export const ProductForm = ({ initialData = {}, onSubmit, loading }) => {

    const normalizedInitialData = {
        name: initialData.name || '',
        price: initialData.price || '',
        category: initialData.category?._id || '',
        brand: initialData.brand || '',
        stock: initialData.stock || '',
        description: initialData.description || '',
    }
    const [productImages, setProductImages] = useState([])

    useEffect(() => {
        if (initialData.images) setProductImages(initialData.images)
    }, [initialData])

    const [formData, setFormData] = useState(normalizedInitialData)
    const { categories } = useSelector((store) => store.categories)


    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    function handleCategoryChange(value) {
        setFormData(prev => ({ ...prev, category: value }))
    }

    function handleImageChange(e) {
        const files = Array.from(e.target.files)
        setProductImages((prev) => [...prev, ...files])
    }

    useEffect(() => {
        return () => {
            if (productImages && typeof productImages !== 'string') {
                URL.revokeObjectURL(productImages)
            }
        }
    }, [productImages])

    function submitHandler(e) {
        e.preventDefault()
        onSubmit(formData, setFormData, productImages, setProductImages)
    }

    return (
        <form onSubmit={submitHandler} className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Product Name */}
                <div className="flex flex-col gap-2">
                    <Label>Product Name</Label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Brand */}
                <div className="flex flex-col gap-2">
                    <Label>Brand</Label>
                    <Input
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                    <Label>Price (₹)</Label>
                    <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                    <Label>Category</Label>
                    <Select
                        value={formData?.category}
                        onValueChange={handleCategoryChange}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>

                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat?._id} value={cat?._id}>
                                    {cat?.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Stock */}
                <div className="flex flex-col gap-2">
                    <Label>Stock</Label>
                    <Input
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* 🖼️ Product Images */}
            <div className="flex flex-col gap-2">
                <Label>
                    Product Image
                    <p className="text-muted-foreground text-xs">
                        (Select Main Image First — it will show as your product's front image)
                    </p>
                </Label>

                <div className="flex gap-2">
                    <Input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                    />

                    {/* Image Preview Section */}
                    <label
                        htmlFor="product-image"
                        className="flex flex-wrap cursor-pointer w-fit"
                    >
                        {productImages?.length > 0 ? (
                            productImages.map((file, idx) => (
                                <div
                                    key={file.url || idx}
                                    className="h-24 w-24 border rounded overflow-hidden relative group"
                                >
                                    <img
                                        src={file.url ? file.url : URL.createObjectURL(file)}
                                        alt={`carousel-${idx}`}
                                        className="object-cover w-full h-full"
                                    />

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setProductImages(
                                                productImages.filter((_, index) => index !== idx)
                                            );
                                        }}
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                <CloudUpload />
                            </div>
                        )}
                    </label>

                    {/* Add More Button */}
                    <label
                        htmlFor="product-image"
                        className={`h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground cursor-pointer ${productImages?.length > 0 ? "flex" : "hidden"
                            }`}
                    >
                        <div className="flex flex-col justify-center items-center">
                            <CloudUpload className="h-6 w-6" />
                            Add More
                        </div>
                    </label>
                </div>
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    variant="outline"
                    className="w-25"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-25" />
                    ) : (
                        "Update"
                    )}
                </Button>
            </div>

        </form>
    )
}

export default ProductForm

