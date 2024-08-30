import jwt from 'jsonwebtoken';
import User from '../models/User.model.js'
import { redis } from '../lib/redis.js';

const generateTokens = (userId) => {
     const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
     const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
     return { accessToken, refreshToken };
}

const setCookies = (res, accessToken, refreshToken) => {
     res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
     });

     res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
     });
}

const storeRefreshToken = async (userId, refreshToken) => {
     await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60)
}

export const signup = async (req, res) => {
     try {
          const { email, password, name } = req.body;
          const userExists = await User.findOne({ email });
          if (userExists) {
               res.status(400).json({
                    message: 'User already exists'
               })
          } else {

               const user = await User.create({
                    name,
                    email,
                    password
               });

               const { accessToken, refreshToken } = generateTokens(user._id);
               await storeRefreshToken(user._id, refreshToken);

               setCookies(res, accessToken, refreshToken);

               res.status(201).json({
                    message: 'User created successfully'
               });
          }
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const login = async (req, res) => {
     try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (user && await user.comparePassword(password)) {
               const { accessToken, refreshToken } = generateTokens(user._id);
               await storeRefreshToken(user._id, refreshToken);

               setCookies(res, accessToken, refreshToken);

               res.status(200).json({
                    message: 'User logged in successfully'
               });
          }
          else {
               res.status(401).json({
                    message: 'Invalid credentials'
               });
          }
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}

export const logout = async (req, res) => {
     try {
          const refreshToken = req.cookies.refreshToken;
          if (refreshToken) {
               const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
               await redis.del(`refresh_token:${decode.userId}`);
          }
          res.clearCookie('accessToken');
          res.clearCookie('refreshToken');
          res.status(200).json({
               message: 'User logged out successfully'
          });
     } catch (error) {
          res.status(500).json({
               message: error.message
          })
     }
}