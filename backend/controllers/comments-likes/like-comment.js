import getCommentsLikesDB from "../../database/comments-likes/getDB.js"
import getCommentsDB from "../../database/comments/getDB.js"
import getUsersDB from "../../database/users/getDB.js"

export const likeCommentController = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                error: "Please sign in or login to like the comment"
            })
        }
        const { commentId } = req.params;
        const commentsLikesDB = await getCommentsLikesDB();
        const commentsDB = await getCommentsDB();
        const usersDB = await getUsersDB();

        const isLiked = await commentsLikesDB.get(
            "SELECT * FROM comments_likes WHERE comment_id = ? AND user_id = ?",
            [Number(commentId), Number(req.session.userId)]
        );
        const user = await usersDB.get(
            "SELECT username FROM users WHERE id = ?",
            [Number(req.session.userId)]
        );

        if (isLiked) {
            await commentsLikesDB.run(
                "DELETE FROM comments_likes WHERE comment_id = ? AND user_id = ?",
                [Number(commentId), Number(req.session.userId)]
            );
            await commentsDB.run(
                "UPDATE comments SET likes = likes - 1 WHERE id = ?",
                [Number(commentId)]
            );

            const updatedComment = await commentsDB.get(
                "SELECT likes FROM comments WHERE id = ?",
                [Number(commentId)]
            );

            await commentsDB.close();
            await commentsLikesDB.close();
            await usersDB.close();

            return res.json({
                message: `You had unliked ${user.username}'s comment `,
                likes: updatedComment.likes
            });
        } else {
            await commentsLikesDB.run(
                "INSERT INTO comments_likes (comment_id, user_id) VALUES (?, ?)",
                [Number(commentId), Number(req.session.userId)]
            );
            await commentsDB.run(
                "UPDATE comments SET likes = likes + 1 WHERE id = ?",
                [Number(commentId)]
            );

            const updatedComment = await commentsDB.get(
                "SELECT likes FROM comments WHERE id = ?",
                [Number(commentId)]
            );
            
            await commentsDB.close();
            await commentsLikesDB.close();
            await usersDB.close();

            return res.json({
                message: `You had successfully liked ${user.username}'s comment `,
                likes: updatedComment.likes
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Please sign in or login to like the comment" })
    }
}