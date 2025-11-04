import type { Product } from "../tables/AdminOrderTable";

export interface CartItem {
    product: Product;
    quantity: number;
}

// Add product to cart or increase quantity if already exists
export function addProductToStorage(product: Product): void {
    const existingItems = getCartItemsFromStorage();
    const existingItemIndex = existingItems.findIndex(item => item.product._id === product._id);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if product already exists
        const updatedItems = [...existingItems];
        updatedItems[existingItemIndex].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    } else {
        // Add new item with quantity 1
        const newItem: CartItem = { product, quantity: 1 };
        const updatedItems = [...existingItems, newItem];
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
}

// Get all cart items from storage
export function getCartItemsFromStorage(): CartItem[] {
    const cartJson = localStorage.getItem("cart");
    if (!cartJson) return [];

    try {
        return JSON.parse(cartJson) as CartItem[];
    } catch (err) {
        console.error("Error parsing cart from localStorage: ", err);
        return [];
    }
}

// Increase quantity of a product
export function increaseQuantityInStorage(productId: string): void {
    const existingItems = getCartItemsFromStorage();
    const existingItemIndex = existingItems.findIndex(item => item.product._id === productId);
    
    if (existingItemIndex !== -1) {
        const updatedItems = [...existingItems];
        updatedItems[existingItemIndex].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
}

// Decrease quantity or remove if quantity becomes 0
export function decreaseQuantityInStorage(productId: string): void {
    const existingItems = getCartItemsFromStorage();
    const existingItemIndex = existingItems.findIndex(item => item.product._id === productId);
    
    if (existingItemIndex !== -1) {
        const updatedItems = [...existingItems];
        if (updatedItems[existingItemIndex].quantity > 1) {
            // Decrease quantity
            updatedItems[existingItemIndex].quantity -= 1;
        } else {
            // Remove item entirely if quantity becomes 0
            updatedItems.splice(existingItemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
}

// Remove product completely from cart
export function removeProductFromStorage(productId: string): void {
    const existingItems = getCartItemsFromStorage();
    const updatedItems = existingItems.filter(item => item.product._id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
}

// Clear entire cart
export function clearCartFromStorage(): void {
    localStorage.removeItem("cart");
}

// Get total number of items in cart (sum of all quantities)
export function getTotalCartItems(): number {
    const items = getCartItemsFromStorage();
    return items.reduce((total, item) => total + item.quantity, 0);
}

// Get total price of all items in cart
export function getCartTotalPrice(): number {
    const items = getCartItemsFromStorage();
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

// Check if product is in cart
export function isProductInCart(productId: string): boolean {
    const items = getCartItemsFromStorage();
    return items.some(item => item.product._id === productId);
}

// Get quantity of specific product in cart
export function getProductQuantity(productId: string): number {
    const items = getCartItemsFromStorage();
    const item = items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
}