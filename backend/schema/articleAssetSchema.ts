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
  content:{
    type : Schema.Types.Mixed,
    required: true,
  },
  totalWordCounts:{
    type: Number,
    required: true,
  }
},{ minimize: false })

export const articleAssetModel = model('article-asset', articleAssetSchema)