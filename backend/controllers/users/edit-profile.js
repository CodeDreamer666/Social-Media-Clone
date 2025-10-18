import getUsersDB from "../../database/users/getDB.js";
import sanitizeHtml from "sanitize-html";

export const editProfileController = async (req, res) => {
    try {
        // 1. Make sure the user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ error: "Please sign in or log in to edit your profile" });
        }

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
        console.error("Edit profile error:", err);
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
};
