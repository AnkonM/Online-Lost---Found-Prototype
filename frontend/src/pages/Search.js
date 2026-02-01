import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import './Search.css';

function Search() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    date_from: '',
    date_to: '',
  });

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.type) {
        params.append('type', filters.type);
      }
      if (filters.date_from) {
        params.append('date_from', filters.date_from);
      }
      if (filters.date_to) {
        params.append('date_to', filters.date_to);
      }

      const response = await api.get(`/items/?${params.toString()}`);
      setItems(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      date_from: '',
      date_to: '',
    });
  };

  return (
    <div className="search-page">
      <h1>Search Lost & Found Items</h1>
      
      <div className="search-filters">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder="Search by keywords..."
            value={filters.search}
            onChange={handleChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>Type</label>
            <select name="type" value={filters.type} onChange={handleChange}>
              <option value="">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date From</label>
            <input
              type="date"
              name="date_from"
              value={filters.date_from}
              onChange={handleChange}
            />
          </div>
          
          <div className="filter-group">
            <label>Date To</label>
            <input
              type="date"
              name="date_to"
              value={filters.date_to}
              onChange={handleChange}
            />
          </div>
          
          <button onClick={clearFilters} className="clear-button">
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Searching...</div>
      ) : (
        <div className="search-results">
          <h2>{items.length} item(s) found</h2>
          {items.length === 0 ? (
            <div className="no-results">
              <p>No items match your search criteria.</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;

