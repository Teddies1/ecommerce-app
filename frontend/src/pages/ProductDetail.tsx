import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { productApi, orderApi } from '../services/api';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      const data = await productApi.getProductById(parseInt(id));
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    if (!customerName || !customerEmail) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (quantity < 1 || quantity > product.stock) {
      toast.error('Invalid quantity');
      return;
    }
    
    setOrdering(true);
    
    try {
      const order = await orderApi.createOrder({
        productId: product.id,
        quantity,
        customerName,
        customerEmail,
      });
      
      toast.success('Order placed successfully! You will be notified when it\'s ready.');
      navigate('/');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Products
      </button>
      
      <div className="product-detail">
        <div className="product-image-section">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        
        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          
          <div className="product-meta">
            <div className="price">${product.price.toFixed(2)}</div>
            <div className="category">{product.category}</div>
          </div>
          
          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          {product.stock > 0 && (
            <form onSubmit={handleOrder} className="order-form">
              <h2>Place Order</h2>
              
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="order-summary">
                <strong>Total: ${(product.price * quantity).toFixed(2)}</strong>
              </div>
              
              <button
                type="submit"
                className="order-btn"
                disabled={ordering}
              >
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;