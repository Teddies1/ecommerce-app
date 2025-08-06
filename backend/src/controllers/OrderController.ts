import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Order, OrderStatus } from '../entities/Order';
import { Product } from '../entities/Product';
import { orderQueue } from '../services/queue';

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);
  private productRepository = AppDataSource.getRepository(Product);

  createOrder = async (req: Request, res: Response) => {
    try {
      const { productId, quantity, customerName, customerEmail } = req.body;

      const product = await this.productRepository.findOne({ where: { id: productId } });
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const totalPrice = product.price * quantity;

      const order = this.orderRepository.create({
        productId,
        quantity,
        totalPrice,
        customerName,
        customerEmail,
        status: OrderStatus.PENDING
      });

      const savedOrder = await this.orderRepository.save(order);

      await orderQueue.add('process-order', {
        orderId: savedOrder.id,
        productId: product.id,
        quantity
      });

      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderRepository.findOne({ where: { id } });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  };
}