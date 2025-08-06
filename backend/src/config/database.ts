import { DataSource } from 'typeorm';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce',
  synchronize: true,
  logging: false,
  entities: [Product, Order],
  migrations: [],
  subscribers: [],
});