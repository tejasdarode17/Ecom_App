import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AddAddress from '../Shoper Auth/AddAddress'
import EditAddress from '../Shoper Auth/EditAddress'


const CheckOut = () => {

    const { isAuthenticated, userAddresses } = useSelector((store) => store.auth)
    const { cart, chekOut } = useSelector((store) => store.cart)
    const [selectedAddress, setSelectedAddress] = useState((userAddresses || []).find((a) => a.isDefault === true) || null)
    const [visibleSection, setVisibleSection] = useState(selectedAddress ? "summary" : "address")

    if (!isAuthenticated) { return <Navigate to="/user/auth/login" replace /> }
    if (cart?.items?.length === 0 && !chekOut?.items?.length === 0) { return <Navigate to="/cart" replace /> }

    useEffect(() => {
        const def = userAddresses?.find(a => a.isDefault);
        if (def) {
            setSelectedAddress(def);
        }
    }, [userAddresses]);


    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 text-sm">Complete your purchase securely</p>
                </div>
            </div>

            {/* Main Sections */}
            <div className="flex justify-between items-start gap-6">
                <div className="flex flex-col gap-4 flex-1">
                    <CheckoutAddressSection
                        visibleSection={visibleSection}
                        setVisibleSection={setVisibleSection}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                    />

                    <CheckoutSummarySection
                        visibleSection={visibleSection}
                        setVisibleSection={setVisibleSection}
                    />
                </div>

                <RightOrderSummaryInCheckout />
            </div>
        </div>
    )
}


const CheckoutAddressSection = ({ visibleSection, setVisibleSection, selectedAddress, setSelectedAddress, }) => {

    const [addressFormVisible, setAddressFormVisible] = useState(false);
    const [editAddressFormVisible, setEditAddressFormVisible] = useState(false)
    const { userAddresses } = useSelector((store) => store.auth)
    const hasAddresses = userAddresses?.length > 0;

    return (
        <div className={`w-[90%] bg-white rounded-md shadow-sm border ${!hasAddresses || !selectedAddress ? "border-red-400" : "border-gray-200"}`}>

            {/* The Section Which is always visible no matter what is visibleSection = "" */}
            <div className="flex justify-between items-center px-5 py-3 bg-amber-500 text-white rounded-t-md">
                <p className="font-semibold">1. DELIVERY ADDRESS</p>
                {visibleSection !== "address" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleSection("address")}
                        className="border-white text-amber-500 hover:bg-white hover:text-amber-600"
                    >
                        Change
                    </Button>
                )}
            </div>

            {/* Content */}
            {visibleSection === "address" ? (
                <div className="p-5 space-y-4">
                    {!hasAddresses ? (
                        addressFormVisible ? null :
                            <div className="border border-red-300 bg-red-50 p-4 rounded-md text-center">
                                <p className="text-red-700 font-medium mb-2">
                                    🚨 No address found! Please add a delivery address to continue.
                                </p>
                                <Button
                                    onClick={() => setAddressFormVisible(true)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white"
                                >
                                    Add New Address
                                </Button>
                            </div>
                    ) : (
                        <>
                            {(userAddresses || [])?.map((a, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start justify-between border rounded-md p-3 cursor-pointer transition ${selectedAddress?._id === a._id
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    onClick={() => { setSelectedAddress(a), setEditAddressFormVisible(false), setAddressFormVisible(false) }}
                                >
                                    <div className='flex gap-2'>
                                        {selectedAddress?._id === a._id && <CheckCircle className="w-5 h-5 text-amber-500" />}
                                        <div>
                                            <p className="font-medium text-gray-900">{a?.name}</p>
                                            <p className="text-sm text-gray-600 leading-tight">
                                                {a?.address}, {a?.locality}, {a?.city}, {a?.state} - {a?.pinCode}
                                            </p>
                                            <p className="text-sm text-gray-600">{a?.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {selectedAddress?._id == a?._id && <Button onClick={(e) => { e.stopPropagation(), setEditAddressFormVisible(true), setSelectedAddress(a) }} variant="outline" className="border-white text-amber-500 hover:bg-white hover:text-amber-600">Edit</Button>}
                                    </div>
                                </div>
                            ))}

                            {
                                addressFormVisible || editAddressFormVisible ? null :
                                    <div className="flex gap-3 pt-3">
                                        {selectedAddress && (
                                            <Button onClick={() => setVisibleSection("summary")} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                                                Deliver Here
                                            </Button>
                                        )}
                                        <Button onClick={() => setAddressFormVisible(true)} variant="outline"> Add New Address</Button>
                                    </div>
                            }
                        </>
                    )}

                    {addressFormVisible && <AddAddress open={addressFormVisible} setOpen={setAddressFormVisible} />}
                    {editAddressFormVisible && <EditAddress open={editAddressFormVisible} setOpen={setEditAddressFormVisible} address={selectedAddress}></EditAddress>}

                </div>
            ) : (
                <div className="px-5 py-3">
                    {selectedAddress ? (
                        <p className="text-gray-700 text-sm">
                            Deliver to: <strong>{selectedAddress?.name}</strong>,{" "}
                            {selectedAddress?.address}, {selectedAddress?.city}
                        </p>
                    ) : (
                        <div className="border border-red-300 bg-red-50 p-3 rounded-md flex items-center justify-between">
                            <p className="text-red-700 font-medium">
                                ⚠️ Please add a delivery address before proceeding.
                            </p>
                            <Button onClick={() => { setVisibleSection("address"), setAddressFormVisible(true) }} variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
                                Add Address
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const CheckoutSummarySection = ({ visibleSection, setVisibleSection, }) => {

    const { chekOut } = useSelector((store) => store.cart)
    const { userAddresses } = useSelector((store) => store.auth)
    const [searchParams] = useSearchParams()
    const mode = searchParams.get("mode")
    const navigate = useNavigate()

    return (
        <div className="w-[90%] bg-white rounded-md border shadow-sm">
            <div className="flex justify-between items-center px-5 py-3 bg-amber-500 text-white rounded-t-md">
                <p className="font-semibold">2. ORDER SUMMARY</p>
                {visibleSection !== "summary" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleSection("summary")}
                        className="border-white text-amber-500 hover:bg-white hover:text-amber-600"
                    >
                        Change
                    </Button>
                )}
            </div>

            {visibleSection === "summary" && (
                <div className="p-5 space-y-4">
                    {
                        mode == "buynow" ? (
                            <div className="flex gap-4 border-b border-gray-100 pb-3">
                                <img
                                    src={chekOut?.product?.images?.[0]?.url}
                                    alt={chekOutItems[0]?.product?.name}
                                    className="w-16 h-16 object-contain"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                        {chekOut?.product?.brand} {chekOut?.product?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {chekOut?.product?.attributes?.storage} • {chekOut.attributes?.colour}
                                    </p>
                                    <p className="font-semibold mt-1">
                                        ₹{chekOut?.product?.price?.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            chekOut?.items?.map((item) => (
                                <div
                                    key={item?.product._id}
                                    className="flex gap-4 border-b border-gray-100 pb-3"
                                >
                                    <img
                                        src={item?.product?.images?.[0]?.url}
                                        alt={item?.product?.name}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                            {item?.product?.brand} {item?.product?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item?.product?.attributes?.storage} • {item?.attributes?.colour}
                                        </p>
                                        <p className="font-semibold mt-1">
                                            ₹{item?.product?.price?.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )
                    }
                    <Button disabled={!userAddresses?.length} onClick={() => navigate()} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold w-full pointer">
                        Continue to Payment
                    </Button>
                </div>
            )}
        </div>
    )
}


const RightOrderSummaryInCheckout = () => {
    const { chekOut } = useSelector((store) => store.cart);
    const [searchParams] = useSearchParams()
    const mode = searchParams.get("mode")
    const { userAddresses } = useSelector((store) => store.auth);

    if (!chekOut || chekOut.items?.length === 0) return null;

    return (
        <Card className="w-[350px] sticky top-24 border shadow-md">
            <CardHeader className="bg-amber-500 text-white rounded-t-md">
                <CardTitle className="text-lg font-semibold">PRICE DETAILS</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 py-4">
                {/* Items total */}
                <div className="flex justify-between text-gray-700 text-sm">
                    <p>Price ({chekOut?.items?.length} items)</p>
                    <p>₹{chekOut?.itemTotal?.toLocaleString("en-IN")}</p>
                </div>

                {/* Discount */}
                <div className="flex justify-between text-green-600 text-sm">
                    <p>Discount</p>
                    <p>-₹{0}</p>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-gray-700 text-sm">
                    <p>Delivery Charges</p>
                    <p>
                        {CheckOut?.deliveryFees == 0 ? (
                            <span className="text-green-600 font-medium">Free</span>
                        ) : (
                            `₹${chekOut.deliveryFees}`
                        )}
                    </p>
                </div>

                <Separator className="my-3" />

                {/* Total */}
                <div className="flex justify-between text-base font-semibold text-gray-900">
                    <p>Total Amount</p>
                    <p>₹{chekOut?.finalPayable?.toLocaleString("en-IN")}</p>
                </div>

                <Separator className="my-3" />

                {/* Savings */}
                <p className="text-green-600 text-sm">
                    You will save ₹{0} on this order 🎉
                </p>

                {/* Button */}
                <Button disabled={!userAddresses?.length} className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-3 font-semibold pointer">
                    PLACE ORDER
                </Button>
            </CardContent>
        </Card>
    );
};



export default CheckOut
