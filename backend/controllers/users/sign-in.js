import getUsersDB from "../../database/users/getDB.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import sanitizeHtml from "sanitize-html";

export const signInController = async (req, res, next) => {
    try {
        const DB = await getUsersDB();

        let { username, email, password } = req.body;

        username = username.trim();
        email = email.trim();
        password = password.trim();

        username = sanitizeHtml(username, {
            allowedAttributes: {},
            allowedTags: []
        });

        email = sanitizeHtml(email, {
            allowedAttributes: {},
            allowedTags: []
        });


        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const usernameRegex = /^[A-Za-z0-9_]{1,20}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({ error: "Username must be 1–20 characters long and contain only letters, numbers, or underscores (_)." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email address." });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be at least 8 characters, include uppercase, lowercase, number and symbol." });
        }

        const userExists = await DB.get("SELECT * FROM users WHERE username = ?", [username]);
        const emailExists = await DB.get("SELECT * FROM users WHERE email = ?", [email]);

        if (userExists) {
            return res.status(400).json({ error: "Username or email already in use" });
        }

        if (emailExists) {
            return res.status(400).json({ error: "Username or email already in use" });

        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await DB.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        
        req.session.userId = result.lastID;
        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Registration failed. Please try again." });
            }
            return res.status(201).json({ message: "Registered Successfully" });
        });

        await DB.close();
    } catch (err) {
        next(err);
    }
}