import {Schema,model} from "mongoose"

const commentSchema = new Schema({
  articleIdRef:{
    type: Schema.Types.ObjectId, 
    ref: 'articles',
    require:true,
  },
  totalCommentsCount:{
    type:Number,
    default:0,
    require:true
  },
  items:[{
    displayName: {
      type:String,
      require:true,
    },
    profilePictureUrl: {
      type:String||null,
      require:true,
    },
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
      require:true,
    },
    publishedAt: {
      type:String,
      require:true,
    },
    updatedAt:{
      type:String,
      default:null, 
    },
    totalRepliesCount: {
      type:Number,
      default:0
    }
  }]
},{ minimize: false })

export const commentModel = model('comments', commentSchema)
