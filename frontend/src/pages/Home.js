import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import './Home.css';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/');
      setItems(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load items. Please try again later.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading items...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Welcome to Lost & Found Portal</h1>
        <p>Find lost items or report found items on campus</p>
      </div>
      
      <div className="items-section">
        <h2>Recent Items</h2>
        {items.length === 0 ? (
          <div className="no-items">
            <p>No items found. Be the first to post an item!</p>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

