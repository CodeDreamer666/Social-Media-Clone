export default function errorHandler(err, req, res, next) {
    console.error(err);
    
    const isLoggedIn = err.isLoggedIn || false;
    const username = err.username || "Guest";

    res.status(500).json({
        isLoggedIn: isLoggedIn,
        username: username,
        error: 'Something went wrong. Please try again later.',
        bio: ""
    })
}