import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";
import { Activity } from "../models/activitySchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required.",
                success: false
            });
        };
        // Profanity/violation moderation with word-boundary regex (extendable)
        const violationPatterns = [
            /\b(fuck|f\*+k|fxxk)\b/i,
            /\b(shit|s\*+t)\b/i,
            /\b(bitch|b!tch|b1tch)\b/i,
            /\b(asshole|a\*+hole)\b/i,
            /\b(dick|d!ck|d1ck)\b/i,
            /\b(rape|rapist)\b/i,
            /\b(kill|murder)\b/i,
            /\b(hate|hatred)\b/i,
            /\b(racist|racism|slur)\b/i,
            /\b(terror|terrorist)\b/i,
            /\b(violence|violent)\b/i,
            /\b(abuse|abusive)\b/i
        ];
        if (violationPatterns.some((re) => re.test(description))) {
            return res.status(400).json({
                message: "Your tweet contains prohibited language.",
                success: false
            });
        }
        const user = await User.findById(id).select("-password").lean();
        const tweet = await Tweet.create({
            description,
            userId: id,
            userDetails: user
        });
        await Activity.create({
            type: "tweet_created",
            actorId: id,
            tweetId: tweet._id,
            metadata: { descriptionLength: description.length }
        });
        return res.status(201).json({
            message: "Tweet created successfully.",
            success: true,
            tweet
        })
    } catch (error) {
        console.log(error);
    }
}
export const deleteTweet = async (req,res) => {
    try {
        const {id}  = req.params;
        await Tweet.findByIdAndDelete(id);
        await Activity.create({
            type: "tweet_deleted",
            actorId: req.user,
            tweetId: id
        })
        return res.status(200).json({
            message:"Tweet deleted successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likeOrDislike = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId).lean();
        if(tweet.like.includes(loggedInUserId)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});
            await Activity.create({
                type: "tweet_unliked",
                actorId: loggedInUserId,
                tweetId
            });
            return res.status(200).json({
                message:"User disliked your tweet."
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            await Activity.create({
                type: "tweet_liked",
                actorId: loggedInUserId,
                tweetId
            });
            return res.status(200).json({
                message:"User liked your tweet."
            })
        }
    } catch (error) {
        console.log(error);
    }
};
export const getAllTweets = async (req,res) => {
    // loggedInUser ka tweet + following user tweet
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id).lean();
        const loggedInUserTweets = await Tweet.find({ userId: id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        const followingUserTweet = await Promise.all(
            (loggedInUser.following || []).map((otherUsersId) => {
                return Tweet.find({ userId: otherUsersId })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .lean();
            })
        );
        return res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweet),
        })
    } catch (error) {
        console.log(error);
    }
}
export const getFollowingTweets = async (req,res) =>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id).lean(); 
        const followingUserTweet = await Promise.all(
            (loggedInUser.following || []).map((otherUsersId)=>{
                return Tweet.find({ userId: otherUsersId })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .lean();
            })
        );
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        });
    } catch (error) {
        console.log(error);
    }
}
 