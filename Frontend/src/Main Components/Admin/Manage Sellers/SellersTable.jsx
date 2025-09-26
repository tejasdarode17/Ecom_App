import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/formatDate"
import { useNavigate } from "react-router-dom"
import { SellerVerificationBadge } from "./VerificationBadge"
import { ApproveRejectButton } from "./ApproveRejectButton"

const SellersTable = ({ sellers, showActions = false }) => {
    const navigate = useNavigate()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Seller List</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Registered</TableHead>
                            {showActions && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sellers.length > 0 ? (
                            sellers.map((s) => (
                                <TableRow className="pointer" key={s._id} onClick={() => navigate(`/admin/seller/${s._id}`)}>
                                    <TableCell>
                                        {s?.username || "N/A"}
                                    </TableCell>
                                    <TableCell>{s?.email || "N/A"}</TableCell>
                                    <TableCell>
                                        <SellerVerificationBadge seller={s} />
                                    </TableCell>
                                    <TableCell>{s?.productsCount ?? 0}</TableCell>
                                    <TableCell>{s?.rating ?? "—"}</TableCell>
                                    <TableCell>{formatDate(s.createdAt)}</TableCell>
                                    {showActions && (
                                        <TableCell>
                                            <ApproveRejectButton seller={s} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={showActions ? 7 : 6} className="text-center py-6 text-gray-500 italic">
                                    🚫 No sellers found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default SellersTable
