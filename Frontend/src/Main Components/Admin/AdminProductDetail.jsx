import { useLocation, } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminProductDetail = () => {
    const location = useLocation();
    const product = location.state?.product;
    if (!product) return <p className="p-6">Product not found</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>

            <div className="grid grid-cols-2 gap-6">
                {/* Product Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <img
                            src={product.image.url}
                            alt={product.name}
                            className="h-64 w-auto rounded"
                        />
                    </CardContent>
                </Card>

                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <p><strong>Category:</strong> {product.category?.name}</p>
                        <p><strong>Brand:</strong> {product.brand || "N/A"}</p>
                        <p><strong>Price:</strong> ₹{product.price}</p>
                        {product.salePrice > 0 && <p><strong>Sale Price:</strong> ₹{product.salePrice}</p>}
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Status:</strong>
                            <Badge className={product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                {product.active ? "Active" : "Inactive"}
                            </Badge>
                        </p>
                        <p><strong>Created At:</strong> {formatDate(product.createdAt)}</p>
                        <p><strong>Updated At:</strong> {formatDate(product.updatedAt)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Product Description */}
            {product.description && (
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{product.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Analytics / Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-60">
                        <p><strong>Total Orders:</strong> {product.ordersCount ?? 0}</p>
                        <p><strong>Returned:</strong> {product.returnsCount ?? 0}</p>
                        <p><strong>Average Rating:</strong> {product.avgRating ?? "N/A"}</p>
                        <p><strong>Reviews:</strong> {product.reviews?.length ?? 0}</p>
                        {/* Add more analytics here later: age group, location stats etc */}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};


//reviews of products ayenge yahape 
//api se fetch hoge product ke reviews


export default AdminProductDetail;
