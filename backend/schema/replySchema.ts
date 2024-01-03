import { Schema, model } from "mongoose";

const replySchema = new Schema({
  articleIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'articles' 
  },
  commentsIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'articles'
  },
  items:[{
    parentCommentId: {
      type:String,
      require: true
    },
    replies:[{
      _id:false,
      replyId:{
        type:String,
        require:true
      },
      displayName: {
        type:String,
        require:true
      },
      profilePictureUrl: String,
      userId:{
        type:String,
        require:true,
      },
      like:{
        likeCount:{
          type:Number,
          require:true,
          default:0
        },
        users:Schema.Types.Mixed
      },
      message: {
        type:String,
        require:true
      },
      publishedAt: {
        type:String,
        require:true
      },
      updatedAt:{type:String},
    }],
    _id:false
  }]
},{ minimize: false  })

export const replyModel = model('replies', replySchema)