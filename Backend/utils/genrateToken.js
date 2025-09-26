import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export function genrateToken(payload) {

    return JWT.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d"
    })

}

export function verifyToken(payload) {
    try {
        let data = JWT.verify(payload, process.env.JWT_SECRET_KEY)
        return data
    } catch (error) {
        console.log(error);
    }
}

