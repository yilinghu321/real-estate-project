import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from '../models/listing.model.js'

export const test =  (req, res) => {
  res.send("hello world123");
}

export const updateUserInfo = async(req, res, next) => {
  if (req.user.id !== req.params['id']) next(errorHandler(400, 'Update only available on your own account!'));
  try {
    if (req.body.username && (req.body.username !== req.user.username)) {
      const dupUsername = await User.find({username : req.body.username});
      if (dupUsername.length > 0) {
        return next(errorHandler(300, 'Failed! Username exists.'));
      }
    }
    if (req.body.email && req.body.email !== req.user.username) {
      const dupEmail = await User.find({email : req.body.email});
      if (dupEmail.length > 0) {
        return next(errorHandler(300, 'Failed! Email exists.'));
      }
    }
    if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        photo: req.body.photo,
      }
    }, {new : true}); 
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) { 
    next(error);
  }
} 

export const deleteUser = async(req, res, next) => {
  if (req.user.id !== req.params['id']) {
    return next(errorHandler(400, 'Not able to delete others\' account!'));
  }
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('access_token');
    res.status(200).json({message : "User has been successfully deleted!"});
  } catch (error) {
    next(error);
  }
}

export const getUserListing = async(req, res, next) => {
  if (req.user.id !== req.params['id']) {
    return next(errorHandler(400, 'You can only view your own listings.'));
  }
  try {
    const listings = await Listing.find({userRef : req.user.id});
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const getLandlordUser = async (req, res, next) => {
  try {
    const listingUser = await User.findById(req.params.id);
    if (!listingUser) {
      return next(errorHandler(404, "The landlord no longer exists."));
    }
    const { password:p, ...rest } = listingUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}