import getUsersDB from "../../database/users/getDB.js";

export const bioController = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.json({ bio: "", isLoggedIn: false });
        }
        const DB = await getUsersDB();
        const user = await DB.get("SELECT bio FROM users WHERE id = ?", [req.session.userId]);
        await DB.close();
        res.json({ bio: user.bio, isLoggedIn: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ bio: "", isLoggedIn: false });
    }
}