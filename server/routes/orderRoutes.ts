import express from 'express';
import OrderController from '../controller/OrderController';

const { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getUserOrders } = OrderController;

const OrderRouter = express.Router();

OrderRouter.get('/', getOrders);
OrderRouter.get('/:_id', getOrderById);
OrderRouter.get('/user/:userId', getUserOrders);
OrderRouter.post('/', createOrder);
OrderRouter.put('/:_id', updateOrder);
OrderRouter.delete('/:_id', deleteOrder);

export default OrderRouter;