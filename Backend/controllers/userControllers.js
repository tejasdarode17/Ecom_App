import Product from "../model/productModel.js";

export async function fetchSearchSuggestions(req, res) {
    try {
        const { search } = req.query;

        if (!search) {
            return res.json({ success: true, suggestions: [] });
        }

        const products = await Product.find(
            { name: { $regex: search, $options: "i" } },
            { name: 1 }
        ).limit(10);

        return res.json({
            success: true,
            products,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function fetchSearchProducts(req, res) {
    try {
        const { search } = req.query;

        if (!search) {
            return res.json({ success: true, products: [] })
        }
        const products = await Product.find({ name: { $regex: search, $options: "i" } });

        if (!products.length) {
            return res.status(404).json({
                success: false,
                message: "No products found",
            });
        }

        return res.json(
            {
                success: true,
                products
            }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}



