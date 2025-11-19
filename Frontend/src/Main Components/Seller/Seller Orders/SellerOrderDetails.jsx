import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download, Printer, StepBack, Check, Truck, PackageCheck, ArrowRightCircle, MapPin, CreditCard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { changeOrderStatus, setOrderDeliveryPartner } from "@/Redux/sellerSlice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";



const SellerOrderDetails = () => {
    const navigate = useNavigate();
    const { order } = useSelector((store) => store.seller || {});

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <PackageCheck className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-lg font-medium">No order selected</p>
                    <Button onClick={() => navigate(-1)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Order Details
                        </h1>
                        <p className="text-slate-600 mt-1">Order #{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-slate-500 mt-1">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                            <Download size={16} className="mr-2" /> Invoice
                        </Button>
                        <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                            <Printer size={16} className="mr-2" /> Print
                        </Button>
                        <Button variant="outline" onClick={() => navigate(-1)} className="border-slate-300 hover:bg-slate-50">
                            <StepBack size={16} className="mr-2" /> Back
                        </Button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800">{order.address?.name}</h3>
                                    <p className="text-slate-600">{order.address?.address}</p>
                                    <p className="text-slate-600">{order.address?.locality}, {order.address?.city}</p>
                                    <p className="text-slate-600">{order.address?.state} - {order.address?.pinCode}</p>
                                    <p className="text-slate-600 mt-1">Phone: {order.address?.phoneNumber}</p>
                                    <p className="text-slate-600 mt-1">Landmark: {order.address?.landmark}</p>
                                    {order.address?.isDefault && <Badge className="mt-2 bg-green-600 text-white">Default</Badge>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Payment</h4>
                                    <p className="text-sm text-slate-600">Mode: <span className="font-medium">{order.paymentMode}</span></p>
                                    <p className="text-sm">
                                        Status:{" "}
                                        {order.paymentStatus === "paid" ? (
                                            <Badge className="bg-green-600 text-white">Paid</Badge>
                                        ) : (
                                            <Badge className="bg-amber-400 text-white">Pending</Badge>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-slate-500">Seller Earnings</p>
                                <p className="text-xl font-bold text-blue-700">₹{order?.sellerTotalAmount?.toLocaleString("en-IN")}</p>
                            </div>
                        </div>

                        {/* Order Items + Status (interactive) */}
                        <OrderItemsWithStatus order={order} />
                    </div>

                    {/* Right: Summary */}
                    <aside className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h4 className="font-semibold text-lg mb-3">Order Summary</h4>

                        <div className="space-y-2 text-sm text-slate-700">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>{order.items?.length ?? 0}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-900 border-t pt-2">
                                <span>Total</span>
                                <span>₹{(order.sellerTotalAmount ?? 0).toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Contact Buyer
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};


const OrderItemsWithStatus = ({ order }) => {

    const allDelivered = order.items.every((item) => item.status === "delivered")

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 mt-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Order Items & Status</h2>
                        <p className="text-slate-500 text-sm">Manage item status and track progress</p>
                    </div>
                </div>

                <Badge className="bg-slate-100 text-slate-700">
                    {order?.items?.length} {order.items.length === 1 ? "item" : "items"}
                </Badge>
            </div>

            <div className="space-y-4">
                {order?.items?.map((item) => (
                    <OrderItemCard key={item._id} item={item} order={order} />
                ))}
            </div>

            {allDelivered && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-800">All items delivered</p>
                                <p className="text-green-600 text-sm">You can now request payout</p>
                            </div>
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                            <ArrowRightCircle size={18} className="mr-2" />
                            Request Payout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};


const OrderItemCard = ({ item, order }) => {

    const statusConfig = {
        ordered: {
            label: "Order Confirmed",
            color: "bg-slate-100 text-slate-700 border-slate-300",
            nextAction: "packed",
            nextLabel: "Mark as Packed",
            icon: PackageCheck,
            buttonCss: "bg-blue-600 hover:bg-blue-700"
        },
        packed: {
            label: "Packed",
            color: "bg-blue-100 text-blue-700 border-blue-300",
            nextAction: null,
            nextLabel: null,
            icon: Truck,
            buttonCss: "bg-indigo-600 hover:bg-indigo-700"
        },
    };

  
    const cfg = statusConfig[item.status] || statusConfig.ordered;
    const Icon = cfg.icon;

    const dispatch = useDispatch()
    function handelProductStatusChange(orderID, itemID, newStatus) {
        dispatch(changeOrderStatus({ orderID, itemID, newStatus }))
    }


    return (
        <div className="p-4 border border-slate-200 rounded-xl bg-white hover:shadow-md transition-all duration-200">
            <div className="flex gap-4">
                <img
                    src={item?.product?.images?.[0]?.url || item?.product?.thumbnail || "/placeholder.png"}
                    alt={item?.product?.name || "product"}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 text-lg mb-1 line-clamp-2">{item?.product?.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>Qty: {item?.quantity}</span>
                                <span>•</span>
                                <span>₹{item?.lockedPrice?.toLocaleString("en-IN")} each</span>
                            </div>
                        </div>

                        <div className="text-right ml-4">
                            <p className="text-lg font-bold text-slate-800">₹{item?.sellerAmount}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge className={`${cfg.color} border font-medium capitalize flex items-center gap-2`}>
                                <Icon size={14} />
                                {cfg.label}
                            </Badge>
                        </div>

                        {cfg.nextAction ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className={`${cfg.buttonCss} text-white shadow-sm`}>
                                        <Icon size={16} className="mr-2" />
                                        {cfg?.nextLabel}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Change Status</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. The product will be {cfg.nextAction}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handelProductStatusChange(order._id, item._id, cfg.nextAction)} className={`${cfg.buttonCss} text-white shadow-sm`}>
                                            {cfg.nextLabel}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="none" className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                        Assign A Delivery Partner
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            <DialogDescription>
                                                <p>Select A delivery Partner</p>
                                            </DialogDescription>
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DeliveryPartnerPicker order={order} item={item} />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



const DeliveryPartnerPicker = ({ order, item }) => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const dispatch = useDispatch()


    async function fetchDeliveryPartners() {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all`, {
                withCredentials: true
            })
            setPartners(response?.data?.partners || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDeliveryPartners();
    }, []);



    async function handleAssign() {

        if (!selectedPartner) {
            return toast.error("Please Select a Delivery Partner")
        }
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/assign/order`,
                {
                    orderID: order._id,
                    itemID: item._id,
                    partnerID: selectedPartner
                },
                { withCredentials: true }
            )
            console.log(response.data);
            dispatch(setOrderDeliveryPartner(response.data.order))
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something Went Wrong on Server")
        } finally {
            setLoading(false);
        }

    }

    if (loading) return <p>Loading delivery partners...</p>;

    return (
        <div className="space-y-3">
            {partners.map((p) => (
                <div
                    key={p._id}
                    className={`border p-3 rounded-lg cursor-pointer flex justify-between items-center ${selectedPartner === p._id ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}
                    onClick={() => setSelectedPartner(p._id)}
                >
                    <div>
                        <p className="font-semibold">{p.username}</p>
                        <p className="text-slate-600 text-sm">📞 {p.phone}</p>
                        <p className="text-slate-600 text-sm">⭐ {p.rating || 4.5}</p>
                    </div>

                    {selectedPartner === p._id && (
                        <span className="text-blue-600 font-bold">Selected</span>
                    )}
                </div>
            ))}

            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                disabled={selectedPartner === null}
                onClick={handleAssign}
            >
                Assign Delivery Partner
            </Button>
        </div>
    );
};






export default SellerOrderDetails;

