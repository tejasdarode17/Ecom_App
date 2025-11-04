import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { fetchSearchProducts } from "@/Redux/productsSlice";
import { useDispatch } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";

const ProductsFilter = () => {
    const [sort, setSort] = useState("relevance");
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const userInput = location?.state?.userInput;

    useEffect(() => {
        dispatch(fetchSearchProducts({ page: 1, sort, query: searchQuery }));
    }, [sort]);

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-amber-500" />
                        Filters
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Refine results for "{searchQuery || userInput}"
                    </p>
                </div>

            </div>

            <Separator className="bg-gray-200" />

            {/* Sort Filter */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">Sort By</Label>
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-gray-400 transition-colors">
                        <SelectValue placeholder="Select sort" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200 shadow-lg">
                        <SelectItem value="relevance" className="focus:bg-amber-50 focus:text-amber-700">Relevance</SelectItem>
                        <SelectItem value="price_low_to_high" className="focus:bg-amber-50 focus:text-amber-700">Price: Low to High</SelectItem>
                        <SelectItem value="price_high_to_low" className="focus:bg-amber-50 focus:text-amber-700">Price: High to Low</SelectItem>
                        <SelectItem value="latest" className="focus:bg-amber-50 focus:text-amber-700">Newest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator className="bg-gray-200" />

            {/* Additional Filters */}
            <Accordion type="single" collapsible className="w-full space-y-2">
                {/* Category */}
                <AccordionItem value="category" className="border border-gray-200 rounded-lg px-4 hover:border-gray-300 transition-colors">
                    <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors py-3">
                        Category
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 pb-4">
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Smartphones</span>
                            <Switch className="data-[state=checked]:bg-amber-500" />
                        </label>
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Laptops</span>
                            <Switch className="data-[state=checked]:bg-amber-500" />
                        </label>
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">TVs</span>
                            <Switch className="data-[state=checked]:bg-amber-500" />
                        </label>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price" className="border border-gray-200 rounded-lg px-4 hover:border-gray-300 transition-colors">
                    <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors py-3">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>₹0</span>
                            <span>₹1,00,000+</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Availability */}
                <AccordionItem value="availability" className="border border-gray-200 rounded-lg px-4 hover:border-gray-300 transition-colors">
                    <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors py-3">
                        Availability
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 pb-4">
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">In Stock</span>
                            <Switch className="data-[state=checked]:bg-amber-500" />
                        </label>
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Out of Stock</span>
                            <Switch className="data-[state=checked]:bg-amber-500" />
                        </label>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm">
                    Apply Filters
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ProductsFilter;