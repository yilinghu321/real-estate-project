import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type : String,
    required: true,
    unique: true,
  },
  email: {
    type : String,
    required: true,
    unique: true,
  },
  password: {
    type : String,
    required: true,
  },
  photo: {
    type : String,
    default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonduck.com%2Ficons%2F180867%2Fprofile-circle&psig=AOvVaw2fHVWJZHdaELAZLOowGgNX&ust=1710921664663000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPicqYLu_4QDFQAAAAAdAAAAABAE"
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;