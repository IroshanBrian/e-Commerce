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
          const product = await Product.create(req.body);
          res.status(201).json({
               product
          })
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

