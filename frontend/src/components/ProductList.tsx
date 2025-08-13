import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Product } from '../types';
import { productApi, orderApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductList.css';

interface ProductListProps {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category, minPrice, maxPrice, search }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderForms, setOrderForms] = useState<{ [key: number]: { quantity: number; customerName: string; customerEmail: string } }>({});
  const [orderingProducts, setOrderingProducts] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const loadProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await productApi.getProducts({
        page: pageNum,
        limit: 10,
        category,
        minPrice,
        maxPrice,
        search,
      });

      if (reset) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }

      setHasMore(pageNum < response.pagination.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, minPrice, maxPrice, search, loading]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(1, true);
  }, [category, minPrice, maxPrice, search]);

  const fetchMoreData = () => {
    loadProducts(page + 1);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleOrderFormChange = (productId: number, field: string, value: string | number) => {
    setOrderForms(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
        quantity: prev[productId]?.quantity || 1,
        customerName: prev[productId]?.customerName || '',
        customerEmail: prev[productId]?.customerEmail || ''
      }
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const formData = orderForms[product.id] || { quantity: 1, customerName: '', customerEmail: '' };
    
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.quantity < 1 || formData.quantity > product.stock) {
      toast.error('Invalid quantity');
      return;
    }
    
    setOrderingProducts(prev => new Set(prev).add(product.id));
    
    try {
      await orderApi.createOrder({
        productId: product.id,
        quantity: formData.quantity,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
      });
      
      toast.success('Order placed successfully!');
      
      // Reset form for this product
      setOrderForms(prev => {
        const newForms = { ...prev };
        delete newForms[product.id];
        return newForms;
      });
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order');
    } finally {
      setOrderingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<div className="loader">Loading...</div>}
      endMessage={
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <b>No more products to show</b>
        </p>
      }
    >
      <div className="product-grid">
        {products.map((product) => {
          const formData = orderForms[product.id] || { quantity: 1, customerName: '', customerEmail: '' };
          const isOrdering = orderingProducts.has(product.id);
          
          return (
            <div
              key={product.id}
              className="product-card"
            >
              <div className="product-info" onClick={() => handleProductClick(product.id)}>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="price">${Number(product.price).toFixed(2)}</span>
                  <span className="category">{product.category}</span>
                </div>
                <div className="stock-info">
                  {product.stock > 0 ? (
                    <span className="in-stock">In Stock ({product.stock})</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
              
              {product.stock > 0 && (
                <form 
                  className="quick-order-form" 
                  onSubmit={(e) => handleSubmitOrder(e, product)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="form-row">
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={formData.quantity}
                      onChange={(e) => handleOrderFormChange(product.id, 'quantity', parseInt(e.target.value) || 1)}
                      onFocus={(e) => e.stopPropagation()}
                      placeholder="Qty"
                      className="quantity-input"
                      required
                    />
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleOrderFormChange(product.id, 'customerName', e.target.value)}
                      onFocus={(e) => e.stopPropagation()}
                      placeholder="Your Name"
                      className="name-input"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleOrderFormChange(product.id, 'customerEmail', e.target.value)}
                      onFocus={(e) => e.stopPropagation()}
                      placeholder="Email"
                      className="email-input"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <span className="total-price">Total: ${(product.price * formData.quantity).toFixed(2)}</span>
                    <button
                      type="submit"
                      className="quick-order-btn"
                      disabled={isOrdering}
                    >
                      {isOrdering ? 'Ordering...' : 'Order Now'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </InfiniteScroll>
  );
};

export default ProductList;