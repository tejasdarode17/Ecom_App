import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {

    const { sellersByStatus } = useSelector((store) => store.admin)
    const sellers = sellersByStatus?.all?.data

    const pendingSellers = sellersByStatus?.pending?.data
    const navigate = useNavigate()


    return (
        <div className="p-6 space-y-8">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome Sir </h1>
                <p className="text-gray-600 mt-1">Platform overview & recent activity.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card onClick={() => navigate("/admin/sellers")}>
                    <CardContent className="p-6 pointer">
                        <h2 className="text-lg font-semibold text-gray-700">Total Sellers</h2>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{sellers?.length}</p>
                    </CardContent>
                </Card>

                <Card onClick={() => navigate("/admin/seller/pending")}>
                    <CardContent className="p-6 pointer">
                        <h2 className="text-lg font-semibold text-gray-700">Pending Approvals</h2>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingSellers?.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
                        <p className="text-3xl font-bold text-green-600 mt-2">540</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-700">Reported Products</h2>
                        <p className="text-3xl font-bold text-red-600 mt-2">3</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Sellers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recently Registered Sellers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {["pending", "approved", "suspended"].map((status, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">seller{idx + 1}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    status === "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recently Added Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {["pending", "approved", "reported"].map((status, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">Product {idx + 1}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    status === "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts / Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>3 sellers awaiting approval</li>
                        <li>2 products reported for review</li>
                        <li>1 seller account suspended recently</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboard
