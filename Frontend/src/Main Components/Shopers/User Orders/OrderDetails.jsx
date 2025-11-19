import { useDispatch, useSelector } from "react-redux";
import OrderStatusBadge from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { setSingleProduct } from "@/Redux/productsSlice";
import { useNavigate } from "react-router-dom";


const OrderDetails = () => {
    const { order } = useSelector((store) => store.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    if (!order) {
        return <div className="text-center py-20">No order selected</div>;
    }

    const canModify = order?.orderStatus === "ordered" || order?.orderStatus === "packed";
    const showActions = ["ordered", "packed", "delivered"].includes(order?.orderStatus);

    return (
        <div className="w-[70%] mx-auto my-10 space-y-8">

            <div>
                <OrderTimeline order={order} />
            </div>

            <div className="bg-white shadow rounded p-6 border space-y-6">

                <div>
                    <h2 className="text-2xl font-semibold">Order Details</h2>
                    <div className="flex gap-1 text-muted-foreground text-sm mt-0.5">
                        <p>Order Placed On {formatDate(order.createdAt)} |</p>
                        <p>OrderID {order._id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">

                    {/* DELIVERY ADDRESS */}
                    <div className="bg-white shadow rounded p-6 border space-y-2">
                        <h3 className="font-semibold text-lg">Delivery Address</h3>
                        <p className="font-semibold text-gray-800">{order.address?.name}</p>
                        <p>{order.address?.address}</p>
                        <p>{order.address?.locality}</p>
                        <p>
                            {order.address?.city}, {order.address?.state} - {order.address?.pinCode}
                        </p>
                        <p>Phone: {order.address?.phoneNumber}</p>
                    </div>

                    {/* PAYMENT + ACTIONS MERGED */}
                    <div className="bg-white shadow rounded p-6 border space-y-4 flex flex-col">

                        {/* PAYMENT INFO */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Payment Information</h3>

                            <div>
                                <p className="text-gray-500">Payment Mode</p>
                                <p className="font-semibold capitalize">{order.paymentMode}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Payment Status</p>
                                <p
                                    className={`font-semibold uppercase ${order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {order.paymentStatus}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-semibold">
                                    {order.amount?.toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* DIVIDER */}
                        {showActions && <hr className="my-2" />}

                        {/* ACTION BUTTONS */}
                        {showActions && (
                            <div className="flex flex-col gap-3">

                                {canModify ? (
                                    <>
                                        <Button variant="outline" className="w-full py-2">
                                            Cancel Order
                                        </Button>
                                        <Button variant="outline" className="w-full py-2">
                                            Change Address
                                        </Button>
                                    </>
                                ) : order.orderStatus === "delivered" ? (
                                    <>
                                        <Button variant="outline" className="w-full py-2">
                                            Return / Replace
                                        </Button>
                                        <Button variant="outline" className="w-full py-2">
                                            Write a Product Review
                                        </Button>
                                    </>
                                ) : null}

                            </div>
                        )}

                    </div>
                </div>
            </div>


            {/* ITEMS */}
            <div className="bg-white shadow rounded p-6 border space-y-4">
                <h3 className="text-2xl font-semibold">Items</h3>

                <div className="space-y-6">
                    {order.items?.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between items-start border-b pb-4  pointer"
                            onClick={() => {
                                dispatch(setSingleProduct(item?.product));
                                navigate(`/product/${item?.product?.slug}`);
                            }}
                        >
                            <div className="flex gap-4">
                                <img
                                    src={item.product?.images?.[0]?.url}
                                    className="w-28 h-28 object-contain rounded"
                                    alt={item.product?.name}
                                />

                                <div>
                                    <p className="font-semibold text-gray-800">{item.product?.name}</p>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Qty: {item.quantity} • Price: ₹{item.lockedPrice}
                                    </p>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Seller: <span className="font-semibold">{item.seller}</span>
                                    </p>

                                    <div className="mt-2">
                                        <OrderStatusBadge order={order} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default OrderDetails;



const stages = ["ordered", "packed", "shipped", "out-for-delivery", "delivered", "cancelled",];
const OrderTimeline = ({ order }) => {

    return (
        <div className="bg-white shadow rounded p-6 border space-y-4">
            <div className="flex justify-center">
                <h3 className="font-semibold text-lg uppercase">
                    {order.orderStatus}
                </h3>
            </div>

            <div className="flex items-center justify-between relative">
                {stages.map((stage, index) => {
                    const active = stage === order.orderStatus;
                    const currentIndex = stages.indexOf(order.orderStatus);

                    return (
                        <div
                            key={stage}
                            className="flex flex-col items-center w-full relative"
                        >
                            {/* POINT */}
                            <div
                                className={`w-5 h-5 rounded-full border-2 transition-all ${active
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-400"
                                    }`}
                            />

                            {/* LINE */}
                            {index < stages.length - 1 && (
                                <div
                                    className={`absolute top-[10px] left-[55%] h-1 w-full ${currentIndex > index
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                        }`}
                                ></div>
                            )}

                            {/* LABEL */}
                            <p
                                className={`text-sm mt-2 ${active
                                    ? "font-semibold text-green-600"
                                    : "text-gray-500"
                                    }`}
                            >
                                {stage.replace(/-/g, " ").toUpperCase()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>

    )


}