import React, { useState } from 'react';
import './OrderCard.css'; // Ensure you create this CSS file for styling
import axios from 'axios';

const OrderCard = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(order.accepted); // Track accepted status
  const [isRejected, setIsRejected] = useState(order.rejected); // Track rejected status
  const [isAccepting, setIsAccepting] = useState(false); // NEW state for showing loading text
  const [isRejecting, setIsRejecting] = useState(false); // NEW state for showing loading text

  const acceptOrder = async () => {
    setIsAccepting(true);
    try {
      const response = await axios.put(`https://event-planner-ihsd.onrender.com/api/order-vendor/accept/${order.order_id}`);
      if (response.status === 200) {
        setIsAccepted(true); // Update local state
        alert('Order Accepted Successfully!');
      } else if (response.status === 400) {
        alert('Order Already Accepted!');
      } else {
        alert('Failed to accept the order.');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('An error occurred while accepting the order.');
    } finally {
      setIsAccepting(false);
    }
  };

  const rejectOrder = async () => {
    setIsRejecting(true);
    try {
      const response = await axios.put(`https://event-planner-ihsd.onrender.com/api/order-vendor/reject/${order.order_id}`, {
        rejected: true, // Send rejected status to the backend
      });
      if (response.status === 200) {
        setIsRejected(true); // Update local states
        alert(`Order ${order.order_id} rejected successfully!`);
      } else if (response.status === 400) {
        alert('Order Already Rejected!');
      } else {
        alert('Failed to reject the order.');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('An error occurred while rejecting the order.');
    } finally {
      setIsRejecting(false);
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
          <div className="customerInfo">
            <div>
              <span className="orderCardLabel">Customer Email:</span>
              <span className="orderCardValue">{order.customer_email}</span>
            </div>
            <div>
              <span className="orderCardLabel">Customer Phone:</span>
              <span className="orderCardValue">
                {order.customer_phone ? order.customer_phone : 'Not provided'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="orderCardSection">
        <div className="orderCardLeft">
          <span className="orderCardLabel">Item Name:</span>
          <span className="orderCardValue">{order.item_name}</span>
        </div>
        <div className="orderCardRight">
          <span className="orderCardLabel">Price:</span>
          <span className="orderCardValue">{order.item_price}</span>
        </div>
      </div>
      <div className="orderCardActions">
        {!isAccepted && !isRejected && ( // Show buttons only if the order is neither accepted nor rejected
          <>
            <button className="rejectButton" onClick={rejectOrder}>
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </button>
            <button className="detailsButton" onClick={() => setShowModal(true)}>Details</button>
            <button className="acceptButton" onClick={acceptOrder}>
              {isAccepting ? 'Accepting...' : 'Accept'}
            </button>
          </>
        )}
        {isAccepted && <p style={{ backgroundColor: 'green', padding: '10px', borderRadius: '5px', color: 'white' }}>You accepted the order.</p>}
        {isRejected && <p style={{ backgroundColor: 'red', padding: '10px', borderRadius: '5px', color: 'white' }}>You rejected the order.</p>}
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