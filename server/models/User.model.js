import bcrypt from 'bcryptjs/dist/bcrypt.js';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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

// presave hook to hashpassword before saving 
userSchema.pre("save", async function (next) {
     if (!this.isModified('password')) {
          next();
     }
     try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
     } catch (error) {
          next(error);
     }

})

userSchema.methods.comparePassword = async function (password) {
     return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);


export default User;