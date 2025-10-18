import getPostsDB from "../../database/posts/getDB.js";

export const commentPostController = async (req, res) => {
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
        console.error(err);
        res.status(500).json({
            error: "Please try to make a comment again"
        });
    }
}