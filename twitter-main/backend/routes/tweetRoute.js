import express from "express";
import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, getPublicTweets, getPublicUserTweets, likeOrDislike } from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
 
router.route("/create").post(isAuthenticated,createTweet);
router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
router.route("/like/:id").put(isAuthenticated,likeOrDislike);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
router.route("/public").get(getPublicTweets);
router.route("/public-user-tweets/:id").get(getPublicUserTweets);
export default router;