import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductFilter from '../components/ProductFilter';
import './Home.css';

const Home: React.FC = () => {
  const [filters, setFilters] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }>({});

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>E-Commerce Store</h1>
      </header>
      
      <div className="content-container">
        <aside className="filters-sidebar">
          <ProductFilter onFilterChange={handleFilterChange} />
        </aside>
        
        <main className="products-main">
          <ProductList {...filters} />
        </main>
      </div>
    </div>
  );
};

export default Home;