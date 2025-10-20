import getUsersDB from "../../database/users/getDB.js";

export const bioController = async (req, res, next) => {
    try {
        const DB = await getUsersDB();
        const user = await DB.get("SELECT bio FROM users WHERE id = ?", [req.session.userId]);
        await DB.close();
        res.json({ bio: user.bio });
    } catch (err) {
        next(err);
    }
}