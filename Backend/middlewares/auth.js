import JWT from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../model/userModel.js"
import Seller from "../model/sellerModel.js"
import Admin from "../model/adminModel.js"
import DeliveryPartner from "../model/deliveryPartnerModel.js"
dotenv.config()


export function verifyUser(req, res, next) {

    const token = req.cookies.accessToken

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "User is not authenticated"
        })
    }

    try {
        let decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid token or token expired",
        })
    }
}

//middleware for checking the role of the user this is not using anywhere
// export function verifyRole(requiredRole) {
//     return (req, res, next) => {
//         if (!req.user || req.user.role !== requiredRole) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied"
//             });
//         }
//         next();
//     };
// }


export async function checkAuth(req, res) {
    try {
        const authUser = req.user;

        if (!authUser) {
            return res.status(400).json({
                success: false,
                message: "Authentication problem",
            });
        }

        let model = ""
        if (authUser.role === "seller") {
            model = Seller;
        } else if (authUser.role === "user") {
            model = User;
        } else if (authUser.role === "admin") {
            model = Admin;
        } else if (authUser.role === "deliveryPartner") {
            model = DeliveryPartner;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const userData = await model.findById(authUser.id).select("-password");

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Authenticated user",
            user: userData,
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}




