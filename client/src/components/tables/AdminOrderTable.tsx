


export const AdminOrderTable = () => {

    return (
        <>
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD-02481</td>
                            <td>john.doe@example.com</td>
                            <td>Wireless Headphones, Phone Case</td>
                            <td>$119.98</td>
                            <td>2023-10-15</td>
                            <td><span className="status-badge status-delivered">Delivered</span></td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#ORD-02480</td>
                            <td>sarah.smith@example.com</td>
                            <td>Smart Watch, Fitness Band</td>
                            <td>$349.98</td>
                            <td>2023-10-14</td>
                            <td><span className="status-badge status-processing">Processing</span></td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#ORD-02479</td>
                            <td>mike.johnson@example.com</td>
                            <td>Gaming Keyboard, Mouse</td>
                            <td>$179.99</td>
                            <td>2023-10-13</td>
                            <td><span className="status-badge status-pending">Pending</span></td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#ORD-02478</td>
                            <td>emily.wilson@example.com</td>
                            <td>Laptop Bag, USB Hub</td>
                            <td>$89.99</td>
                            <td>2023-10-12</td>
                            <td><span className="status-badge status-cancelled">Cancelled</span></td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#ORD-02477</td>
                            <td>alex.brown@example.com</td>
                            <td>Bluetooth Speaker, Headphones</td>
                            <td>$279.98</td>
                            <td>2023-10-11</td>
                            <td><span className="status-badge status-delivered">Delivered</span></td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div className="pagination">
                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                </div>
            </div>
        </>
    );
};