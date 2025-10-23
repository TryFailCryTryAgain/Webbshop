

export const BtmProductsRating = () => {

    return (
        <>
            <div className="data-table-container">
                <h3 className="chart-title">Bottom 5 Products by Rating</h3>
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
                            <td>Generic USB Cable</td>
                            <td>★☆☆☆☆ (1.2)</td>
                            <td>34</td>
                            <td>$9.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                                <button className="btn btn-danger">Remove</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Low-Quality Earbuds</td>
                            <td>★☆☆☆☆ (1.5)</td>
                            <td>28</td>
                            <td>$14.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                                <button className="btn btn-danger">Remove</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Basic Mouse Pad</td>
                            <td>★★☆☆☆ (2.1)</td>
                            <td>19</td>
                            <td>$5.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Screen Protector Kit</td>
                            <td>★★☆☆☆ (2.3)</td>
                            <td>42</td>
                            <td>$12.99</td>
                            <td className="action-buttons">
                                <button className="btn btn-primary">View</button>
                                <button className="btn btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Phone Charger Adapter</td>
                            <td>★★☆☆☆ (2.4)</td>
                            <td>37</td>
                            <td>$15.99</td>
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