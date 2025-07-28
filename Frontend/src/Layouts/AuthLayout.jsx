
import { Outlet } from "react-router-dom"

const AuthLayout = () => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            <div className="bg-blue-600 text-white p-10 flex flex-col justify-center items-start">
                <h1 className="text-4xl font-bold mb-4">Shoply</h1>
                <p className="text-lg">
                    Your personalized shopping experience. Discover products, track orders, and shop smarter with AI.
                </p>
                <ul className="mt-6 space-y-2 list-disc list-inside text-sm">
                    <li>🔍 Smart product recommendations</li>
                    <li>🧠 AI-generated summaries & reviews</li>
                    <li>⚡ Real-time stock and updates</li>
                </ul>
            </div>

            {/* Form Right */}
            <div className="p-10 flex justify-center items-center">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
