import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import ProductsActionButton from './ProductsActionButtons';

//this component is used in seller as well as admin to view products 

const ProductsTable = ({ products, role }) => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <>
            {/* Table Header */}
            <div className="grid grid-cols-7 font-semibold text-sm text-gray-500 bg-gray-100 px-6 py-3">
                <span className="text-left">Product Name</span>
                <span className="text-left">Image</span>
                <span className="text-left">Category</span>
                <span className="text-left">Stock</span>
                <span className="text-left">Price</span>
                <span className="text-left">Status</span>
                {path.startsWith("/seller") && <span className="text-center">Action</span>}
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="h-[600px]">
                {products.map((product) => (
                    <Link
                        to={`/${role}/product/${product._id}`}
                        state={{ product }}
                        key={product._id}
                    >
                        <div className="grid grid-cols-7 items-center text-sm px-6 py-4 border-b hover:bg-gray-50 gap-2">
                            {/* Product Name */}
                            <span className="font-medium">{product?.name}</span>

                            {/* Image */}
                            <div className="flex">
                                <img
                                    src={product?.images[0]?.url}
                                    alt={product?.name}
                                    className="h-12 w-12 rounded object-cover"
                                />
                            </div>


                            {/* Category */}
                            <span className="text-gray-600">{product?.category?.name}</span>

                            {/* Stock */}
                            <span
                                className={
                                    product.stock === 0
                                        ? "text-red-500 font-medium"
                                        : product.stock <= 10
                                            ? "text-yellow-500 font-medium"
                                            : "text-green-600 font-medium"
                                }
                            >
                                {product.stock}
                            </span>

                            {/* Price */}
                            <span className="text-gray-800 font-semibold">₹{product.price}</span>

                            {/* Status */}
                            <span>
                                {product.active ? (
                                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-700">Inactive</Badge>
                                )}
                            </span>

                            {/* Action Button (only for seller) */}
                            {path.startsWith("/seller") && (
                                <div className="text-center cursor-pointer text-gray-600 hover:text-black">
                                    <ProductsActionButton product={product} />
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </ScrollArea>
        </>
    );
};


//this componennt used in both seller and admin 
//that link tag is routing us on a diffrent single product page based on the role which is passed by parent componenent 
//insted of id we wiil passed slug from the frontened and we will find that product based on slug for better url as of now 
//we are serching only on the based on the id


export default ProductsTable;


