"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderController_1 = __importDefault(require("../controller/OrderController"));
const { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getUserOrders } = OrderController_1.default;
const OrderRouter = express_1.default.Router();
OrderRouter.get('/', getOrders);
OrderRouter.get('/:_id', getOrderById);
OrderRouter.get('/user/:userId', getUserOrders);
OrderRouter.post('/', createOrder);
OrderRouter.put('/:_id', updateOrder);
OrderRouter.delete('/:_id', deleteOrder);
exports.default = OrderRouter;
8;
