import getLikesDB from "../../database/likes/getDB.js";

export const userLikePostsController = async (req, res, next) => {
    try {
        const likesDB = await getLikesDB();
        const userLikePost = await likesDB.all("SELECT post_id FROM likes WHERE user_id = ?", [req.session.userId]);
        await likesDB.close();
        const likedId = userLikePost.map(post => post.post_id)
        res.json(likedId);
    } catch (err) {
        next();
    }
}