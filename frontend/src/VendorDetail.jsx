import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./VendorDetail.css"; // import new CSS

const VendorDetail = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { category, id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState({
    orderId: '',
    rating: 5,
    comment: ''
  });
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    specialInstructions: '',
  });
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [showBookedDates, setShowBookedDates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateDateTime = (date, time) => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    return selectedDateTime > now;
  };

  const checkDateAvailability = async (date) => {
    try {
      if (!vendor) throw new Error('Vendor information not available');

      const response = await fetch('http://localhost:5000/api/orders/check-venue-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: vendor.product_id || vendor.title,
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
      return true;
    }
  };

  const fetchBookedDates = async () => {
    setIsCheckingAvailability(true);
    try {
      if (!vendor) throw new Error('Vendor information not available');
      const vendorId = vendor.product_id || vendor.title;

      const response = await fetch(
        `http://localhost:5000/api/orders/venue-booked-dates/${encodeURIComponent(vendorId)}`
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product/products');
        const data = await response.json();
        
        let vendorData = [];
        if (category === 'wedding-cake') {
          vendorData = data.WeddingCakeData || [];
        } else if (category === 'photographers') {
          vendorData = data.PhotographerData || [];
        } else if (category === 'makeup') {
          vendorData = data.MakeupData || [];
        } else if (category === 'bridal_wear') {
          vendorData = data.BridalWearData || [];
        } else if (category === 'mehndi') {
          vendorData = data.MehndiData || [];
        } else if (category === 'groom_wear') {
          vendorData = data.GroomWearData || [];
        }

        const foundVendor = vendorData.find(v => String(v.product_id) === String(id));
        
        if (!foundVendor) {
          setError('Vendor not found');
        }
        setVendor(foundVendor);

        if (foundVendor) {
          const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/${id}`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.reviews || []);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        setError('Error loading vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, id]);

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
      }
    }

    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewInput({
      ...reviewInput,
      [name]: value,
    });
  };

  const handleSubmitReview = async () => {
    try {
      if (!vendor?.product_id) {
        throw new Error('Vendor information not available');
      }

      // Use the email address directly if no name is available
      const displayName = user.name || 
                       (user.firstName && user.lastName ? 
                         `${user.firstName} ${user.lastName}` : 
                         user.email); // Use full email address directly

      const response = await fetch('http://localhost:5000/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: vendor.product_id,
          orderId: reviewInput.orderId,
          userId: user.email,
          userName: displayName, // Use the full email if no name is available
          rating: reviewInput.rating,
          comment: reviewInput.comment,
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const newReview = {
        userName: displayName,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
        date: new Date().toISOString()
      };
      
      setReviews([...reviews, newReview]);
      setShowReviewModal(false);
      setReviewInput({
        orderId: '',
        rating: 5,
        comment: ''
      });
      alert('Thank you for your review!');

    } catch (error) {
      console.error('Review submission error:', {
        error: error.message,
        orderId: reviewInput.orderId,
        user: user.email,
        product: vendor?.title
      });
      
      let displayMessage = error.message;
      
      if (error.message.includes('Failed to fetch')) {
        displayMessage = 'Network error - please check your connection';
      } else if (error.message.includes('Unexpected token')) {
        displayMessage = 'Server error - please try again later';
      }
      
      alert(`Error submitting review: ${displayMessage}`);
    }
  };

  const sendBookingConfirmationEmail = async (vendorEmail, eventDetails, vendor, client) => {
    try {
      const response = await fetch('http://localhost:5000/api/otp/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: vendorEmail,
          eventDetails,
          vendor,
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
    if (!validateDateTime(eventDetails.eventDate, eventDetails.eventTime)) {
      alert('Please select a future date and time');
      return;
    }

    if (!eventDetails.eventName.trim()) {
      alert('Please enter an event name');
      return;
    }

    const order_id = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderData = {
      order_id,
      customer_email: user.email,
      vendor_email: vendor.vendor_email || 'vendor@example.com',
      item_name: vendor.title,
      item_price: vendor.price,
      item_image_url: vendor.image_url,
      venue_id: vendor.product_id || 'default-venue',
      eventDetails: {
        ...eventDetails,
        eventLocation: eventDetails.eventLocation || vendor.location,
        eventName: eventDetails.eventName || vendor.title
      }
    };

    try {
      setIsSubmitting(true);
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

      const client = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      await sendBookingConfirmationEmail(vendor.vendor_email, eventDetails, vendor, client);

      alert("Order Placed Successfully!");
      setShowModal(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Error creating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="vendor-loading"><h2>Loading...</h2></div>;
  }
  if (error) {
    return <div className="vendor-error"><h2>{error}</h2></div>;
  }
  if (!vendor) {
    return <div className="vendor-notfound"><h2>Vendor not found</h2></div>;
  }

  return (
    <div className="vendor-detail-container">
      <div className="vendor-detail-main">
        <div className="vendor-image-section">
          <img src={vendor.image_url} alt={vendor.title} className="vendor-image" />
        </div>
        <div className="vendor-details-card">
          <h1 className="vendor-title">{vendor.title}</h1>
          <div className="vendor-info">
            <span className="vendor-rating">{vendor.ratings} ⭐</span>
            <span className="vendor-location">{vendor.location}</span>
          </div>
          <div className="price-info-card">
            <h3>Pricing Information</h3>
            <p className="vendor-price">
              {vendor.price ? `INR ${vendor.price}` : 'Price not available'}
            </p>
            <p className="special-deal-text">Special deal available!</p>
          </div>
          <div className="button-group">
            <button onClick={fetchBookedDates} disabled={isCheckingAvailability} className="check-availability-button">
              {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
            </button>
            <button onClick={handleBookNow} className="book-now-button">
              Book Now
            </button>
          </div>
          {showBookedDates && (
            <div className="booked-dates-modal">
              <div className="modal-header">
                <h4>Booked Dates</h4>
                <button onClick={() => setShowBookedDates(false)} className="modal-close-btn">×</button>
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
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Event Details</h2>
            <form>
              <div className="form-group">
                <label>Event Name</label>
                <input type="text" name="eventName" value={eventDetails.eventName} onChange={handleInputChange}
                  placeholder="Enter event name" required className="form-input" />
              </div>
              <div className="form-group">
                <label>Event Date</label>
                <input type="date" name="eventDate" value={eventDetails.eventDate} 
                  onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Event Time</label>
                <input type="time" name="eventTime" value={eventDetails.eventTime} onChange={handleInputChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Event Location</label>
                <input type="text" name="eventLocation" value={eventDetails.eventLocation} onChange={handleInputChange} 
                  required className="form-input" />
              </div>
              <div className="form-group">
                <label>Special Instructions</label>
                <textarea name="specialInstructions" value={eventDetails.specialInstructions} onChange={handleInputChange} className="form-textarea" />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)} className="modal-cancel-btn">Cancel</button>
                <button type="button" onClick={handleSubmit} className="modal-submit-btn">
                  {isSubmitting ? 'Confirming Booking' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showReviewModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
            animation: 'fadeIn 0.3s ease'
          }}>
            <h2 className="modal-title">Write a Review</h2>
            <form>
              <div className="form-group">
                <label>Order ID</label>
                <input type="text" name="orderId" value={reviewInput.orderId} onChange={handleReviewInputChange}
                  placeholder="Enter your order ID" required className="form-input" />
              </div>
              <div className="form-group rating-group">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button"
                      onClick={() => setReviewInput({ ...reviewInput, rating: star })}
                      className={`star-button ${star <= reviewInput.rating ? 'star-filled' : ''}`}
                      style={{ fontSize: '24px', color: star <= reviewInput.rating ? '#ffd700' : '#ccc' }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea name="comment" value={reviewInput.comment} onChange={handleReviewInputChange}
                  placeholder="Share your experience..." required className="form-textarea" />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowReviewModal(false)} className="modal-cancel-btn"
                  style={{ backgroundColor: '#dc3545', color: 'white', marginRight: '10px' }}>Cancel</button>
                <button type="button" onClick={handleSubmitReview} className="modal-submit-btn"
                  style={{ backgroundColor: '#28a745', color: 'white' }}>Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;