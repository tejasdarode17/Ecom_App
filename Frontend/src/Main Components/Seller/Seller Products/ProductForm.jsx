// components/ProductForm.jsx
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CloudUpload, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

export const ProductForm = ({ initialData = {}, onSubmit, loading }) => {

    const normalizedInitialData = {
        name: initialData.name || '',
        price: initialData.price || '',
        category: initialData.category?._id || '',
        brand: initialData.brand || '',
        stock: initialData.stock || '',
        description: initialData.description || '',
        image: initialData.image || null,
    }


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
        setFormData(prev => ({ ...prev, image: e.target.files[0] }))
    }

    useEffect(() => {
        return () => {
            if (formData.image && typeof formData.image !== 'string') {
                URL.revokeObjectURL(formData.image)
            }
        }
    }, [formData.image])

    function submitHandler(e) {
        e.preventDefault()
        onSubmit(formData, setFormData)
    }

    return (
        <form onSubmit={submitHandler} className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className='flex flex-col gap-2'>
                    <Label>Product Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>Brand</Label>
                    <Input name="brand" value={formData.brand} onChange={handleChange} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>Price (₹)</Label>
                    <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label>Category</Label>
                    <Select value={formData?.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat?._id}>
                                    {cat?.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Stock</Label>
                    <Input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <Label>Product Image</Label>
                <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="product-image"
                    onChange={handleImageChange}
                />
                <label htmlFor="product-image" className="cursor-pointer w-fit">
                    {formData.image ? (
                        <img
                            src={
                                formData.image && typeof formData.image === 'object' && 'url' in formData.image
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

            <div className='flex flex-col gap-2'>
                <Label>Description</Label>
                <Textarea name="description" rows={4} value={formData.description} onChange={handleChange} required />
            </div>

            <div className='flex justify-center'>
                <Button type="submit" variant="outline" className="w-25" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-25" /> : 'Update'}
                </Button>
            </div>
        </form>
    )
}

export default ProductForm