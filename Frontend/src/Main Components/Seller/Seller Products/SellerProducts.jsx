import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ProductsTable from './ProductsTable';
import AccessDenied from '../AccessDenied';

const SellerProducts = () => {

    const { products } = useSelector((store) => store.seller)
    const { userData } = useSelector((store) => store.auth)

    if (["pending", "banned", "rejected", "suspended"].includes(userData?.status)) {
        return <AccessDenied status={userData?.status} />
    }

    return (
        <div className="w-full p-6 min-h-screen">
            <div>
                <SellerProductsHeaderButtons />
                <SellerProductsSearchAndFilter />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ProductsTable products={products} role={userData?.role} ></ProductsTable>
                <SellerProductsFooter products={products}></SellerProductsFooter>
            </div>
        </div>
    );
};

const SellerProductsHeaderButtons = () => {
    const navigate = useNavigate()
    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Products List</h1>

            <div className="flex gap-2">
                <Button onClick={() => navigate("/seller/add-product")} variant="outline">Add Product</Button>
            </div>
        </div>
    )
}

const SellerProductsSearchAndFilter = () => {

    const { categories } = useSelector((store) => store.categories)

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <Input placeholder="Search by product name..." className="sm:max-w-sm" />
            <div className="flex gap-2 flex-wrap">
                <Input
                    type="date"
                    defaultValue={format(new Date(), "yyyy-MM-dd")}
                    className="w-fit"
                />
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Status</option>
                    <option>Inactive</option>
                    <option>Active</option>
                </select>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Categories</option>
                    {
                        categories.map((cat) => (
                            <div>
                                <option>{cat?.name}</option>
                            </div>
                        ))
                    }
                </select>
                <Button variant="outline">Filter</Button>
            </div>
        </div>


    )
}

const SellerProductsFooter = ({ products }) => {
    return (
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
            <span>
                Result 1-{products.length} of {products.length}
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                    Previous
                </Button>
                <Button variant="outline" size="sm">
                    1
                </Button>
                <Button variant="outline" size="sm">
                    Next
                </Button>
            </div>
        </div>
    )
}


export default SellerProducts

