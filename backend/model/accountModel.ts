import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({

},{ minimize: false })



export const articleModel = mongoose.model('articles', articleSchema)