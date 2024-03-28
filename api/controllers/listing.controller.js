import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
     const listing = await Listing.create(req.body);
     return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    console.log(listing)
    if (!listing) {
      return next(errorHandler(404, "Listing is not found!"));
    }

    if (req.user.id != listing.userRef) {
      return next(errorHandler(303, "You can only delete your own listings!"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(201).json({message : "Your listing has been successfully deleted!"});
  } catch (error) {
    next(error);
  }
}

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    console.log(listing)
    if (!listing) {
      return next(errorHandler(404, "Listing is not found!"));
    }

    if (req.user.id != listing.userRef) {
      return next(errorHandler(303, "You can only change your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id, req.body, { new : true }
    );
    res.status(201).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

export const getListing = async(req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    console.log(listing)
    if (!listing) {
      return next(errorHandler(404, "Listing is not found!"));
    }
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}