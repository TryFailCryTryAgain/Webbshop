"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.addToBlacklist = void 0;
// Simple in-memory token blacklist (for production, use Redis)
const tokenBlacklist = new Set();
const addToBlacklist = (token) => {
    tokenBlacklist.add(token);
};
exports.addToBlacklist = addToBlacklist;
const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};
exports.isTokenBlacklisted = isTokenBlacklisted;
// Optional: Clean up expired tokens periodically
setInterval(() => {
    // In a real application, you'd check token expiration dates
    // For now, we'll just log the current blacklist size
    console.log(`Token blacklist size: ${tokenBlacklist.size}`);
}, 24 * 60 * 60 * 1000); // Run once per day
