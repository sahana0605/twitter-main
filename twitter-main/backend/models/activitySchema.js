import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    type: { type: String, enum: ["tweet_created", "tweet_deleted", "tweet_liked", "tweet_unliked"], required: true },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: { type: Object, default: {} }
},{ timestamps: true });

activitySchema.index({ actorId: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });

export const Activity = mongoose.model("Activity", activitySchema);




