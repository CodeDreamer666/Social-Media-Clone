import getUsersDB from "../../database/users/getDB.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import sanitizeHtml from "sanitize-html";

export const loginController = async (req, res, next) => {
    try {
        const DB = await getUsersDB();
        let { email, password } = req.body;

        email = email.trim();
        password = password.trim();

        email = sanitizeHtml(email, {
            allowedAttributes: {},
            allowedTags: []
        });

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email address." });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be at least 8 characters, include uppercase, lowercase, number and symbol." });
        }

        const existing = await DB.get("SELECT id FROM users WHERE email = ?", [email]);

        if (!existing.id) {
            return res.status(401).json({ error: `Invalid credentials` })
        }

        const passwordFromDB = await DB.get("SELECT password FROM users WHERE id = ?", [existing.id]);
        const isMatch = await bcrypt.compare(password, passwordFromDB.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        req.session.userId = existing.id;
        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Login failed. Please try again." });
            }
            return res.status(201).json({ message: "Login Successfully" });
        });

        await DB.close();
    } catch (err) {
        next();
    }
}