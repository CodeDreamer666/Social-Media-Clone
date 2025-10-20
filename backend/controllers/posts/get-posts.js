import getPostsDB from "../../database/posts/getDB.js";

export const getPostController = async (req, res, next) => {
    try {
        const DB = await getPostsDB();
        const data = await DB.all("SELECT * FROM posts");
        res.json(data);
    } catch (err) {
        next(err);
    }
}