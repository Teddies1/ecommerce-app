import React, { useState } from 'react';
import './ProductFilter.css';

interface ProductFilterProps {
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => void;
}

const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    applyFilters({
      category: newCategory === 'All' ? undefined : newCategory,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search: search || undefined,
    });
  };

  const handlePriceChange = () => {
    applyFilters({
      category: category === 'All' ? undefined : category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search: search || undefined,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters({
      category: category === 'All' ? undefined : category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search: value || undefined,
    });
  };

  const applyFilters = (filters: any) => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    onFilterChange({});
  };

  return (
    <div className="filter-container">
      <h2>Filters</h2>
      
      <div className="filter-section">
        <h3>Search</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <h3>Category</h3>
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceChange}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceChange}
            className="price-input"
          />
        </div>
      </div>

      <button className="clear-filters-btn" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilter;