import {Schema,model} from "mongoose"

const articleAssetSchema = new Schema({
  articleIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'articles',
    required:true,
  },
  thumbnail:{
    _id:false,
    fieldName: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    size: Number,
    dataURL: String,
    default:{}
  },
  contentStructureType:{
    type: String,
    default:"",
  },
  content:{
    type : Schema.Types.Mixed,
  },
  totalWordCounts:{
    type: Number,
  }
},{ minimize: false })

export const articleAssetModel = model('article-asset', articleAssetSchema)