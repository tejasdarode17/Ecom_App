import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import ProductsActionButton from './ProductsActionButtons';


const ProductsTable = ({ products, productsLoading }) => {

    if (productsLoading) return <p>Loading...</p>;

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
                <span className="text-center">Action</span>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="h-[600px]">
                {(products || [])?.map((product) => (
                    <Link to={`/seller/product/${product?.slug}`} key={product?._id}>
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
                            <span className={product.stock === 0 ? "text-red-500 font-medium" : product.stock <= 10 ? "text-yellow-500 font-medium" : "text-green-600 font-medium"}>
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

                            <div className="text-center cursor-pointer text-gray-600 hover:text-black">
                                <ProductsActionButton product={product} />
                            </div>

                        </div>
                    </Link>
                ))}
            </ScrollArea>
        </>
    );
};




export default ProductsTable;


