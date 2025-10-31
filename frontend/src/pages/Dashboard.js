import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  
  const [myItems, setMyItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(isAdmin && (user?.role === 'admin' || user?.is_superuser) ? 'admin' : 'my');

  useEffect(() => {
    if (activeTab === 'my') {
      fetchMyItems();
    } else if (activeTab === 'admin') {
      fetchPendingItems();
    }
  }, [activeTab]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/my_items/');
      setMyItems(response.data);
    } catch (error) {
      console.error('Error fetching my items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/pending_items/');
      setPendingItems(response.data);
    } catch (error) {
      console.error('Error fetching pending items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId, status) => {
    try {
      await api.patch(`/items/${itemId}/update_status/`, { status });
      setPendingItems(pendingItems.filter(item => item.id !== itemId));
      alert(`Item status updated to ${status}`);
      fetchPendingItems();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const isAdminUser = user && (user.role === 'admin' || user.is_superuser);

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      {isAdminUser && (
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'my' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('my')}
          >
            My Items
          </button>
          <button
            className={activeTab === 'admin' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('admin')}
          >
            Admin Panel
          </button>
        </div>
      )}

      {activeTab === 'my' && (
        <div className="dashboard-section">
          <h2>My Posted Items</h2>
          {myItems.length === 0 ? (
            <div className="no-items">
              <p>You haven't posted any items yet.</p>
              <a href="/post-item" className="link-button">Post an Item</a>
            </div>
          ) : (
            <div className="items-grid">
              {myItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'admin' && isAdminUser && (
        <div className="dashboard-section">
          <h2>Pending Items for Review</h2>
          {pendingItems.length === 0 ? (
            <div className="no-items">
              <p>No pending items to review.</p>
            </div>
          ) : (
            <div className="items-grid">
              {pendingItems.map((item) => (
                <div key={item.id} className="admin-item-card">
                  <ItemCard item={item} />
                  <div className="admin-actions">
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'approved')}
                      className="action-button approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'rejected')}
                      className="action-button reject"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

