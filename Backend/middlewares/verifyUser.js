import JWT from "jsonwebtoken"
import dotenv from "dotenv"
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
        console.log(error);
    }

}


export async function checkAuth(req, res) {
    try {
        const user = req.user
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "authentication problem"
            })
        }
        return res.status(200).json({
            success: true,
            message: "authenticated user",
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


