export const logoutController = async (req, res) => {
    req.session.destroy(() => {
        return res.json({ message: "Logout Successfully" });
    })
}