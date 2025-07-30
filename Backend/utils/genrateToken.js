import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config



export async function genrateToken(payload) {

    return JWT.sign(payload, process.env.JWT_SRCTET_KEY, {
        expiresIn: "30m"
    })

}

export async function verifyToken(payload) {
    try {
        let data = await JWT.verify(payload, process.env.JWT_SRCTET_KEY)
        return data
    } catch (error) {
        console.log(error);
    }
}


