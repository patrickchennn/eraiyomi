import {Schema,model} from "mongoose"

const articleAssetSchema = new Schema({
  articleIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'articles',
    required:true,
  },
  thumbnail: {
    type: {
      _id: { type: Boolean, default: false },
      fileName: { type: String, required: true },
      relativePath: { type: String, required: true },
      mimeType: { type: String, required: true },
    },
    default: null, // Set default to `null` if no object is provided
    required: false,
  },
  contentStructureType:{
    type: String,
    enum:["markdown",null],
    default:null,
  },
  content:{
    type : Schema.Types.Mixed,
  },
  totalWordCounts:{
    type: Number,
  }
},{ minimize: false })

export const articleAssetModel = model('article-asset', articleAssetSchema)