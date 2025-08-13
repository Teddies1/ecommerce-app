import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { Between, ILike, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);

  getProducts = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const minPrice = parseFloat(req.query.minPrice as string);
      const maxPrice = parseFloat(req.query.maxPrice as string);
      const search = req.query.search as string;

      const skip = (page - 1) * limit;

      let where: any = {};

      if (category) {
        where.category = category;
      }

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        where.price = Between(minPrice, maxPrice);
      } else if (!isNaN(minPrice)) {
        where.price = MoreThanOrEqual(minPrice);
      } else if (!isNaN(maxPrice)) {
        where.price = LessThanOrEqual(maxPrice);
      }

      if (search) {
        where.name = ILike(`%${search}%`);
      }

      const [products, total] = await this.productRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: {
          createdAt: 'DESC'
        }
      });

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  };
}