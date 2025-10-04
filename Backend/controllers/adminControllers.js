import Admin from "../model/adminModel.js";
import bcrypt from "bcrypt"
import Category from "../model/categoryModel.js";
import Seller from "../model/sellerModel.js";
import slugify from "slugify";
import { deleteImage } from "../utils/cloudinaryHandler.js";
import deleteProductsByCategory from "../utils/deleteCategoriesProduct.js";
import Carousel from "../model/carouselModel.js";
import Bannner from "../model/bannerModel.js";

async function createAdmin(req, res) {

    const adminName = "Tejas Darode"
    const adminEmail = "tejasdarode17@gmail.com"
    const adminPasword = "1234"
    const role = "admin"


    const exists = await Admin.findOne({ email: adminEmail });

    if (exists) {
        console.log("✅ Admin already exists");
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPasword, 10)

    const admin = await Admin.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: role
    })

    console.log("🎉 Admin created:", admin.email);
    process.exit(0);

}

//-----------------Categories Controllers----------------------------
export async function createCatogery(req, res) {
    try {
        const { name, image, description, } = req.body

        const adminID = req.user.id

        if (!name || !image) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }


        const admin = await Admin.findById(adminID);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const slug = slugify(name, { lower: true, strict: true });
        const existing = await Category.findOne({ slug });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const newCategory = await Category.create({
            name,
            slug,
            description,
            image
        })

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function getAllCategories(req, res) {

    try {

        const categories = await Category.find()

        return res.status(201).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }

}

export async function editCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, image, description } = req.body;
        const adminID = req.user.id;

        const admin = await Admin.findById(adminID);

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        if (name) {
            category.name = name;
            category.slug = slugify(name, { lower: true, strict: true });
        }

        if (description) category.description = description;

        if (image && image.url && image.public_id) {
            if (category.image.public_id !== image.public_id) {
                await deleteImage(category.image.public_id);
                category.image = image;
            }
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function deleteCatogery(req, res) {
    try {

        const { id } = req.params
        const adminID = req.user.id

        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const admin = await Admin.findById(adminID);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        await deleteProductsByCategory(id)

        if (category?.image?.public_id) {
            await deleteImage(category?.image?.public_id)
        }

        await Category.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category and all its products deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}



//-----------------Admin Manage Sellers----------------------------

export async function getAllSellers(req, res) {
    try {
        const adminID = req.user.id;
        const admin = await Admin.findById(adminID);
        const { status, page, limit } = req.query;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        let query = {};
        if (status && status !== "all") {
            query.status = status;
        }

        const sellers = await Seller.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Seller.countDocuments(query);

        return res.status(200).json({
            success: true,
            message: "Sellers fetched successfully",
            sellers,
            total,
            page: Number(page),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function getSelectedSeller(req, res) {

    try {

        const { id } = req.params
        const { role } = req.user
        const adminID = req.user.id

        if (!adminID || role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const seller = await Seller.findById(id)
            .populate({
                path: "products",
                populate: {
                    path: "category"
                }
            })

        if (!seller) {
            return res.status(403).json({ success: false, message: "seller not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Seller Fetched successfully",
            seller
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function changeSellerStatus(req, res) {
    try {
        const { id } = req.params
        const { role } = req.user
        const adminID = req.user.id
        const { newStatus } = req.body

        if (!adminID || role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const seller = await Seller.findByIdAndUpdate(id, { status: newStatus }, { new: true })

        if (!seller) {
            return res.status(403).json({ success: false, message: "seller not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Seller stauts changed",
            seller
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}



//-----------------Carousel controllers----------------------------

export async function createCarousel(req, res) {
    try {
        const { title, images } = req.body;
        const adminID = req.user.id;

        if (!adminID || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const carousel = await Carousel.findOne({ title });
        if (carousel) {
            return res.status(400).json({
                success: false,
                message: "Carousel with same title already exists. Please change the title.",
            });
        }

        const newCarousel = await Carousel.create({
            title,
            images,
        });

        return res.status(201).json({
            success: true,
            message: "Carousel created successfully",
            carousel: newCarousel
        });

    } catch (error) {
        //we can run deleteImages() function here if error come while adding carousel cuz image is already uplaoded in cloudnary
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchCarousel(req, res) {
    try {
        const carousels = await Carousel.find();
        if (!carousels) {
            return res.status(400).json({
                success: false,
                message: "Carousels not found.",
            });
        }
        return res.status(201).json({
            success: true,
            message: "Carousel fetched successfully",
            carousels: carousels
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function editCarousel(req, res) {

    try {
        const { images, title } = req.body
        const adminID = req.user.id
        const { id } = req.params

        if (!adminID || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const carousel = await Carousel.findById(id);
        if (!carousel) {
            return res.status(400).json({
                success: false,
                message: "Carousel not exists.",
            });
        }

        if (title && title !== carousel.title) {
            const exists = await Carousel.findOne({ title });
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Carousel with same title already exists.",
                });
            }
            carousel.title = title;
        }

        // id of all the newiamges which is coming as a req
        const incomingPublicIds = images.map(img => img.public_id);
        //if dbImages id is not present in the incomingPublicIds then it means it is deleted from frontend and we can delete here in db too
        const imagesToDelete = carousel.images.filter(
            img => !incomingPublicIds.includes(img.public_id)
        );
        //we can store all the public if in an array using map and use deleteImages()
        for (let img of imagesToDelete) {
            await deleteImage(img.public_id);
        }

        carousel.images = images
        await carousel.save()
        return res.status(201).json({
            success: true,
            message: "Carousel updated successfully",
            carousel: carousel
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function deleteCarousel(req, res) {

    try {
        const adminID = req.user.id
        const { id } = req.params

        if (!adminID || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const carousel = await Carousel.findById(id)

        if (!carousel) {
            return res.status(400).json({
                success: false,
                message: "Banner not found.",
            });
        }

        if (carousel?.images.length > 0) {
            for (const image of carousel?.images) {
                await deleteImage(image?.public_id)
            }
        }

        await Carousel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Banner Deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}



//-----------------Banner Controllers----------------------------

export async function createBanner(req, res) {

    try {
        const { type, image, link } = req.body

        const adminID = req.user.id

        if (!adminID || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const existingBanner = await Bannner.findOne({ type })

        if (existingBanner) {
            return res.status(400).json({
                success: false,
                message: "This banner already exist please delete that or edit that",
            });
        }

        const banner = await Bannner.create({
            type,
            image,
            link
        })

        return res.status(201).json({
            success: true,
            message: "Banner Created successfully",
            banner
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchBanners(req, res) {
    try {

        const banners = await Bannner.find()

        if (!banners) {
            return res.status(400).json({
                success: false,
                message: "Banners not found.",
            });
        }

        return res.status(201).json({
            success: true,
            message: "banners fetched successfully",
            banners
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function deleteBanner(req, res) {

    try {
        const adminID = req.user.id
        const { id } = req.params

        if (!adminID || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const banner = await Bannner.findById(id)

        if (!banner) {
            return res.status(400).json({
                success: false,
                message: "Banner not found.",
            });
        }

        if (banner?.image?.public_id) {
            await deleteImage(banner?.image?.public_id)
        }

        await Bannner.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Banner Deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}



