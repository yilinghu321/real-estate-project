import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User create successfully!');
  } catch (error) {
    next(error);
  }
};
 
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try { 
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credential!'));
    const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
    const { password: p, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { username, email, photo } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
      const { password: p, ...rest } = validUser._doc; 
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({ username: username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email, password: hashedPassword, photo });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
      const { password: p, ...rest } = newUser._doc; 
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({message : "User has been successfully signout!"});
  } catch (error) {
    next(error);
  }
};