import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test =  (req, res) => {
  res.send("hello world123");
}

export const updateUserInfo = async(req, res, next) => {
  if (req.user.id !== req.params['id']) next(errorHandler(400, 'Update only available on your own account!'));
  try {
    if (req.body.username && (req.body.username !== req.user.username)) {
      const dupUsername = await User.find({username : req.body.username});
      if (dupUsername.length > 0) {
        next(errorHandler(300, 'Failed! Username exists.'));
        return;
      }
    }
    if (req.body.email && req.body.email !== req.user.username) {
      const dupEmail = await User.find({email : req.body.email});
      if (dupEmail.length > 0) {
        next(errorHandler(300, 'Failed! Email exists.'));
        return;
      }
    }
    if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params['id'], {
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
  if (req.user.id !== req.params['id']) next(errorHandler(400, 'Not able to signout others\' account!'));
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('access_token');
    res.status(200).json({message : "User has been successfully deleted!"});
  } catch (error) {
    next(error);
  }
}