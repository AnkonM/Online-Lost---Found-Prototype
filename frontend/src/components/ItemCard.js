import React from 'react';
import './ItemCard.css';

function ItemCard({ item }) {
  const statusColors = {
    approved: '#27ae60',
    pending: '#f39c12',
    rejected: '#e74c3c',
  };

  return (
    <div className="item-card">
      {item.image_url && (
        <div className="item-image">
          <img src={item.image_url} alt={item.title} />
        </div>
      )}
      <div className="item-content">
        <div className="item-header">
          <h3 className="item-title">{item.title}</h3>
          <span
            className="item-status"
            style={{ backgroundColor: statusColors[item.status] }}
          >
            {item.status}
          </span>
        </div>
        <div className="item-meta">
          <span className="item-type">{item.type}</span>
          <span className="item-date">{new Date(item.date).toLocaleDateString()}</span>
        </div>
        <p className="item-description">{item.description}</p>
        <div className="item-footer">
          <span className="item-location">📍 {item.location}</span>
          {item.user_email && (
            <span className="item-user">Posted by: {item.user_email}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;

