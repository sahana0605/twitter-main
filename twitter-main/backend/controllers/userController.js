import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        console.log('Registration attempt:', { name, username, email }); // Debug log
        
        // basic validation
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            console.log('User already exists:', existingUser.email); // Debug log
            return res.status(401).json({
                message: existingUser.email === email ? "Email already exists." : "Username already taken.",
                success: false
            })
        }
        
        const hashedPassword = await bcryptjs.hash(password, 16);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        console.log('User created successfully:', user._id); // Debug log

        // Create token
        const tokenData = {
            userId: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "7d" });
        
        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            coverPic: user.coverPic,
            bio: user.bio,
            location: user.location,
            website: user.website,
            verified: user.verified,
            followers: user.followers,
            following: user.following,
            bookmarks: user.bookmarks,
            createdAt: user.createdAt
        };

        return res.status(201)
            .cookie("token", token, { 
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })
            .json({
                message: "Account created successfully.",
                user: userResponse,
                success: true
            })

    } catch (error) {
        console.log('Registration error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email); // Debug log
        
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        };
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email); // Debug log
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', email); // Debug log
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }
        
        console.log('Login successful for:', email); // Debug log
        
        const tokenData = {
            userId: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "7d" });
        
        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            coverPic: user.coverPic,
            bio: user.bio,
            location: user.location,
            website: user.website,
            verified: user.verified,
            followers: user.followers,
            following: user.following,
            bookmarks: user.bookmarks,
            createdAt: user.createdAt
        };
        
        return res.status(200)
            .cookie("token", token, { 
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })
            .json({
                message: `Welcome back ${user.name}`,
                user: userResponse,
                success: true
            })
    } catch (error) {
        console.log('Login error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const logout = (req, res) => {
    console.log('User logout'); // Debug log
    return res.cookie("token", "", { 
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }).json({
        message: "User logged out successfully.",
        success: true
    })
}

export const getMe = async (req, res) => {
    try {
        const userId = req.user;
        console.log('Getting user data for ID:', userId); // Debug log
        
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            console.log('User not found for ID:', userId); // Debug log
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
        console.log('User data retrieved for:', user.email); // Debug log
        
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log('GetMe error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user;
        const { name, username, bio, location, website, profilePic, coverPic } = req.body;
        console.log('Profile update attempt for user:', userId); // Debug log
        
        // Check if username is already taken by another user
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                console.log('Username already taken:', username); // Debug log
                return res.status(400).json({
                    message: "Username already taken.",
                    success: false
                });
            }
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (location !== undefined) updateData.location = location;
        if (website !== undefined) updateData.website = website;
        if (profilePic) updateData.profilePic = profilePic;
        if (coverPic) updateData.coverPic = coverPic;
        
        console.log('Updating profile with data:', updateData); // Debug log
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        ).select("-password");
        
        console.log('Profile updated successfully for:', updatedUser.email); // Debug log
        
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log('Update profile error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const tweetId = req.params.id;
        console.log('Bookmark attempt - User:', loggedInUserId, 'Tweet:', tweetId); // Debug log
        
        const user = await User.findById(loggedInUserId);
        
        if (user.bookmarks.includes(tweetId)) {
            // remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            console.log('Tweet removed from bookmarks'); // Debug log
            return res.status(200).json({
                message: "Removed from bookmarks.",
                success: true
            });
        } else {
            // bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            console.log('Tweet added to bookmarks'); // Debug log
            return res.status(200).json({
                message: "Saved to bookmarks.",
                success: true
            });
        }
    } catch (error) {
        console.log('Bookmark error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('Getting profile for user ID:', id); // Debug log
        
        const user = await User.findById(id).select("-password");
        
        if (!user) {
            console.log('Profile not found for ID:', id); // Debug log
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
        console.log('Profile retrieved for:', user.email); // Debug log
        
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log('Get profile error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getOtherUsers = async (req,res) =>{ 
    try {
         const {id} = req.params;
         console.log('Getting other users, excluding user ID:', id); // Debug log
         
         const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
         if(!otherUsers){
            console.log('No other users found'); // Debug log
            return res.status(401).json({
                message:"Currently do not have any users.",
                success: false
            })
         };
         
         console.log('Found', otherUsers.length, 'other users'); // Debug log
         
         return res.status(200).json({
            otherUsers,
            success: true
        })
    } catch (error) {
        console.log('Get other users error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const follow = async(req,res)=>{
    try {
        const loggedInUserId = req.user; 
        const userId = req.params.id; 
        console.log('Follow attempt - User:', loggedInUserId, 'Following:', userId); // Debug log
        
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);
        
        if (!loggedInUser || !user) {
            console.log('User not found for follow operation'); // Debug log
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$push:{following:userId}});
            console.log('Follow successful'); // Debug log
        }else{
            console.log('User already followed'); // Debug log
            return res.status(400).json({
                message:`User already followed to ${user.name}`,
                success: false
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} just follow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log('Follow error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const unfollow = async (req,res) => {
    try {
        const loggedInUserId = req.user; 
        const userId = req.params.id; 
        console.log('Unfollow attempt - User:', loggedInUserId, 'Unfollowing:', userId); // Debug log
        
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);
        
        if (!loggedInUser || !user) {
            console.log('User not found for unfollow operation'); // Debug log
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
        if(loggedInUser.following.includes(userId)){
            await user.updateOne({$pull:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$pull:{following:userId}});
            console.log('Unfollow successful'); // Debug log
        }else{
            console.log('User not followed yet'); // Debug log
            return res.status(400).json({
                message:`User has not followed yet`,
                success: false
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} unfollow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log('Unfollow error:', error); // Debug log
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}