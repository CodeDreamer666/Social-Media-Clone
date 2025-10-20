import getPostsDB from "../../database/posts/getDB.js";

export const commentPostController = async (req, res, next) => {
    try {
        const postsDB = await getPostsDB();
        const { postId } = req.params;
        const post = await postsDB.get(
            "SELECT * FROM posts WHERE id = ?",
            [Number(postId)]

        );
        await postsDB.close();
        res.json([post]);
    } catch (err) {
        next(err);
    }
}