// Get all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const UserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count of unread messages for each user
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const count = await Message.find({ senderId: user._id, receiverId: UserId, seen: false }).countDocuments();
            unseenMessages[user._id] = count;
        }
        );}
        catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }   
    }