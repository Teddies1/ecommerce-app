import Bull from 'bull';
import { AppDataSource } from '../config/database';
import { Order, OrderStatus } from '../entities/Order';
import { Product } from '../entities/Product';
import { io } from '../index';

export const orderQueue = new Bull('order-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

export const initializeQueue = async () => {
  orderQueue.process('process-order', async (job) => {
    const { orderId, productId, quantity } = job.data;
    
    console.log(`Processing order ${orderId}...`);
    
    await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));
    
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);
    
    try {
      await orderRepository.update(orderId, { status: OrderStatus.PROCESSING });
      
      const product = await productRepository.findOne({ where: { id: productId } });
      if (product) {
        product.stock -= quantity;
        await productRepository.save(product);
      }
      
      await orderRepository.update(orderId, { status: OrderStatus.COMPLETED });
      
      const completedOrder = await orderRepository.findOne({ where: { id: orderId } });
      
      io.emit('orderCompleted', completedOrder);
      
      console.log(`Order ${orderId} completed successfully`);
    } catch (error) {
      console.error(`Failed to process order ${orderId}:`, error);
      await orderRepository.update(orderId, { status: OrderStatus.FAILED });
      
      const failedOrder = await orderRepository.findOne({ where: { id: orderId } });
      io.emit('orderFailed', failedOrder);
    }
  });
  
  orderQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });
};