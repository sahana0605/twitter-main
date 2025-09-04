import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userDetails:{
        type:Array,
        default:[]
    },
},{timestamps:true});

// Indexes to speed up common queries
tweetSchema.index({ userId: 1, createdAt: -1 });
tweetSchema.index({ createdAt: -1 });
export const Tweet = mongoose.model("Tweet", tweetSchema);