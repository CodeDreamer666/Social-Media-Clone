export default function checkIsLogin(errorMessage) {
    return async (req, res, next) => {
        if (!req.session.userId) {
            return res.status(401).json({
                isLoggedIn: false,
                username: "Guest",
                error: errorMessage || "You must be Logged in",
                bio: ""
            });
        }
        next();
    }
}