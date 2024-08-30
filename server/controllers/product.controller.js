import redis from "ioredis";
import Product from "../models/Product.model.js";

export const getAllProducts = async (req, res) => {
     try {
          const products = await Product.find({});
          res.status(200).json({
               products
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const getProductById = async (req, res) => {
     try {
          const product = await Product.findById(req.params.id);
          res.status(200).json({
               product
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const createProduct = async (req, res) => {
     try {
          const { name, description, price, image, category } = await Product.create(req.body);
          let cloudinaryResponse = null;
          if (image) {
               cloudinaryResponse = await cloudinary.uploader.upload(image, {
                    folder: 'products'
               });
          }
          const product = await Product.create({
               name,
               description,
               price,
               image: cloudinaryResponse.secure_url,
               category
          });
          res.status(201).json({
               product
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const getFeaturedProducts = async (req, res) => {
     try {
          let featuredProducts = await redis.get("featured_products");
          if (featuredProducts) {
               return res.status(200).json({
                    products: JSON.parse(featuredProducts)
               })
          }

          featuredProducts = await Product.find({ isFeatured: true }).lean();

          if (!featuredProducts) {
               return res.status(404).json({
                    message: "No featured products found"
               });
          }
          await redis.set("featured_products", JSON.stringify(featuredProducts));

          res.json(featuredProducts);
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const deleteProduct = async (req, res) => {
     try {
          const product = await Product.findById(req.params.id);
          if (!product) {
               return res.status(404).json({
                    message: "Product not found"
               })
          }
          if (product.image) {
               const public_id = product.image.split("/").pop().split(".")[0];
               try {
                    await cloudinary.uploader.destroy(`products/${public_id}`);
               } catch (error) {
                    res.status(500).json({
                         message: error.message
                    })
               }
          }
          await product.findByIdAndDelete(req.params.id);
          res.status(200).json({
               message: "Product removed"
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const getRecommendations = async (req, res) => {
     try {
          const products = await Product.aggregate([
               {
                    $sample: { size: 3 }
               },
               {
                    $project: {
                         _id: 1,
                         name: 1,
                         description: 1,
                         price: 1,
                         image: 1
                    }
               }
          ])
          res.status(200).json({
               products
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const getProductsByCategory = async (req, res) => {
     const { category } = req.params;
     try {
          const products = await Product.find({
               category
          });
          res.status(200).json({
               products
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const toggleFeaturedProducts = async (req, res) => {
     try {
          const product = await Product.findById(req.body.id);
          if (product) {
               product.isFeatured = !product.isFeatured;
               const updatedProduct = await product.save();
               await updateFeaturedProductsCache();
               res.json(updatedProduct);
          }
          await product.save();
          res.status(200).json({
               message: "Product updated"
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const updateFeaturedProductsCache = async (req, res) => {
     try {
          const featuredProducts = await Product.find({ isFeatured: true }).lean();
          await redis.set("featured_products", JSON.stringify(featuredProducts));
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}




