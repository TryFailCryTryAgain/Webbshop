import { useEffect, useState } from "react";
import { orderAPI, productAPI } from '../../api/api';

interface Profile {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    adress: string,
    ZIP: number,
    role: string
}

// Update the Order interface to reflect the actual data structure
interface Order {
    _id: string;
    userId: string;
    productId: any[]; // Change to any[] to handle both strings and objects
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

const useUser = (): Profile | null => {
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                setUser(JSON.parse(userString) as Profile);
            } catch (err) {
                console.error("Error parsing user data", err);
            }
        }
    }, []);

    return user;
}

const UserOrderTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [productTitles, setProductTitles] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const user = useUser();

    // Helper function to extract product ID whether it's a string or object
    const extractProductId = (productItem: any): string => {
        if (typeof productItem === 'string') {
            return productItem;
        } else if (productItem && typeof productItem === 'object') {
            // If it's an object, try to get the ID from common property names
            return productItem._id || productItem.id || productItem.productId || productItem.productID;
        }
        console.warn('Unknown product item format:', productItem);
        return '';
    };

    // Fetch product titles for all product IDs in orders
    const fetchProductTitles = async (orders: Order[]) => {
        if (orders.length === 0) return;

        const titles: { [key: string]: string } = {};
        
        // Get all unique product IDs from all orders
        const allProductIds = Array.from(
            new Set(orders.flatMap(order => 
                order.productId.map(extractProductId).filter(id => id) // Extract IDs and filter out empty ones
            ))
        );

        console.log('Extracted product IDs:', allProductIds); // Debug log

        if (allProductIds.length === 0) return;

        setLoading(true);
        try {
            // Fetch all products concurrently
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
            
            // Create titles mapping
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

    // Helper function to get product titles for a specific order
    const getProductTitlesForOrder = (order: Order): string => {
        const titles = order.productId
            .map(productItem => {
                const productId = extractProductId(productItem);
                return productTitles[productId] || "Loading...";
            })
            .filter(title => title !== "Loading..."); // Remove loading texts if we have actual titles

        return titles.length > 0 ? titles.join(", ") : "Loading products...";
    };

    useEffect(() => {
        const fetchOrdersAndProducts = async () => {
            if (!user) return;

            try {
                // Fetch orders first
                const ordersData = await orderAPI.getOrdersByUserId(user._id);
                console.log('Fetched orders:', ordersData); // Debug log to see actual data structure
                setOrders(ordersData);
                
                // Then fetch product titles for these orders
                await fetchProductTitles(ordersData);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrdersAndProducts();
    }, [user]);

    function CheckStatus() {
        if (user) {
            console.log('User ID:', user._id);
            console.log('Orders:', orders);
            console.log('Product Titles:', productTitles);
            
            // Debug: Check the actual structure of productId in orders
            orders.forEach((order, index) => {
                console.log(`Order ${index} productId:`, order.productId);
                order.productId.forEach((item, itemIndex) => {
                    console.log(`Order ${index}, item ${itemIndex}:`, item, 'Type:', typeof item);
                });
            });
        } else {
            console.log("User not found");
        }
    }

    return (
        <>
            <button onClick={() => CheckStatus()}>Check Status (Debug)</button>
            {loading && <div>Loading products...</div>}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{getProductTitlesForOrder(order)}</td>
                                <td>${order.price.toFixed(2)}</td>
                                <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
                                <td>
                                    <button className="view-details-btn">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>
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

export default UserOrderTable;