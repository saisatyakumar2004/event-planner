import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./VenueDetail.css"; // new CSS for modern design
import  ReviewModal from './components/ReviewModal'; // Assuming you have a ReviewModal component
import './components/ReviewModal.css'; // CSS for ReviewModal
const VenueDetail = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    specialInstructions: '',
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [showBookedDates, setShowBookedDates] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  const validateDateTime = (date, time) => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    return selectedDateTime > now;
  };

  const checkDateAvailability = async (date) => {
    try {
      if (!venue) throw new Error('Venue information not available');

      const response = await fetch('http://localhost:5000/api/orders/check-venue-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: venue.product_id || venue.title, // Use product_id or fallback to title
          date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      return data.isAvailable;
    } catch (error) {
      console.error('Error checking availability:', error);
      return true; // Default to true to avoid blocking date selection on error
    }
  };

  const fetchBookedDates = async () => {
    setIsCheckingAvailability(true);
    try {
      if (!venue) throw new Error('Venue information not available');
      const venueId = venue.product_id || venue.title;

      const response = await fetch(
        `http://localhost:5000/api/orders/venue-booked-dates/${encodeURIComponent(venueId)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch booked dates');
      }

      const data = await response.json();
      setBookedDates(data.bookedDates || []);
      setShowBookedDates(true);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
      setBookedDates([]);
      alert('Unable to fetch booked dates. Please try again later.');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Fetch all venues from the backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product/venues');
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Error loading venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Find the specific venue by matching the id from params
  useEffect(() => {
    if (venues.length > 0) {
      const foundVenue = venues.find((v) => v.product_id === id);
      if (foundVenue) {
        setVenue(foundVenue);
      } else {
        setError('Venue not found');
      }
    }
  }, [venues, id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!venue?.product_id) return;
        const response = await fetch(`http://localhost:5000/api/reviews/${venue.product_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (venue) {
      fetchReviews();
    }
  }, [venue]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'eventDate') {
      try {
        const isAvailable = await checkDateAvailability(value);
        if (!isAvailable) {
          alert('This date is already booked. Please select another date.');
          return;
        }
      } catch (error) {
        console.error('Date availability check failed:', error);
        // Don't block the date selection on error
      }
    }

    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendBookingConfirmationEmail = async (vendorEmail, eventDetails, venue, client) => {
    try {
      const response = await fetch('http://localhost:5000/api/otp/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: vendorEmail,
          eventDetails,
          vendor: venue,
          client,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send booking confirmation email');
      }

      const data = await response.json();
      console.log(data.msg);
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get current user data with phone number
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      // Validate date and time
      if (!validateDateTime(eventDetails.eventDate, eventDetails.eventTime)) {
        alert('Please select a future date and time');
        return;
      }

      // Validate event name
      if (!eventDetails.eventName.trim()) {
        alert('Please enter an event name');
        return;
      }

      // Generate unique order ID
      const order_id = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Prepare order data with all required fields
      const orderData = {
        order_id,
        customer_email: currentUser.email,
        customer_phone: currentUser.phoneNumber, // Explicitly use phoneNumber from user data
        vendor_email: venue.vendor_email || 'vendor@example.com',
        item_name: venue.title || 'Venue Booking',
        item_price: venue.price || 0,
        item_image_url: venue.image_url || '',
        venue_id: venue.product_id || 'default-venue',
        eventDetails: {
          ...eventDetails,
          eventLocation: eventDetails.eventLocation || venue.location || '',
          eventName: eventDetails.eventName || venue.title || 'Event'
        }
      };

      // Make API call to add order
      const response = await fetch('http://localhost:5000/api/orders/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await response.json();

      // Send booking confirmation email
      await sendBookingConfirmationEmail(orderData.vendor_email, orderData.eventDetails, venue, user);

      alert('Booking successful!');
      setShowModal(false);

      // Update user's order history if needed
      if (data.updatedUser) {
        localStorage.setItem('user', JSON.stringify(data.updatedUser));
      }

    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Error creating order: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (!venue?.product_id) {
        throw new Error('Venue information not available');
      }

      // Get first name and last name from user object
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const userName = `${firstName} ${lastName}`.trim() || user.email;

      const response = await fetch('http://localhost:5000/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewData,
          productId: venue.product_id,
          userId: user.email,
          userName,
          comment: reviewData.comment // Ensure we're sending 'comment' instead of 'review'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const newReview = await response.json();
      setReviews(prevReviews => [newReview, ...prevReviews]);
      setShowReviewModal(false);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Review submission error:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  if (error) {
    return <h2 className="error-text">{error}</h2>;
  }

  if (!venue) {
    return <h2 className="not-found-text">Venue not found</h2>;
  }

  return (
    <div className="venue-detail-container">
      <div className="venue-detail-main">
        {/* Image Section */}
        <div className="venue-detail-image">
          <img 
            src={venue.image_url} 
            alt={venue.title} 
            className="venue-image"
          />
        </div>

        {/* Details Card */}
        <div className="venue-detail-card">
          <h2 className="venue-title">{venue.title}</h2>
          <p className="venue-location">{venue.location}</p>
          <div className="venue-rating">
            <span>{venue.ratings} ⭐</span>
          </div>

          <div className="price-card">
            <h3>Starting Price</h3>
            <p>
              Total Price: {venue.price ? `INR ${venue.price}` : 'Price not available'}
            </p>
            <p className="special-deal">Special deal!!</p>
          </div>

          <button 
            onClick={fetchBookedDates}
            disabled={isCheckingAvailability}
            className="button button-check"
          >
            {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
          </button>

          {showBookedDates && (
            <div className="booked-dates-box">
              <div className="booked-dates-header">
                <h4>Booked Dates</h4>
                <button onClick={() => setShowBookedDates(false)} className="modal-close-btn">
                  ×
                </button>
              </div>
              {bookedDates.length > 0 ? (
                <ul className="booked-dates-list">
                  {bookedDates.map((date, index) => (
                    <li key={index} className="booked-date-item">
                      {new Date(date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-booked-text">No dates are currently booked</p>
              )}
            </div>
          )}

          <div className="button-group">
            <button 
              onClick={handleBookNow}
              className="button button-book"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        <button 
          onClick={() => user ? setShowReviewModal(true) : navigate('/login')}
          className="write-review-btn"
        >
          Write a Review
        </button>
        
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.userName}</span>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>

        <ReviewModal 
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      </div>

      {/* Modal for Event Details */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Enter Event Details</h2>
            <form>
              <div className="form-group">
                <label>Event Name:</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventDetails.eventName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter event name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Event Date:</label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventDetails.eventDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Event Time:</label>
                <input
                  type="time"
                  name="eventTime"
                  value={eventDetails.eventTime}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Special Instructions:</label>
                <textarea
                  name="specialInstructions"
                  value={eventDetails.specialInstructions}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>
              <div className="venue-location-box">
                <label className="location-label">Venue Location:</label>
                <p className="location-text">{venue.location}</p>
              </div>
              <div className="modal-buttons">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="button modal-btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  className="button modal-btn-submit"
                >
                  {isSubmitting ? 'Confirming Booking' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetail;