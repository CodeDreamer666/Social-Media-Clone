import getUsersDB from "../../database/users/getDB.js";

export const meController = async (req, res, next) => {
    try {
        const DB = await getUsersDB();
        const user = await DB.get("SELECT username FROM users WHERE id = ?", [req.session.userId]);
        await DB.close();
        res.json({ username: user.username, isLoggedIn: true });
    } catch (err) {
        err.username = "Guest";
        err.isLoggedIn = false;
        next(err);
    }
}