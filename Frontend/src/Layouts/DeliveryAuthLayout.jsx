import { Outlet } from "react-router-dom";

const DeliveryAuthLayout = () => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* Left Section */}
            <div className="bg-blue-700 text-white p-10 flex flex-col justify-center items-start">
                <h1 className="text-4xl font-bold mb-4">Shoply Delivery Partners</h1>

                <p className="text-lg">
                    Join Shoply’s delivery network. Get orders fast, deliver efficiently,
                    and earn more every day.
                </p>

                <ul className="mt-6 space-y-2 list-disc list-inside text-sm">
                    <li>🚚 Accept deliveries instantly</li>
                    <li>📍 Smart route optimization for quicker drops</li>
                    <li>💰 Track daily earnings in real-time</li>
                    <li>📦 Seamless pickup & delivery workflow</li>
                </ul>
            </div>

            {/* Right Section – Authentication Forms */}
            <div className="p-10 flex justify-center items-center">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default DeliveryAuthLayout;
