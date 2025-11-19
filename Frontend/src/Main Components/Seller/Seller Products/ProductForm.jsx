import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CloudUpload, Loader2, X } from "lucide-react";

const ProductForm = ({ initialData = {}, onSubmit, loading }) => {

    const { categories } = useSelector((store) => store.categories);

    const normalizedData = useMemo(() => ({
        name: initialData.name || "",
        price: initialData.price || "",
        category: initialData.category?._id || "",
        brand: initialData.brand || "",
        stock: initialData.stock || "",
        attributes: initialData.attributes || {},
        description: initialData.description || "",
        highlights: initialData.highlights || [],
    }), []);

    const isEditMode = Boolean(initialData?._id);
    const [formData, setFormData] = useState(normalizedData);
    const [productImages, setProductImages] = useState(initialData.images || []);


    const selectedCategory = categories.find((c) => c._id === formData.category);

    useEffect(() => {
        setFormData(normalizedData);
        setProductImages(initialData.images || []);
    }, [normalizedData, initialData.images]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value) => {
        setFormData({ ...formData, category: value, attributes: {} });
    };

    const handleAttributeChange = (name, value) => {
        setFormData((prev) => ({ ...prev, attributes: { ...prev.attributes, [name]: value } }));
    };

    const handleHighlightChange = (value) => {
        setFormData((prev) => ({ ...prev, highlights: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setProductImages((prev) => [...prev, ...files]);
    };

    const handleImageRemove = (idx) => {
        setProductImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, setFormData, productImages, setProductImages);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange} disabled={isEditMode} required>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Product Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Brand</Label>
                    <Input name="brand" value={formData.brand} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Stock</Label>
                    <Input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                </div>
            </div>

            {/* Attributes */}
            {selectedCategory?.attributes?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory.attributes.map((attr) => (
                        <div key={attr.name} className="flex flex-col gap-2 p-3 border rounded shadow-sm">
                            <Label>{attr.name}{attr.required && "*"}</Label>
                            <Input
                                type="text"
                                value={formData.attributes[attr.name] || ""}
                                onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                required={attr.required}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Highlights */}
            <div className="flex flex-col gap-2 p-3 border rounded shadow-sm">
                <Label>Highlights</Label>
                <ListInput value={formData?.highlights} onChange={handleHighlightChange} placeholder="Add highlight" />
            </div>


            {/* Description */}
            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea name="description" rows={4} value={formData?.description} onChange={handleChange} required />
            </div>

            {/* Images */}
            <div className="flex flex-col gap-2">
                <Label>Product Images</Label>
                <div className="flex gap-2 flex-wrap">
                    <Input id="product-image" type="file" accept="image/*" className="hidden" multiple onChange={handleImageChange} />
                    <label htmlFor="product-image" className="flex flex-wrap cursor-pointer w-fit">
                        {productImages.length ? productImages.map((file, idx) => (
                            <div key={file?.url || idx} className="h-24 w-24 border rounded relative group">
                                <img src={file.url || URL.createObjectURL(file)} alt={`img-${idx}`} className="object-cover w-full h-full" />
                                <button type="button" onClick={() => handleImageRemove(idx)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition">
                                    <X className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        )) : (
                            <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                <CloudUpload />
                            </div>
                        )}
                    </label>

                    {
                        productImages.length > 0 &&
                        <label htmlFor="product-image">
                            <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                <CloudUpload />
                            </div>
                        </label>
                    }

                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
                <Button type="submit" variant="outline" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Product"}
                </Button>
            </div>
        </form>
    );
}




const ListInput = ({ value = [], onChange, placeholder }) => {
    const [input, setInput] = useState("");

    const handleAdd = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault();
            onChange([...value, input.trim()]);
            setInput("");
        }
    };

    const handleRemove = (idx) => {
        onChange(value?.filter((_, i) => i !== idx));
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-2">
                {value.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                        {item}
                        <button type="button" onClick={() => handleRemove(idx)}>
                            <X size={14} className="text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
            <Input
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleAdd}
            />
        </div>
    );
}


export default ProductForm