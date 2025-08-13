import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Product } from '../types';
import { productApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div id="scrollable-div"
      style={{
        height: 650,
        overflow: "auto"
      }}
    >
      <InfiniteScroll
        dataLength={products.length}
        next={() => fetchMoreData()}
        hasMore={hasMore}
        loader={<div className="loader">Loading...</div>}
        scrollableTarget="scrollable-div"
        endMessage={
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <b>No more products to show</b>
          </p>
        }
      >
        <div className="product-grid">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="product-info">
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
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ProductList;