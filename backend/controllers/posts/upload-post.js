import getPostsDB from "../../database/posts/getDB.js"
import getUsersDB from "../../database/users/getDB.js"
import sanitizeHtml from "sanitize-html";

export const uploadPostController = async (req, res, next) => {
    try {
        const postsDB = await getPostsDB();
        const usersDB = await getUsersDB();
        let { title, description } = req.body;

        title = title.trim();
        description = description.trim();

        if (!title || !description) {
            return res.status(401).json({ error: "All fields are required. Please make sure nothing’s left blank." })
        }

        const cleanTitle = sanitizeHtml(title, {
            allowedTags: [],
            allowedAttributes: {}
        });
        const cleanDescription = sanitizeHtml(description, {
            allowedAttributes: {},
            allowedTags: []
        });

        const user = await usersDB.get("SELECT username FROM users WHERE id = ?", [req.session.userId]);

        await postsDB.run(`INSERT INTO posts (user_id, username, title, details) VALUES (?, ?, ?, ?)`, [req.session.userId, user.username, cleanTitle, cleanDescription]);
        await postsDB.close();
        await usersDB.close();
        res.status(201).json({ message: "You have successfully make a post!" })
    } catch (err) {
        next();
    }
}