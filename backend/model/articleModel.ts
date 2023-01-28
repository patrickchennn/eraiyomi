import mongoose from "mongoose"

const replySchema = new mongoose.Schema({
  uniqueAccountId:{
    name: String,
    profilePict: String,
    email:String,
    numberOfLikes: Number,
    numberOfDislikes: Number,
    replyMsg: String,
    replyDate: String,
    editDate:{default:null, type:String},
  }
},{ _id : false,minimize: false  })

const commentSchema = new mongoose.Schema({
  uniqueAccountId:{
    name: String,
    profilePict: String,
    email:String,
    numberOfLikes: Number,
    numberOfDislikes: Number,
    commentMsg: String,
    commentDate: String,
    editDate:{default:null, type:String},
    replies:{default:{}, type:replySchema}
  }
},{ _id : false,minimize: false })

const articleSchema = new mongoose.Schema({
  path: String,
  titleArticle: String,
  shortDescription: String,
  publishedDate: String,
  publishedDateVerbose: String,
  numberOfLikes:Number,
  likes:{},
  author: String,
  keywords: [String],
  comments: {}

},{ minimize: false })

export const articleModel = mongoose.model('articles', articleSchema)