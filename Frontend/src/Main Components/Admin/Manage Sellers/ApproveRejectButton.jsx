import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2, CircleSlash, MoreHorizontal, } from "lucide-react";
import useSellerChangeStatus from "@/Custom Hooks/useSellerChangeStatus";
import { useDispatch } from "react-redux";
import { updateSellerStatus } from "@/Redux/adminSlice";


export const ApproveRejectButton = ({ seller }) => {

    const { changeSellerStatus, loading } = useSellerChangeStatus()
    const dispatch = useDispatch()
    async function handleChangeStatus(newStatus, e) {
        e.stopPropagation()
        e.preventDefault()
        const updatedSeller = await (changeSellerStatus(newStatus, seller?._id))
        dispatch(updateSellerStatus({ id: seller._id, status: updatedSeller?.status }))
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={loading}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {seller?.status !== "approved" && (
                    <DropdownMenuItem onClick={(e) => handleChangeStatus("approved", e)}>
                        <CheckCircle2 className="text-green-400 mr-2 h-4 w-4" /> Approve
                    </DropdownMenuItem>
                )}
                {seller?.status !== "rejected" && (
                    <DropdownMenuItem onClick={(e) => handleChangeStatus("rejected", e)}>
                        <CircleSlash className="text-red-500 mr-2 h-4 w-4" /> Reject
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};