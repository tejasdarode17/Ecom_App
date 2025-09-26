import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useSellerChangeStatus from "@/Custom Hooks/useSellerChangeStatus";
import { useDispatch } from "react-redux";
import { updateSellerStatus } from "@/Redux/adminSlice";

const SellerManagement = ({ seller }) => {
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [message, setMessage] = useState("");
    const { changeSellerStatus, loading } = useSellerChangeStatus();

    const dispatch = useDispatch()

    function handleOpen(type) {
        setActionType(type);
        setOpen(true);
    }

    async function handleConfirm() {
        try {
            const updatedSeller = await changeSellerStatus(actionType, seller?._id, message);
            dispatch(updateSellerStatus({ id: seller._id, status: updatedSeller?.status }))
            setOpen(false);
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete() {
        try {
            console.log("Deleted seller:", seller?._id);
            setOpen(false);
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Seller Management</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button
                        variant="outline"
                        className="text-orange-500 border-orange-500"
                        onClick={() => handleOpen("suspend")}
                    >
                        <AlertCircle className="mr-2 h-4 w-4" /> Suspend
                    </Button>

                    <Button
                        variant="outline"
                        className="text-red-500 border-red-500"
                        onClick={() => handleOpen("banned")}
                    >
                        <Ban className="mr-2 h-4 w-4" /> Ban
                    </Button>

                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleOpen("delete")}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Seller
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "suspend" && "Suspend Seller"}
                            {actionType === "banned" && "Ban Seller"}
                            {actionType === "delete" && "Delete Seller"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "delete"
                                ? "Are you sure you want to permanently delete this seller? This cannot be undone."
                                : "Please provide a reason. The seller will see this message in their dashboard."}
                        </DialogDescription>
                    </DialogHeader>

                    {actionType !== "delete" && (
                        <Textarea
                            placeholder="Enter reason (e.g. violating policies, fake listings...)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === "delete" ? "destructive" : "default"}
                            className={actionType === "delete" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                            onClick={actionType === "delete" ? handleDelete : handleConfirm}
                            disabled={loading}
                        >
                            Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SellerManagement;
