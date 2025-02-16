import { Schema, model } from "mongoose";


const userSchema = new Schema({
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
    required: true,
  },
  name:{
    type:String,
    required: true,
  },
  profilePictureUrl:{
    type: String,
    default:""
  },
  articleIdRef:{
    type: [Schema.Types.ObjectId], 
    ref: 'articles',
    required: true
  }
});

export const userModel = model('user', userSchema);