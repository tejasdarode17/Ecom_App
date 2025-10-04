import axios from "axios";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { fetchSearchProducts } from "@/Redux/productsSlice";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [searchDropDown, setSearchDropDown] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [productsSuggesation, setProductsSuggesation] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(-1); // 🔹 track highlighted item

    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function fetchSearchSuggestion() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search`, {
                params: { search: userInput },
                withCredentials: true,
            });
            setProductsSuggesation(response.data.products || []);
            setHighlightIndex(-1); // reset highlight when new suggestions load
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userInput.trim()) {
                fetchSearchSuggestion();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [userInput]);

    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev < productsSuggesation.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev > 0 ? prev - 1 : productsSuggesation.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            let selectedText =
                highlightIndex >= 0
                    ? productsSuggesation[highlightIndex]?.name
                    : userInput;

            if (selectedText) {
                dispatch(fetchSearchProducts(selectedText));
                setUserInput(selectedText);
                setSearchDropDown(false);
                navigate(`/products?search=${encodeURIComponent(selectedText)}`);
            }
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSearchDropDown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex-1" ref={dropdownRef}>
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
            />

            <Input
                placeholder="Search products..."
                value={userInput}
                className="bg-[#F0F5FF] pl-10 w-full rounded-none"
                onFocus={() => setSearchDropDown(true)}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            {searchDropDown && (
                <Card className="w-full absolute shadow-2xl m-0 p-0 rounded-none">
                    {userInput.length > 0 ? (
                        productsSuggesation.length > 0 ? (
                            productsSuggesation.map((p, index) => (
                                <CardContent key={p._id || p.name} className="p-0">
                                    <p
                                        onClick={() => {
                                            setUserInput(p?.name);
                                            setSearchDropDown(false);
                                            dispatch(fetchSearchProducts(p?.name));
                                            navigate(`/products?search=${encodeURIComponent(p?.name)}`);
                                        }}
                                        className={`p-2 text-sm cursor-pointer ${highlightIndex === index
                                            ? "bg-gray-300"
                                            : "hover:bg-gray-200"
                                            }`}
                                    >
                                        {p?.name}
                                    </p>
                                </CardContent>
                            ))
                        ) : (
                            <CardContent className="p-0">
                                <p className="p-2 text-muted-foreground text-sm">
                                    No Result Found
                                </p>
                            </CardContent>
                        )
                    ) : (
                        <CardContent>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Asus ROG</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Apple iPhone 16</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Samsung S25</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Redmi 14 Pro</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">LG OLED TV 55"</p>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
};

export default SearchBar;
