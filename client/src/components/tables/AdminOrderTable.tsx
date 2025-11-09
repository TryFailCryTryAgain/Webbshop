import { useEffect, useState } from "react";
import { orderAPI, productAPI, userAPI } from '../../api/api';

interface Profile {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    adress: string,
    ZIP: number,
    role: string
}

interface Order {
    _id: string;
    userId: any;
    productId: any[];
    created_at: string;
    updated_at: string;
    price: number;
    delivery_date: Date;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    category: Category;
    price: number;
    images: string[];
    created_at: string;
    updated_at: string;
    rate: string[];
}

export interface Category {
    _id: string;
    title: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

interface ProductQuantity {
    productId: string;
    quantity: number;
}

export const AdminOrderTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [productTitles, setProductTitles] = useState<{ [key: string]: string }>({});
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allUsers, setAllUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [editWindow, setEditWindow] = useState(false);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [productQuantities, setProductQuantities] = useState<ProductQuantity[]>([]);
    const [editDeliveryDate, setEditDeliveryDate] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const extractProductId = (productItem: any): string => {
        if (typeof productItem === 'string') {
            return productItem;
        } else if (productItem && typeof productItem === 'object') {
            return productItem._id || productItem.id || productItem.productId || productItem.productID;
        }
        console.warn('Unknown product item format:', productItem);
        return '';
    };

    const extractUserId = (userItem: any): string => {
        if (typeof userItem === 'string') {
            return userItem;
        } else if (userItem && typeof userItem === 'object') {
            return userItem._id || userItem.id || userItem.userId || userItem.userID;
        }
        console.warn('Unknown user item format:', userItem);
        return '';
    };

    const fetchProductTitles = async (orders: Order[]) => {
        if (orders.length === 0) return;

        const titles: { [key: string]: string } = {};
        
        const allProductIds = Array.from(
            new Set(orders.flatMap(order => 
                order.productId.map(extractProductId).filter(id => id)
            ))
        );

        console.log('Extracted product IDs:', allProductIds);

        if (allProductIds.length === 0) return;

        setLoading(true);
        try {
            const productPromises = allProductIds.map(async (productId) => {
                try {
                    const product = await productAPI.getProductById(productId);
                    return { productId, product };
                } catch (err) {
                    console.error(`Error fetching product ${productId}:`, err);
                    return { productId, product: null };
                }
            });
            
            const productResults = await Promise.all(productPromises);
            
            productResults.forEach(({ productId, product }) => {
                if (product) {
                    titles[productId] = product.title;
                } else {
                    titles[productId] = "Unknown Product";
                }
            });
            
            setProductTitles(titles);
        } catch (err) {
            console.error("Error in fetchProductTitles:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserNames = async (orders: Order[]) => {
        if (orders.length === 0) return;

        const names: { [key: string]: string } = {};
        
        const allUserIds = Array.from(
            new Set(orders.map(order => extractUserId(order.userId)).filter(id => id))
        );

        console.log('Extracted user IDs:', allUserIds);

        if (allUserIds.length === 0) return;

        setLoading(true);
        try {
            const userPromises = allUserIds.map(async (userId) => {
                try {
                    const user = await userAPI.getUserById(userId);
                    return { userId, user };
                } catch (err) {
                    console.error(`Error fetching user ${userId}:`, err);
                    return { userId, user: null };
                }
            });
            
            const userResults = await Promise.all(userPromises);
            
            userResults.forEach(({ userId, user }) => {
                if (user) {
                    names[userId] = `${user.first_name} ${user.last_name}`;
                } else {
                    names[userId] = "Unknown User";
                }
            });
            
            setUserNames(names);
        } catch (err) {
            console.error("Error in fetchUserNames:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const products = await productAPI.getProducts();
            setAllProducts(products);
        } catch (err) {
            console.error("Error fetching all products:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const users = await userAPI.getAllUsers();
            setAllUsers(users);
        } catch (err) {
            console.error("Error fetching all users:", err);
        } finally {
            setLoading(false);
        }
    };

    const getProductTitlesForOrder = (order: Order): string => {
        const titles = order.productId
            .map(productItem => {
                const productId = extractProductId(productItem);
                return productTitles[productId] || "Loading...";
            })
            .filter(title => title !== "Loading...");

        return titles.length > 0 ? titles.join(", ") : "Loading products...";
    };

    const getUserNameForOrder = (order: Order): string => {
        const userId = extractUserId(order.userId);
        return userNames[userId] || "Loading user...";
    };

    // Count product occurrences in an order
    const countProductOccurrences = (order: Order): ProductQuantity[] => {
        const productCount: { [key: string]: number } = {};
        
        order.productId.forEach(productItem => {
            const productId = extractProductId(productItem);
            productCount[productId] = (productCount[productId] || 0) + 1;
        });

        return Object.entries(productCount).map(([productId, quantity]) => ({
            productId,
            quantity
        }));
    };

    // Convert product quantities back to productId array format
    const productQuantitiesToProductIds = (quantities: ProductQuantity[]): string[] => {
        return quantities.flatMap(pq => 
            Array(pq.quantity).fill(pq.productId)
        );
    };

    // Search functionality for products
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        
        if (query.trim().length === 0) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const filteredResults = allProducts.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            (product.category && typeof product.category === 'object' && 
             'title' in product.category && 
             product.category.title.toLowerCase().includes(query.toLowerCase()))
        );

        setSearchResults(filteredResults);
        setShowSearchResults(true);
    };

    // Add product from search results
    const addProductFromSearch = (product: Product) => {
        updateProductQuantity(product._id, 1);
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);
    };

    useEffect(() => {
        const fetchOrdersAndData = async () => {
            try {
                setLoading(true);
                const ordersData = await orderAPI.getOrders();
                console.log('Fetched orders:', ordersData);
                setOrders(ordersData);
                
                await Promise.all([
                    fetchProductTitles(ordersData),
                    fetchUserNames(ordersData),
                    fetchAllProducts(),
                    fetchAllUsers()
                ]);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndData();
    }, []);

    const EditOrder = (order: Order) => {
        setEditWindow(true);
        setEditOrder(order);
        setSelectedUserId(extractUserId(order.userId));
        setProductQuantities(countProductOccurrences(order));
        setEditDeliveryDate(new Date(order.delivery_date).toISOString().split('T')[0]);
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSaveOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editOrder) return;

        try {
            setLoading(true);
            
            // Convert quantities back to productId array
            const productIds = productQuantitiesToProductIds(productQuantities);
            
            // // Calculate total price based on product quantities
            // const totalPrice = productQuantities.reduce((total, pq) => {
            //     const product = allProducts.find(p => p._id === pq.productId);
            //     return total + (product?.price || 0) * pq.quantity;
            // }, 0);

            const updatedOrderData = {
                userId: selectedUserId,
                productId: productIds
                // price and delivery_date are calculated on backend according to your API
            };

            await orderAPI.updateOrder(editOrder._id, updatedOrderData);
            
            // Update local state with the response from API
            const updatedOrders = await orderAPI.getOrders();
            setOrders(updatedOrders);
            
            setEditWindow(false);
            setEditOrder(null);
            
            // Refresh product titles and user names
            await Promise.all([
                fetchProductTitles(updatedOrders),
                fetchUserNames(updatedOrders)
            ]);
            
        } catch (err) {
            console.error("Error updating order:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!window.confirm("Are you sure you want to delete this order?")) {
            return;
        }

        try {
            setLoading(true);
            await orderAPI.deleteOrder(orderId);
            
            // Update local state
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            
        } catch (err) {
            console.error("Error deleting order:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateProductQuantity = (productId: string, quantity: number) => {
        if (quantity < 0) return;
        
        setProductQuantities(prev => {
            const existing = prev.find(pq => pq.productId === productId);
            if (existing) {
                if (quantity === 0) {
                    // Remove product if quantity is 0
                    return prev.filter(pq => pq.productId !== productId);
                }
                // Update quantity
                return prev.map(pq => 
                    pq.productId === productId ? { ...pq, quantity } : pq
                );
            } else if (quantity > 0) {
                // Add new product
                return [...prev, { productId, quantity }];
            }
            return prev;
        });
    };

    // const getProductQuantity = (productId: string): number => {
    //     const pq = productQuantities.find(pq => pq.productId === productId);
    //     return pq ? pq.quantity : 0;
    // };

    const calculateTotalPrice = (): number => {
        return productQuantities.reduce((total, pq) => {
            const product = allProducts.find(p => p._id === pq.productId);
            return total + (product?.price || 0) * pq.quantity;
        }, 0);
    };

    const getSelectedProductsCount = (): number => {
        return productQuantities.reduce((total, pq) => total + pq.quantity, 0);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const searchContainer = document.getElementById("search_container");
            
            if (searchContainer && !searchContainer.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {loading && <div className="loading">Loading orders...</div>}
            {editWindow && editOrder && (
                <div className="edit-form-overlay">
                    <div className="edit-form">
                        <h2>Edit Order</h2>
                        <h4>Order ID: {editOrder._id}</h4>
                        <form onSubmit={handleSaveOrder}>
                            <div className="form-group">
                                <label htmlFor="user-select">User</label>
                                <select 
                                    id="user-select"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {allUsers.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.first_name} {user.last_name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Add Products</label>
                                <div 
                                    className="search-bar"
                                    id="search_container"
                                >
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                                        placeholder="Search products to add..."
                                    />
                                    
                                    {showSearchResults && (
                                        <div className="search-results-dropdown">
                                            {searchResults.length > 0 ? (
                                                <>
                                                    {searchResults.slice(0, 5).map((product) => (
                                                        <div 
                                                            key={product._id}
                                                            className="search-result-item"
                                                            onClick={() => addProductFromSearch(product)}
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
                                
                                <label>Current Products</label>
                                <div className="products-list">
                                    {productQuantities.map(pq => {
                                        const product = allProducts.find(p => p._id === pq.productId);
                                        if (!product) return null;
                                        
                                        return (
                                            <div key={product._id} className="product-item">
                                                <div className="product-info">
                                                    <span className="product-title">{product.title}</span>
                                                    <span className="product-price">${product.price} × {pq.quantity}</span>
                                                    <span className="product-total">${(product.price * pq.quantity).toFixed(2)}</span>
                                                </div>
                                                <div className="quantity-controls">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateProductQuantity(product._id, pq.quantity - 1)}
                                                        disabled={pq.quantity === 0}
                                                        className="quantity-btn"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="quantity-display">{pq.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateProductQuantity(product._id, pq.quantity + 1)}
                                                        className="quantity-btn"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {productQuantities.length === 0 && (
                                        <div className="no-products-message">No products added to this order</div>
                                    )}
                                </div>
                                
                                <div className="selected-products-summary">
                                    <strong>Total Items: {getSelectedProductsCount()}</strong>
                                    <br />
                                    <strong>Total Price: ${calculateTotalPrice().toFixed(2)}</strong>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="delivery-date">Delivery Date</label>
                                <input
                                    type="date"
                                    id="delivery-date"
                                    value={editDeliveryDate}
                                    onChange={(e) => setEditDeliveryDate(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" disabled={loading || getSelectedProductsCount() === 0}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditWindow(false);
                                        setEditOrder(null);
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Delivery Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{getUserNameForOrder(order)}</td>
                                <td>{getProductTitlesForOrder(order)}</td>
                                <td>${order.price.toFixed(2)}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
                                <td className="action-buttons">
                                    <button
                                        className="btn btn-info"
                                        onClick={() => EditOrder(order)}
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        disabled={loading}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && !loading && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};