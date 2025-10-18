import getCommentsLikesDB from "../../database/comments-likes/getDB.js"

export const userLikedCommentsController = async (req, res) => {
    try {
        const commentsLikesDB = await getCommentsLikesDB();
        const comments = await commentsLikesDB.all("SELECT comment_id FROM comments_likes WHERE user_id = ?", [Number(req.session.userId)]);
        await commentsLikesDB.close();
        const likedId = comments.map(row => row.comment_id);
        res.json(likedId);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Please try to like the comment again" })
    }
}