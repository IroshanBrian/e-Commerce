import Coupon from "../models/coupon.model"

export const getCoupon = async (req, res) => {
     try {
          const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
          res.json(coupon || null);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
}

export const validateCoupon = async (req, res) => {
     try {
          const { code } = req.body;
          const coupon = await Coupon.findOne({ code: code, userId: user._id, isActive: true });

          if (!coupon) {
               return res.status(404).json({ message: "Coupon not found" });
          }

          if (coupon.expirationDate < new Date()) {
               coupon.isActive = false;
               await coupon.save();
               return res.status(404).json({ message: "Coupon is expired" });
          }
          res.json({
               message: "Coupon is valid",
               discountPercentage: coupon.discountPercentage,
               code: coupon.code
          })
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
}