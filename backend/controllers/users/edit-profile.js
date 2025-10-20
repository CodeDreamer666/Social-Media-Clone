import getUsersDB from "../../database/users/getDB.js";
import sanitizeHtml from "sanitize-html";

export const editProfileController = async (req, res, next) => {
    try {
        // 2. Get and sanitize bio
        let { bio } = req.body;

        bio = bio.trim();

        if (!bio) {
            return res.status(400).json({ error: "All fields are required." })
        }

        const cleanBio = sanitizeHtml(bio, {
            allowedTags: [],
            allowedAttributes: {},
        });

        // 3. Update DB
        const usersDB = await getUsersDB();
        await usersDB.run("UPDATE users SET bio = ? WHERE id = ?", [cleanBio, req.session.userId]);
        await usersDB.close();

        // 4. Return success message
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        next(err);
    }
};
