import getPostsDB from "../../database/posts/getDB.js";

export const getPostController = async (req, res) => {
    const DB = await getPostsDB();
    const data = await DB.all("SELECT * FROM posts");
    res.json(data);
}