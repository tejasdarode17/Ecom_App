import Seller from "../model/sellerModel.js";
import Product from "../model/productModel.js";




export async function addProduct(req, res) {

    const { name, category, image, brand, description, stock, price, salePrice } = req.body

    const sellerID = req.user.id

    try {

        if (!name || !category || !brand || !description || !stock || !price) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }

        if (!image || !image.url || !image.public_id) {
            return res.status(400).json({ message: "Image data is missing" });
        }

        const seller = await Seller.findOne({ _id: sellerID })
        console.log(seller);

        if (!seller || !seller.role == "seller") {
            return res.status(400).json({
                success: false,
                message: "You are not authorized or you are not seller "
            })
        }

        const newProduct = new Product({
            name,
            category,
            image,
            brand,
            description,
            stock,
            price,
            salePrice,
            seller: sellerID
        })

        await newProduct.save()

        return res.status(200).json({
            success: true,
            message: "product added succesfully",
            product: newProduct
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}




export async function getAllSellerProducts(req, res) {

    try {
        const sellerId = req.user.id

        const seller = await Seller.findOne({ _id: sellerId })

        if (!seller || !seller.role == "seller") {
            return res.status(400).json({
                success: false,
                message: "You are not authorized or you are not seller "
            })
        }

        const products = await Product.find({ seller: sellerId }).populate("seller", "username email");


        return res.status(200).json({
            success: true,
            message: "product fetched succesfully",
            products: products
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}