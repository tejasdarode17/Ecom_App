import Seller from "../model/sellerModel.js";
import bcrypt from "bcrypt"
import { genrateToken } from "../utils/genrateToken.js";

export async function registerSeller(req, res) {

    try {
        const { name, email, address, password } = req.body

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                success: false,
                message: "All the feilds are required"
            })
        }

        const existingSeller = await Seller.findOne({ email })

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "this email is already taken by another seller please use diffrent email"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newSeller = await Seller.create({
            username: name,
            email: email,
            businessAddress: address,
            password: hashPassword
        })

        const accessToken = genrateToken({ id: newSeller._id, role: newSeller.role, email: newSeller.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        })


        return res.status(200).json({
            success: true,
            message: "Seller Registred Successfully",
            user: newSeller
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function loginSeller(req, res) {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All the feilds are required"
            })
        }

        const seller = await Seller.findOne({ email })

        if (!seller) {
            return res.status(400).json({
                success: false,
                message: "seller does not exist with this email"
            })
        }

        const matchPassword = await bcrypt.compare(password, seller.password)
        if (!matchPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        const accessToken = genrateToken({ id: seller._id, role: seller.role, email: seller.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        })

        return res.status(200).json({
            success: true,
            message: "Seller loggedin Successfully",
            user: seller
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }

}

