import getCommentsDB from "../../database/comments/getDB.js";

export const getCommentsController = async (req, res) => {
    try {
        const { postId } = req.params;
        const commentsDB = await getCommentsDB();
        const data = await commentsDB.all(
            "SELECT * FROM comments WHERE post_id = ?",
            [Number(postId)]
        );
        await commentsDB.close();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to get the post"
        })
    }
}