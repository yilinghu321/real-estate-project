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

export const getListings = async (req, res, next) => {

  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true]};
    }

    let pet = req.query.pet;
    if (pet === undefined || pet === 'false') {
      pet = { $in: [false, true]};
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true]};
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['rent', 'sale']};
    }

    let parking = parseInt(req.query.parking) || 0;
    parking = { $gte: parking};
    
    let bedroom = parseInt(req.query.bedroom) || 0;
    bedroom = { $gte: bedroom};
    

    let bathroom = parseInt(req.query.bathroom) || 0;
    bathroom = { $gte: bathroom};

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i'},
      offer,
      type,
      furnished,
      parking,
      pet,
      bedroom,
      bathroom,
    }).sort(
      {[sort]: order}
    ).limit(limit).skip(startIndex);

    return res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
}