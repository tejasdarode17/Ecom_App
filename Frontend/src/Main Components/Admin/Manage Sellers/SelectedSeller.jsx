import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSeller } from "@/Redux/adminSlice";
import { formatDate } from "@/utils/formatDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellerVerificationBadge } from "./VerificationBadge";
import SellerManagement from "./SellerManagement";
import { ApproveRejectButton } from "./ApproveRejectButton";
import ProductsTable from "@/Main Components/Seller/Seller Products/ProductsTable";

const SelectedSeller = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { seller } = useSelector((store) => store.admin);
    const { userData } = useSelector((store) => store.auth)
    const dispatch = useDispatch();

    // this api is not necesssary to call cuz we can directly show all the products which is coming with the seller info 
    //we will get only the the personal info 
    //that can be passed using the state
    async function fetchSelectedSeller() {
        try {
            setLoading(true)
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/seller/${id}`,
                { withCredentials: true }
            );
            dispatch(setSeller(response?.data?.seller));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSelectedSeller();
    }, [id]);

    if (loading) return <p className="p-6">Loading seller...</p>;
    if (!seller) return <p className="p-6">Seller not found</p>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">{seller.username}</h1>
                    <SellerVerificationBadge seller={seller} />
                </div>
                <ApproveRejectButton seller={seller}></ApproveRejectButton>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="management">Management</TabsTrigger>
                </TabsList>


                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <p>
                                <strong>Registered:</strong> {formatDate(seller?.createdAt)}
                            </p>
                            <p>
                                <strong>Email:</strong> {seller?.email}
                            </p>
                            <p>
                                <strong>Status:</strong> {seller?.status}
                            </p>
                            <p>
                                <strong>Products:</strong> {seller?.products?.length ?? 0}
                            </p>
                            <p>
                                <strong>Rating:</strong> {seller?.rating ?? "0"}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="products">
                    <Card>
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {seller?.products?.length > 0 ? (
                                //this is reusbale component same used for seller fetching his products
                                <ProductsTable products={seller?.products} role={userData?.role}></ProductsTable>
                            ) : (
                                <p>No products listed by this seller.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seller Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <p>
                                <strong>Full Name:</strong> {seller?.username ?? "N/A"}
                            </p>
                            <p>
                                <strong>Phone:</strong> {seller?.phone ?? "N/A"}
                            </p>
                            <p>
                                <strong>Address:</strong> {seller?.businessAddress ?? "N/A"}
                            </p>
                            <p>
                                <strong>KYC:</strong> {seller?.kycStatus ?? "Not Submitted"}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="management">
                    <SellerManagement seller={seller} />
                </TabsContent>
            </Tabs>
        </div>
    );
};



//we have to make the api like fetchSellerProduct with the help of admin we have one but this api can be access by seller
//reviews ka model banega 





export default SelectedSeller;