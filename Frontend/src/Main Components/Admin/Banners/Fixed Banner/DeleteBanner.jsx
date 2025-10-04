import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteBanner } from "@/Redux/bannersSlice"
import axios from "axios"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"

const DeleteBanner = ({ banner }) => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const id = banner?._id
    const dispatch = useDispatch()
    async function handleDeleteBanner() {
        try {
            setLoading(true)
            setOpen(true)
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-banner/${id}`, {
                withCredentials: true,
            });
            dispatch(deleteBanner({ id }))
            setOpen(false)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This banner will be permanently deleted
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            onClick={handleDeleteBanner}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}


export default DeleteBanner