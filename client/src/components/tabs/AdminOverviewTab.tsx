import { OrderByStatusDonutChart } from "../charts/OrderByStatusChart";
import { UserByRegistrationLineChart } from "../charts/UserByRegistrationChart";
import { BtmProductsRating } from "../tables/btm5productsRating";
import { TopProductsRating } from "../tables/top5productsRating";

const AdminOverviewTab = () => {

    return (
        <>
            <div className="table-row">
                <div className="table-row-container">
                    <h4 className="title_section">Total ...</h4>
                    <div className="total_amount_display primary">1 231</div>
                </div>
                <div className="table-row-container">
                    <h4 className="title_section">Total ...</h4>
                    <div className="total_amount_display secondary">1 231</div>
                </div>
                <div className="table-row-container">
                    <h4 className="title_section">Total ...</h4>
                    <div className="total_amount_display info">1 231</div>
                </div>
                <div className="table-row-container">
                    <h4 className="title_section">Total ...</h4>
                    <div className="total_amount_display success">1 231</div>
                </div>
            </div>

            <div className="user-registration-graph">
                <UserByRegistrationLineChart />
            </div>

            <div className="order-by-status">
                <OrderByStatusDonutChart />
            </div>

            <TopProductsRating />

            <BtmProductsRating />
        </>
    );
};

export default AdminOverviewTab;