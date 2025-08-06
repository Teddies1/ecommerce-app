import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

export default router;