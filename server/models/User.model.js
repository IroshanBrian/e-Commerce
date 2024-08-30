import mongoose from 'mongoose';

const User = new mongoose.Schema({
     name: {
          type: String,
          required: [
               true,
               'Please provide a name'
          ]
     },
     email: {
          type: String,
          required: [
               true,
               'Please provide an email'
          ],
          unique: true,
          lowercase: true,
          trim: true,
     },
     password: {
          type: String,
          required: [
               true,
               'Please provide a password'
          ],
          minlength: [8, "Password must be atleast 8 characters long"]
     },
     cartItems: [{
          quantity: {
               type: Number,
               default: 1
          },
          products: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Product'
          }
     }],
     role: {
          type: String,
          default: 'customer',
          enum: ['customer', 'admin']
     }
},
     {
          timestamps: true
     }
);