import getCommentsDB from "../../database/comments/getDB.js"
import getUsersDB from "../../database/users/getDB.js"
import getPostsDB from "../../database/posts/getDB.js"
import sanitizeHtml from "sanitize-html";

export const makeCommentController = async (req, res, next) => {
    try {
        const commentsDB = await getCommentsDB();
        const usersDB = await getUsersDB();
        const postsDB = await getPostsDB();
        const { postId } = req.params;
        let { comment } = req.body;

        comment = comment.trim();

        if (!comment) {
            return res.status(401).json({ error: "All fields are required" })
        }

        const cleanComment = sanitizeHtml(comment, {
            allowedAttributes: {},
            allowedTags: []
        });

        const post = await postsDB.get("SELECT username FROM posts WHERE id = ?", [Number(postId)])
        const user = await usersDB.get("SELECT username FROM users WHERE id = ?", [Number(req.session.userId)])
        await commentsDB.run("INSERT INTO comments (username, user_id, post_id, comment) VALUES (?, ?, ?, ?)", [user.username, Number(req.session.userId), Number(postId), cleanComment])

        await usersDB.close();
        await postsDB.close();
        await commentsDB.close();

        res.status(201).json({ message: `You’ve successfully commented on ${post.username}’s post.` })
    } catch (err) {
        next(err);
    }
}