import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { Product } from './entities/Product';

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

const products = [
  { name: 'Laptop Pro', description: 'High-performance laptop with 16GB RAM', price: 1299.99, category: 'Electronics', stock: 50, imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+Pro' },
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking', price: 29.99, category: 'Electronics', stock: 100, imageUrl: 'https://via.placeholder.com/300x200?text=Wireless+Mouse' },
  { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor', price: 249.99, category: 'Electronics', stock: 75, imageUrl: 'https://via.placeholder.com/300x200?text=Smart+Watch' },
  { name: 'Cotton T-Shirt', description: 'Comfortable 100% cotton t-shirt', price: 19.99, category: 'Clothing', stock: 200, imageUrl: 'https://via.placeholder.com/300x200?text=Cotton+T-Shirt' },
  { name: 'Denim Jeans', description: 'Classic fit denim jeans', price: 49.99, category: 'Clothing', stock: 150, imageUrl: 'https://via.placeholder.com/300x200?text=Denim+Jeans' },
  { name: 'Running Shoes', description: 'Lightweight running shoes with cushioned sole', price: 89.99, category: 'Sports', stock: 80, imageUrl: 'https://via.placeholder.com/300x200?text=Running+Shoes' },
  { name: 'Yoga Mat', description: 'Non-slip exercise yoga mat', price: 24.99, category: 'Sports', stock: 120, imageUrl: 'https://via.placeholder.com/300x200?text=Yoga+Mat' },
  { name: 'JavaScript Guide', description: 'Complete guide to modern JavaScript', price: 39.99, category: 'Books', stock: 60, imageUrl: 'https://via.placeholder.com/300x200?text=JavaScript+Guide' },
  { name: 'Python Cookbook', description: 'Recipes for mastering Python', price: 44.99, category: 'Books', stock: 45, imageUrl: 'https://via.placeholder.com/300x200?text=Python+Cookbook' },
  { name: 'Garden Tools Set', description: '5-piece garden tool set', price: 34.99, category: 'Home & Garden', stock: 90, imageUrl: 'https://via.placeholder.com/300x200?text=Garden+Tools' },
  { name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp with USB charging', price: 39.99, category: 'Home & Garden', stock: 70, imageUrl: 'https://via.placeholder.com/300x200?text=LED+Desk+Lamp' },
  { name: 'Bluetooth Headphones', description: 'Noise-cancelling wireless headphones', price: 159.99, category: 'Electronics', stock: 65, imageUrl: 'https://via.placeholder.com/300x200?text=Bluetooth+Headphones' },
  { name: 'Winter Jacket', description: 'Waterproof winter jacket with hood', price: 129.99, category: 'Clothing', stock: 40, imageUrl: 'https://via.placeholder.com/300x200?text=Winter+Jacket' },
  { name: 'Dumbbells Set', description: 'Adjustable weight dumbbells set', price: 79.99, category: 'Sports', stock: 55, imageUrl: 'https://via.placeholder.com/300x200?text=Dumbbells+Set' },
  { name: 'React Handbook', description: 'Building modern web apps with React', price: 42.99, category: 'Books', stock: 50, imageUrl: 'https://via.placeholder.com/300x200?text=React+Handbook' },
  { name: 'Coffee Maker', description: 'Programmable coffee maker with timer', price: 59.99, category: 'Home & Garden', stock: 85, imageUrl: 'https://via.placeholder.com/300x200?text=Coffee+Maker' },
  { name: 'Gaming Keyboard', description: 'RGB mechanical gaming keyboard', price: 89.99, category: 'Electronics', stock: 70, imageUrl: 'https://via.placeholder.com/300x200?text=Gaming+Keyboard' },
  { name: 'Sunglasses', description: 'UV protection polarized sunglasses', price: 29.99, category: 'Clothing', stock: 180, imageUrl: 'https://via.placeholder.com/300x200?text=Sunglasses' },
  { name: 'Tennis Racket', description: 'Professional grade tennis racket', price: 119.99, category: 'Sports', stock: 35, imageUrl: 'https://via.placeholder.com/300x200?text=Tennis+Racket' },
  { name: 'Node.js in Action', description: 'Server-side JavaScript development', price: 45.99, category: 'Books', stock: 40, imageUrl: 'https://via.placeholder.com/300x200?text=Node.js+Book' },
  { name: 'Plant Pot Set', description: 'Decorative ceramic plant pots', price: 27.99, category: 'Home & Garden', stock: 95, imageUrl: 'https://via.placeholder.com/300x200?text=Plant+Pots' },
  { name: 'Webcam HD', description: '1080p HD webcam for video calls', price: 49.99, category: 'Electronics', stock: 110, imageUrl: 'https://via.placeholder.com/300x200?text=HD+Webcam' },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const productRepository = AppDataSource.getRepository(Product);
    
    await productRepository.clear();
    console.log('Cleared existing products');

    await productRepository.save(products);
    console.log(`Seeded ${products.length} products`);

    await AppDataSource.destroy();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();