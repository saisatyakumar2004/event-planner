import React, { useState } from 'react';
import './OrderCard.css'; // Ensure you create this CSS file for styling
import axios from 'axios';

const OrderCard = ({ order }) => {
  const [showModal, setShowModal] = useState(false);

  const acceptOrder = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/order-vendor/accept/${order.order_id}`);
      if (response.status === 200) {
        alert('Order Accepted Successfully!');
      } else if (response.status === 400) {
        alert('Order Already Accepted!');
      } else {
        alert('Failed to accept the order.');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('An error occurred while accepting the order.');
    }
  };

  const rejectOrder = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/order-vendor/reject/${order.order_id}`, {
        status: 'rejected',
      });
      if (response.status === 200) {
        alert(`Order ${order.order_id} rejected successfully!`);
      } else if (response.status === 400) {
        alert('Order Already Rejected!');
      } else {
        alert('Failed to reject the order.');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('An error occurred while rejecting the order.');
    }
  };

  return (
    <div className="orderCard">
      <div className="orderCardSection">
        <div className="orderCardLeft">
          <span className="orderCardLabel">Order ID:</span>
          <span className="orderCardValue">{order.order_id}</span>
        </div>
        <div className="orderCardRight">
          <span className="orderCardLabel">Price:</span>
          <span className="orderCardValue">{order.item_price}</span>
        </div>
      </div>
      <div className="orderCardSection">
        <div className="orderCardLeft">
          <span className="orderCardLabel">Item Name:</span>
          <span className="orderCardValue">{order.item_name}</span>
        </div>
        <div className="orderCardRight">
          <span className="orderCardLabel">Customer Email:</span>
          <span className="orderCardValue">{order.customer_email}</span>
        </div>
      </div>
      <div className="orderCardActions">
        <button className="rejectButton" onClick={rejectOrder}>Reject</button>
        <button className="detailsButton" onClick={() => setShowModal(true)}>Details</button>
        <button className="acceptButton" onClick={acceptOrder}>Accept</button>
      </div>

      {/* Modal for displaying event details */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Event Details</h2>
            <p><strong>Event Date:</strong> {order.eventDetails?.eventDate}</p>
            <p><strong>Event Time:</strong> {order.eventDetails?.eventTime}</p>
            <p><strong>Event Location:</strong> {order.eventDetails?.eventLocation}</p>
            <p><strong>Special Instructions:</strong> {order.eventDetails?.specialInstructions || 'None'}</p>
            <button className="closeButton" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
