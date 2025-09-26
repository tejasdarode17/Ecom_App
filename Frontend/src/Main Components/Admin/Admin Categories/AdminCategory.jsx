import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useUploadImage from "@/Custom Hooks/useUploadImage";
import axios from "axios";
import { useSelector } from "react-redux";
import CategoryForm from "./CategoryForm";
import DeleteCategory from "./DeleteCategory";
import EditCategory from "./EditCategory";

const AdminCategory = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <AddCategory />
            </div>
            <CategoryList />
        </div>
    );
};

const CategoryList = () => {
    const { categories, loading } = useSelector((store) => store.categories);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category List</CardTitle>
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
                        {(categories || []).map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell>
                                    <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
                                        <img
                                            className="object-cover w-full h-full"
                                            src={cat?.image?.url}
                                            alt={cat.name}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium text-gray-800">{cat.name}</p>
                                </TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <EditCategory cat={cat} />
                                    <DeleteCategory cat={cat} />
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!categories || categories.length === 0) && (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-gray-500 py-6"
                                >
                                    {loading ? "Loading categories..." : "No categories found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const AddCategory = () => {
    const [loading, setLoading] = useState(false);
    const { uploadImageToServer } = useUploadImage();
    const [open, setOpen] = useState(false);

    async function handleSubmit(formData, setFormData) {
        try {
            setLoading(true);
            const uploadedImage = await uploadImageToServer(formData.image);

            const payload = {
                name: formData.name,
                description: formData.description,
                image: uploadedImage,
            };
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/add-category`,
                payload,
                {
                    withCredentials: true,
                }
            );
            setFormData({ name: "", description: "", image: null });
            setOpen(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <CategoryForm onSubmit={handleSubmit} loading={loading} />
            </DialogContent>
        </Dialog>
    );
};

export default AdminCategory;


