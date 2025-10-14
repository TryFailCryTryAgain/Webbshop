// Simple in-memory token blacklist (for production, use Redis)
const tokenBlacklist = new Set<string>();

export const addToBlacklist = (token: string): void => {
    tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
    return tokenBlacklist.has(token);
};

// Optional: Clean up expired tokens periodically
setInterval(() => {
    // In a real application, you'd check token expiration dates
    // For now, we'll just log the current blacklist size
    console.log(`Token blacklist size: ${tokenBlacklist.size}`);
}, 24 * 60 * 60 * 1000); // Run once per day