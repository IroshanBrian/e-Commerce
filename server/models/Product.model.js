import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [
               true,
               'Please provide a name'
          ]
     },
     price: {
          type: Number,
          min: 0,
          required: [
               true,
               'Please provide a price'
          ]
     },
     description: {
          type: String,
          required: [
               true,
               'Please provide a description'
          ]
     },
     image: {
          type: String,
          required: [
               true,
               'Please provide an image'
          ]
     },
     category: {
          type: String,
          required: [
               true,
               'Please provide a category'
          ]
     },
     isFeatured: {
          type: Boolean,
          default: false
     }
},
     {
          timestamps: true
     }
);


const Product = mongoose.model('Product', productSchema);
export default Product;