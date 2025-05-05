const { mostrarRolPorId } = require("../models/User");
exports.isAdmin = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const userRole = await mostrarRolPorId(user.id);
        console.log("🚀 ~ exports.isAdmin= ~ userRole:", typeof userRole)
        if (Number(userRole) !== 1) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    } catch (error) {
        next(error);
    }
    // next();
}

