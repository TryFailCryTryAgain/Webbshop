import { OrderByStatusDonutChart } from "../charts/OrderByStatusChart";
import { UserByRegistrationLineChart } from "../charts/UserByRegistrationChart";
import { BtmProductsRating } from "../tables/btm5productsRating";
import { TopProductsRating } from "../tables/top5productsRating";
import { type Profile, type Order, type Review, type Product, productAPI, orderAPI, reviewAPI, userAPI } from '../../api/api';
import { useEffect, useState } from "react";

interface OverallData {
    products: Product[];
    users: Profile[];
    orders: Order[];
    reviews: Review[];
}

const useData = (): OverallData => {
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productData = await productAPI.getProducts();
                setProducts(productData);
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };

        const fetchOrders = async () => {
            try {
                const orderData = await orderAPI.getOrders();
                setOrders(orderData);
            } catch (err) {
                console.error("Error fetching orders", err);
            }
        };

        const fetchReviews = async () => {
            try {
                const reviewData = await reviewAPI.getReviews();
                setReviews(reviewData);
            } catch (err) {
                console.error("Error fetching reviews", err);
            }
        };

        const fetchUsers = async () => {
            try {
                const userData = await userAPI.getAllUsers();
                setUsers(userData);
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };

        fetchOrders();
        fetchProducts();
        fetchReviews();
        fetchUsers();
    }, []);

    return { users, reviews, orders, products };
}

const AdminOverviewTab = () => {
    const { users, reviews, orders, products } = useData();

    return (
        <>
            <div className="table-row">
                <div className="table-row-container">
                    <h4 className="title_section">Total Users</h4>
                    <div className="total_amount_display primary">{users.length}</div>
                </div>
                <div className="table-row-container">
                    <h4 className="title_section">Total Orders</h4>
                    <div className="total_amount_display secondary">{orders.length}</div>
                </div>
                <div className="table-row-container">
                    <h4 className="title_section">Total Reviews</h4>
                    <div className="total_amount_display info">{reviews.length}</div>
                </div>
                <div className="table-row-container">
                    <h4 className="title_section">Total Products</h4>
                    <div className="total_amount_display success">{products.length}</div>
                </div>
            </div>

            {/* <div className="user-registration-graph">
                <UserByRegistrationLineChart users={users} />
            </div> */}

            <div className="order-by-status">
                <OrderByStatusDonutChart 
                    orders={orders}
                />
            </div>

            <TopProductsRating 
                reviews={reviews}
                products={products}
            />

            {/* Not currently relevant needs to be removed! */}
            {/* <BtmProductsRating /> */}
        </>
    );
};

export default AdminOverviewTab;