import { Schema, model } from "mongoose";


const userSchema = new Schema({
  userId:{
    type: String,
    unique:true,
    require:true
  },
  name:{
    type:String,
    default:"",
  },
  username: {
    type: String,
    unique: true, // Ensures usernames are unique
    required: true,
  },
  email: {
    type: String,
    unique: true, // Ensures email addresses are unique
    required: true,
  },
  password: {
    type: String,
  },
  profilePictureUrl:{
    type: String,
    default:""
  }
});

export const userModel = model('user', userSchema);
