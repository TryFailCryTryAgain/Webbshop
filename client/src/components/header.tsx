import { Link, useNavigate } from "react-router-dom";
import { RouterContainer } from '../routes/RouterContainer';
import axios from "axios";
import { useEffect, useState } from "react";
import { categoryAPI, type Category, orderAPI, productAPI, type Product } from "../api/api";
import { 
    getCartItemsFromStorage, 
    removeProductFromStorage, 
    increaseQuantityInStorage, 
    decreaseQuantityInStorage,
    clearCartFromStorage,
    type CartItem 
} from "./cart-functions/cart-functions";

interface Profile {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    adress: string,
    ZIP: number,
    role: string
}

export const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [_error, setError] = useState<string | null>(null);
    const [cartBar, setCartBar] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [mobileCategoriesVisible, setMobileCategoriesVisible] = useState(false);
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) as Profile : null;

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [products, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const allProducts = await productAPI.getProducts();
                setAllProducts(allProducts);
            } catch (err) {
                console.error('Error fetching products', err);
            }
        };

        fetchAllProducts();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        
        if (query.trim().length === 0) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const filteredResults = products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            (product.category && typeof product.category === 'object' && 
             'title' in product.category && 
             product.category.title.toLowerCase().includes(query.toLowerCase()))
        );

        setSearchResults(filteredResults);
        setShowSearchResults(true);
    };

    const navigateToProductPage = (product: Product) => {
        const productId = product._id;
        const shortenId = productId.slice(0, 6);

        navigate(RouterContainer.Product.replace(':id', shortenId), {
            state: {
                product: product,
                productId: product._id
            }
        });
        
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common['Authorization'];
        setMobileMenuVisible(false);
        navigate(RouterContainer.Login);
        window.location.reload();
    };

    // Load cart items when cart opens or component mounts
    useEffect(() => {
        const items = getCartItemsFromStorage();
        setCartItems(items);
    }, []);

    useEffect(() => {
        if (cartBar) {
            const items = getCartItemsFromStorage();
            setCartItems(items);
        }
    }, [cartBar]);

    // Fetch categories when dropdown is about to be shown
    async function fetchCategories() {
        if (!dropdownVisible && categories.length === 0) {
            try {
                const data = await categoryAPI.getCategories();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error fetching categories', err);
            }
        }
        setDropdownVisible(!dropdownVisible);
    }

    async function fetchMobileCategories() {
        if (!mobileCategoriesVisible && categories.length === 0) {
            try {
                const data = await categoryAPI.getCategories();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error fetching categories', err);
            }
        }
        setMobileCategoriesVisible(!mobileCategoriesVisible);
    }

    function navigateToCategoryPage(id: string) {
        const categoryId = id;
        const ShortenCategoryId = id.slice(0, 6);

        navigate(RouterContainer.Category.replace(':id', ShortenCategoryId), {
            state: {
                categoryId: categoryId
            }
        });
        
        setDropdownVisible(false);
        setMobileCategoriesVisible(false);
        setMobileMenuVisible(false);
    }

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim().length > 0) {
            if (searchResults.length > 0) {
                navigateToProductPage(searchResults[0]);
            } else {
                setShowSearchResults(false);
            }
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownContainer = document.getElementById("category_dropdown_menu_container");
            const mobileMenuContainer = document.getElementById("mobile_menu_container");
            const searchContainer = document.getElementById("search_container");
            
            if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
            
            if (mobileMenuContainer && !mobileMenuContainer.contains(event.target as Node)) {
                setMobileMenuVisible(false);
                setMobileCategoriesVisible(false);
            }

            if (searchContainer && !searchContainer.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    // Calculate total items count for badge
    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Handle quantity changes
    const handleIncreaseQuantity = (productId: string) => {
        increaseQuantityInStorage(productId);
        const updatedItems = getCartItemsFromStorage();
        setCartItems(updatedItems);
    };

    const handleDecreaseQuantity = (productId: string) => {
        decreaseQuantityInStorage(productId);
        const updatedItems = getCartItemsFromStorage();
        setCartItems(updatedItems);
    };

    const handleRemoveProduct = (productId: string) => {
        removeProductFromStorage(productId);
        const updatedItems = getCartItemsFromStorage();
        setCartItems(updatedItems);
    };

    // Handle order confirmation
    const handleConfirmOrder = async () => {
        if (!userData || cartItems.length === 0) return;

        try {
            // Create an array of product IDs considering quantities
            const productIds: string[] = [];
            cartItems.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    productIds.push(item.product._id);
                }
            });

            const orderData = {
                userId: userData._id,
                productId: productIds
            };

            console.log(orderData);

            await orderAPI.createOrder(orderData);
            
            // Clear cart after successful order
            clearCartFromStorage();
            setCartItems([]);
            setCartBar(false);
            
            alert("Order placed successfully!");
            
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    // Handle cancel order
    const handleCancelOrder = () => {
        clearCartFromStorage();
        setCartItems([]);
        setCartBar(false);
    };

    const handleMobileLinkClick = () => {
        setMobileMenuVisible(false);
        setMobileCategoriesVisible(false);
    };

    return (
        <>
            {cartBar && (
                <aside className="cart-bar">
                    <div className="cart-action-container">
                        <div 
                            className="fa fa-chevron-left" 
                            aria-hidden="true"
                            onClick={() => setCartBar(false)}
                        ></div>
                    </div>

                    <div className="cart-title-container">
                        <h2>Cart ({calculateTotalItems()} items)</h2>
                    </div>

                    <div className="cart-product-container">
                        {cartItems.length === 0 ? (
                            <p className="empty-cart-message">Your cart is empty</p>
                        ) : (
                            <>
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="cart-product-item">
                                        <div className="product-info">
                                            <span className="product-title">{item.product.title}</span>
                                            <span className="product-price">${item.product.price} × {item.quantity}</span>
                                            <span className="product-total">Total ${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="quantity-controls">
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => handleDecreaseQuantity(item.product._id)}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => handleIncreaseQuantity(item.product._id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="remove-product-btn"
                                            onClick={() => handleRemoveProduct(item.product._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <div className="cart-total">
                                    <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                                </div>
                            </>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="cart-buttons">
                            <button 
                                className="confirm-btn"
                                onClick={handleConfirmOrder}
                                disabled={!userData}
                            >
                                {userData ? `Confirm Order ($${calculateTotal().toFixed(2)})` : "Please Login to Order"}
                            </button>
                            <button 
                                className="cancel-btn"
                                onClick={handleCancelOrder}
                            >
                                Clear Cart
                            </button>
                        </div>
                    )}
                </aside>
            )}

            
            <nav className="user-header">
                <div className="logo">Webbshop</div>


                <div 
                    className="search-bar"
                    id="search_container"
                >
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                    />
                    
                    {showSearchResults && (
                        <div className="search-results-dropdown">
                            {searchResults.length > 0 ? (
                                <>
                                    {searchResults.slice(0, 5).map((product) => (
                                        <div 
                                            key={product._id}
                                            className="search-result-item"
                                            onClick={() => navigateToProductPage(product)}
                                        >
                                            <div className="search-result-image">
                                                {product.images && product.images.length > 0 ? (
                                                    <img 
                                                        src={product.images[0]} 
                                                        alt={product.title}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="no-image-placeholder">No Image</div>
                                                )}
                                            </div>
                                            <div className="search-result-info">
                                                <div className="search-result-title">{product.title}</div>
                                                <div className="search-result-price">${product.price}</div>
                                                <div className="search-result-category">
                                                    {product.category && typeof product.category === 'object' && 'title' in product.category 
                                                        ? product.category.title 
                                                        : 'Uncategorized'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {searchResults.length > 5 && (
                                        <div className="search-result-more">
                                            +{searchResults.length - 5} more results
                                        </div>
                                    )}
                                </>
                            ) : searchQuery.length > 0 ? (
                                <div className="search-no-results">
                                    No products found for "{searchQuery}"
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>


                <ul className="nav-links">
                    <li><Link to="/">Products</Link></li> 
                    <li 
                        id="category_dropdown_menu_container" 
                        className="category_dropdown_menu_container"
                    >
                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                fetchCategories();
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            Categories
                        </a>
                        
                        {dropdownVisible && (
                            <ul className="categories_dropdown_menu">
                                {categories.map((category) => (
                                    <li 
                                        className="categories_dropdown_menu_links" 
                                        key={category._id}
                                        onClick={() => navigateToCategoryPage(category._id)}
                                    >
                                        {category.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </ul>
                
                {token && userData ? (
                    <div className="user-menu">
                        <span className="welcome-text">
                            <i className="user-icon"></i>{userData.first_name} {userData.last_name}
                        </span>
                        <Link to={RouterContainer.UserDashboard}>
                            <button className="dashboard-btn">Profile</button>
                        </Link>
                        {(userData.role === "admin") ? (
                            <Link to={RouterContainer.AdminDashboard}>
                                <button className="dashboard-btn">Dashboard</button>
                            </Link>
                        ) : null}

                        <button 
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <div className="cart-icon-container">
                            <i 
                                className="fa-solid fa-cart-shopping cart"
                                onClick={() => setCartBar(true)}
                                style={{ cursor: 'pointer' }}
                            >
                                {calculateTotalItems() > 0 && (
                                    <span className="cart-count">{calculateTotalItems()}</span>
                                )}
                            </i>
                        </div>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to={RouterContainer.Login}>
                            <button className="sign-in">Sign in</button>
                        </Link>
                        <Link to={RouterContainer.Register}>
                            <button className="sign-up">Sign up</button>
                        </Link>
                    </div>
                )}
                
                {/* Fixed Hamburgure Menu */}
                <div 
                    className="hamburgure_toggle"
                    id="mobile_menu_container"
                >
                    <i 
                        className="fa-solid fa-bars"
                        onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                        style={{ cursor: 'pointer' }}
                    ></i>

                    {mobileMenuVisible && (
                        <ul className="dropdown-menu">
                            <li>
                                <Link 
                                    to="/" 
                                    onClick={handleMobileLinkClick}
                                >
                                    Products
                                </Link>
                            </li>
                            
                            <li className="mobile-category-item">
                                <a 
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        fetchMobileCategories();
                                    }}
                                >
                                    Categories
                                    <i className={`fa-solid ${mobileCategoriesVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </a>
                                {mobileCategoriesVisible && (
                                    <ul className="mobile-categories-dropdown">
                                        {categories.map((category) => (
                                            <li 
                                                key={category._id}
                                                onClick={() => navigateToCategoryPage(category._id)}
                                            >
                                                {category.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>

                            {token && userData ? (
                                <>
                                    <li>
                                        <Link 
                                            to={RouterContainer.UserDashboard} 
                                            onClick={handleMobileLinkClick}
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    {userData.role === "admin" && (
                                        <li>
                                            <Link 
                                                to={RouterContainer.AdminDashboard} 
                                                onClick={handleMobileLinkClick}
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <div 
                                            className="mobile-cart-item"
                                            onClick={() => {
                                                setCartBar(true);
                                                setMobileMenuVisible(false);
                                            }}
                                        >
                                            Cart ({calculateTotalItems()})
                                        </div>
                                    </li>
                                    <li>
                                        <button 
                                            className="mobile-logout-btn"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                    <li className="mobile-user-info">
                                        Welcome, {userData.first_name} {userData.last_name}
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link 
                                            to={RouterContainer.Login} 
                                            onClick={handleMobileLinkClick}
                                        >
                                            Sign in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to={RouterContainer.Register} 
                                            onClick={handleMobileLinkClick}
                                        >
                                            Sign up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    )}
                </div>
                
            </nav>
        </>
    );
};