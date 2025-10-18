import getUsersDB from "../../database/users/getDB.js";

export const meController = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ username: "Guest", isLoggedIn: false });
        }
        const DB = await getUsersDB();
        const user = await DB.get("SELECT username FROM users WHERE id = ?", [req.session.userId]);
        await DB.close();
        res.json({ username: user.username, isLoggedIn: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ username: "Guest", isLoggedIn: false });
    }
}