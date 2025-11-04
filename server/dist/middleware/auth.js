"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ message: "Access token required" });
        return;
    }
    // Check if token is blacklisted
    if ((0, tokenBlacklist_1.isTokenBlacklisted)(token)) {
        res.status(401).json({ message: "Token has been invalidated" });
        return;
    }
    try {
        const decoded = (0, auth_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
