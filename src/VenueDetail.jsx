import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import './VenueDetail.css';

const VenueDetail = () => {
  const { id } = useParams(); // Extract venue ID from URL
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [venues, setVenues] = useState([]); // State to store the fetched venue array
  const [venue, setVenue] = useState(null); // State to store the selected venue
  const [error, setError] = useState(null); // State to handle errors

  // Fetch all venues from the backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product/venues'); // Fetch all venues
        console.log(response.data);
        setVenues(response.data); // Store the array of venues
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Error loading venues');
      }
    };

    fetchVenues();
  }, []);

  // Find the specific venue by matching the id from params
  useEffect(() => {
    if (venues.length > 0) {
      const foundVenue = venues.find((v) => v.product_id === id); // Directly compare the id
      if (foundVenue) {
        setVenue(foundVenue); // Set the matching venue

      } else {
        setError('Venue not found');
      }
    }
  }, [venues, id]);

  if (!venue) {
    return <h2>{error || 'Loading venue details...'}</h2>; // Display loading or error message
  }

  const handleBookNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const orderDetails = {
      customer_email: user.email,
      vendor_email: venue.vendor_email || 'vendor@gmail.com', // Fetched vendor email
      item_name: venue.title,
      item_price: venue.price,
      item_image_url: venue.image_url, // Use fetched image URL
      accepted: false,
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const orderData = await response.json(); // Get the order data including the generated order ID
        const orderId = orderData.order.order_id; // Adjust this based on your response structure

        // Update user's order history
        const userUpdateResponse = await fetch(`http://localhost:5000/api/user/updateOrderHistory`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email, orderId }), // Send email and order ID to update
        });

        if (userUpdateResponse.ok) {
          alert("Order placed successfully!");
          navigate('/profile'); // Redirect to profile after updating order history
        } else {
          console.error('Error updating order history:', await userUpdateResponse.json());
        }
      } else {
        const errorData = await response.json();
        console.error('Error adding order:', errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="venue-detail-container">
      <div className="image-price-section">
        <div className="image-section">
          <img src={venue.image_url} alt={venue.title} /> {/* Updated to match the backend field */}
        </div>
        <div className="price-card">
          <h3 className='h3Class'>Starting Price</h3>
          <p>Total Price: {venue.price ? `INR ${venue.price}` : 'Price not available'}</p>
          <p className="special-deal">Special deal!!</p>
        </div>
      </div>
      <div className="details-card">
        <h2>{venue.title}</h2>
        <p>{venue.location}</p>
        <div className="rating-section">
          <span>{venue.ratings} ⭐</span> {/* Updated to match the backend field */}
        </div>
        <div className="button-group">
          <button className="wishlist-button">❤️ Wishlist</button>
          <button className="book-button" onClick={handleBookNow}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
