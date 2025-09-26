import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"

const DeleteCategory = ({ cat }) => {

    const id = cat._id
    async function handleDeleteCategory() {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-category/${id}`, {
                withCredentials: true,
            });
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Deleting this category will permanently remove it from your store, and products linked to this category may be affected.
                        Are you sure you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-500 hover:bg-red-600">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}


export default DeleteCategory