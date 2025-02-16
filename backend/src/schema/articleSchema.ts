import {Schema,model} from "mongoose"

const articleSchema = new Schema({
  // User input required
  title: {
    type:String,
    required:true
  },
  shortDescription: {
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:["published","unpublished"],
    required:true
  },
  category: {
    type:[String],
    required:true
  },
  totalWordCounts:{
    type: Number,
  },
  contentStructureType:{
    type: String,
    enum:["markdown"],
  },
  // User input not-required
  thumbnail: {
    type: {
      fileName: { type: String, default:"" },
      relativePath: { type: String, default:"" },
      mimeType: { type: String, default:"" },
    },
    _id:false,
    default: null
  },
  content:{
    type: {
      fileName: { type: String, default:"" },
      relativePath: { type: String, default:"" },
      mimeType: { type: String, default:"" },
    },
    _id:false,
    default: null
  },
  imageContent:{
    type: [{
      fileName: { type: String, default:"" },
      relativePath: { type: String, default:"" },
      mimeType: { type: String, default:"" },
    }],
    _id:false,
    default: []
  },
  // Server generated data
  userIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  },
  publishedDate: {
    type:String,
  },
  editHistory:{
    date:{
      type:[String],
    },
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
    },
    _id:false,
  },
},{ minimize: false })

export const articleModel = model('articles', articleSchema)

/**
 * https://chatgpt.com/share/67a47cb7-8788-800a-89bd-b2eb3fc2860c
 * 
 */