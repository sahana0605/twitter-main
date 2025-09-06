import express from "express";
import { Login, Register, bookmark, follow, getMyProfile, getPublicProfile, getOtherUsers, logout, unfollow, getMe, updateProfile } from "../controllers/userController.js";
import { Activity } from "../models/activitySchema.js";
import isAuthenticated from "../config/auth.js";
import { User } from "../models/userSchema.js";

const router = express.Router();

// Test route to check database and view all users (remove in production)
router.route("/test").get(async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        console.log('Test route - Found users:', users.length);
        const latestActivities = await Activity.find({}).sort({ createdAt: -1 }).limit(10).lean();
        res.json({
            message: "Database connection successful!",
            userCount: users.length,
            users: users,
            latestActivities,
            envCheck: {
                TOKEN_SECRET: !!process.env.TOKEN_SECRET,
                TOKEN_SECRET_LENGTH: process.env.TOKEN_SECRET?.length || 0,
                NODE_ENV: process.env.NODE_ENV,
                PORT: process.env.PORT
            }
        });
    } catch (error) {
        console.log('Test route error:', error);
        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMe);
router.route("/update-profile").put(isAuthenticated, updateProfile);
router.route("/bookmark/:id").put(isAuthenticated, bookmark)
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/public-profile/:id").get(getPublicProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);

// activity feed for the authenticated user
router.route("/activity").get(isAuthenticated, async (req, res) => {
    try {
        const activities = await Activity.find({
            $or: [
                { actorId: req.user },
                { targetUserId: req.user }
            ]
        }).sort({ createdAt: -1 }).limit(50).lean();
        res.json({ success: true, activities });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to load activity" });
    }
});

export default router;