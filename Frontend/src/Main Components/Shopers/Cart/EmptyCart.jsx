import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartFooter from "./CartFooter";

const EmptyCart = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <div className="bg-white  max-w-md w-full mx-auto my-24 flex flex-col flex-1 items-center justify-center gap-4 rounded-2xl shadow-md p-8 text-center border">
                <div className="bg-[#F1F3F6] p-4 rounded-full">
                    <ShoppingBag className="w-10 h-10 text-gray-600" />
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                    Your cart is empty 🛒
                </h2>
                <p className="text-sm text-gray-500">
                    Looks like you haven’t added anything yet.
                    Let’s fix that!
                </p>

                <Button
                    onClick={() => navigate("/")}
                    className="mt-4 px-6 py-2 font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                </Button>
            </div>


            <CartFooter></CartFooter>
        </div>
    );
};

export default EmptyCart;
