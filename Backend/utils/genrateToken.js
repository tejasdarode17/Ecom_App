import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()



export async function genrateToken(payload) {

    return await JWT.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "30m"
    })

}

export async function verifyToken(payload) {
    try {
        let data = await JWT.verify(payload, process.env.JWT_SECRET_KEY)
        return data
    } catch (error) {
        console.log(error);
    }
}


