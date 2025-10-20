import getUsersDB from "../../database/users/getDB.js";
import getPostsDB from "../../database/posts/getDB.js";

export const userProfileController = async (req, res, next) => {
    try {
        let userId;

        if (req.params.id === "me") {
            // Current logged-in user
            userId = req.session.userId;
        } else {
            // Another user's profile
            userId = Number(req.params.id);
        }


        const usersDB = await getUsersDB();
        const postsDB = await getPostsDB();

        const user = await usersDB.get(
            "SELECT username, bio FROM users WHERE id = ?",
            [userId]
        );
        const userPosts = await postsDB.all(
            "SELECT * FROM posts WHERE user_id = ?",
            [userId]
        );

        await usersDB.close();
        await postsDB.close();

        res.json([{
            username: user.username,
            bio: user.bio,
            posts: userPosts
        }])

    } catch (err) {
        next(err);
    }
}