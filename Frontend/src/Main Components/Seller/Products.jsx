import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Headphones, House, Shirt, Smile, Watch } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Products = () => {

    //all products api should be call here 
    //and i will store that data into the redux 

    //extra i can do is i can call the api on the basis of catogory also for the optimization 

    return (
        <>
            <AddNewProduct></AddNewProduct>
            <Categories></Categories>
            <ProductsList></ProductsList>
        </>
    )
}

const Categories = () => {

    const categoriesItems = [
        {
            id: 1,
            name: "Electronics",
            icon: <Headphones />
        },
        {
            id: 2,
            name: "Clothing",
            icon: <Shirt />
        },
        {
            id: 3,
            name: "Home and Kitchen",
            icon: <House />
        },
        {
            id: 4,
            name: "Fashion",
            icon: <Watch />
        },
        {
            id: 5,
            name: "Beauty",
            icon: <Smile />
        },
    ];

    return (
        <div className='flex flex-wrap gap-5 p-5'>
            {categoriesItems.map((item) => (
                <div
                    key={item.id}
                    className='bg-amber-500 p-5 rounded-lg flex flex-col items-center w-40 cursor-pointer hover:bg-amber-600 transition-colors'
                >
                    <div className='text-4xl mb-2'>
                        {item.icon}
                    </div>
                    <div className='text-lg font-semibold'>
                        {item.name}
                    </div>
                </div>
            ))}
        </div>
    );
};


const ProductsList = ({ category }) => {

    //here i will show  filterd  item on the basis os category prop which im going to receive from the catogories component 
    //filter logic should also be written here 
    // or i can call the api on the basis os category prop also 

    return (
        <>


        </>
    )
}




const AddNewProduct = () => {

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        description: '',
    });

    function handleCategoryChange(value) {
        setFormData((prev) => ({ ...prev, category: value }));
    };


    useEffect(() => {
        return () => {
            if (formData.image) {
                URL.revokeObjectURL(formData.image);
            }
        };
    }, [formData.image]);


    const categoryOptions = [
        'Electronics',
        'Clothing',
        'Home and Kitchen',
        'Fashion',
        'Beauty',
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Product</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Fill in the product details below. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <form className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" value={formData.name} required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" name="price" type="number" value={formData.price} required />
                    </div>

                    <div className="grid gap-2 w-full">
                        <Label>Category</Label>
                        <Select onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" name="stock" type="number" value={formData.stock} required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer w-fit">
                            {formData.image ? (
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded"
                                />
                            ) : (
                                <div className="h-20 w-20 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                    Select Image
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} required />
                    </div>

                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Add Product</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}




export default Products