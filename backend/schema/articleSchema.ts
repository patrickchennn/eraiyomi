import {Schema,model} from "mongoose"

const articleSchema = new Schema({
  titleArticle: {
    type:{
      title: {
        type:String,
        required: true,
      },
      URLpath: {
        type: String,
        required: true
      },
    },
    _id:false,
    required: true,
  },
  shortDescription: {
    type:String,
    required: true
  },
  publishedDate: {
    type:String,
    required: true
  },
  status:{
    type:String,
    enum:["published","unpublished"],
    required: true
  },
  editHistory:{
    date:{
      type:[String],
      required:true
    }
  },
  likeDislike: {
    type:{
      totalLike: {
        type:Number,
        default:0
      },
      totalDislike: {
        type:Number,
        default:0
      },
      users: {
        type: [{
          email: {
            type:String,
          },
          statusRate:{
            type:Boolean,
          },
          
        }],
      },
    },
    _id:false,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  category: {
    type:[String],
    required: true
  },
  articleAssetIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'article-asset',
    required: true
  }
},{ minimize: false })

export const articleModel = model('articles', articleSchema)