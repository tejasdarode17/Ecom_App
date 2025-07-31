import User from "../model/userModel.js";
import bcrypt from "bcrypt"
import { genrateToken } from "../utils/genrateToken.js";


export async function registerUser(req, res) {

    const { name, email, password } = req.body

    try {

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This email is already registred with another account please try with diffrent email"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username: name,
            email: email,
            password: hashPassword
        })

        const accessToken = await genrateToken({ id: newUser._id, role: newUser.role, email: newUser.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false
        })

        return res.status(200).json({
            success: true,
            message: "User Logged in Success",
            user: newUser
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


export async function loginUser(req, res) {

    const { email, password } = req.body

    try {

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not exist with this email"
            })
        }

        const matchPassword = await bcrypt.compare(password, matchPassword)

        if (!matchPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = genrateToken({ id: user._id, role: user.role, email: user.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false
        })

        res.status(200).json({
            success: true,
            message: "User Logged in Success",
            user: user
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


