import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  name: {
    type : String,
    required: true,
  },
  description: {
    type : String,
    required: true,
  },
  address: {
    type : String,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  bathRoom: {
    type: Number,
    required: true,
  },
  bedRoom: {
    type: Number,
    required: true,
  },
  furnished: {
    type: Boolean,
    required: true,
  },
  parking: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  pet: {
    type: Boolean,
    required: true,
  },
  offer: {
    type: Boolean,
    required: true,
  },
  imageUrls: {
    type : Array,
    required: true,
  },
  userRef: {
    type: String,
    required: true,
  }
}, {timestamps: true});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;