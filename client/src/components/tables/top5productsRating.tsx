


export const TopProductsRating = () => {
    
    return (
        <>
            <div className="data-table-container">
                <h3 className="chart-title">Top 5 Products by Rating</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Average Rating</th>
                            <th>Total Reviews</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Wireless Headphones Pro</td>
                            <td>★★★★★ (4.9)</td>
                            <td>247</td>
                            <td>$199.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Smart Fitness Watch</td>
                            <td>★★★★★ (4.8)</td>
                            <td>189</td>
                            <td>$249.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Bluetooth Speaker</td>
                            <td>★★★★☆ (4.7)</td>
                            <td>156</td>
                            <td>$79.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Gaming Keyboard</td>
                            <td>★★★★☆ (4.6)</td>
                            <td>132</td>
                            <td>$129.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Phone Case - Premium</td>
                            <td>★★★★☆ (4.5)</td>
                            <td>98</td>
                            <td>$29.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};