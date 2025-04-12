import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const validateDateTime = (date, time) => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    return selectedDateTime > now;
  };

  const checkDateAvailability = async (date) => {
    try {
      if (!venue) throw new Error('Venue information not available');

      const response = await fetch('https://event-planner-y4fw.onrender.com/api/orders/check-venue-availability', {
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
        `https://event-planner-y4fw.onrender.com/api/orders/venue-booked-dates/${encodeURIComponent(venueId)}`
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
        const response = await axios.get('https://event-planner-y4fw.onrender.com/api/product/venues');
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
      const response = await fetch('https://event-planner-y4fw.onrender.com/api/otp/send-booking-confirmation', {
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
    if (!eventDetails.eventName.trim()) {
      alert('Please enter an event name');
      return;
    }

    if (!validateDateTime(eventDetails.eventDate, eventDetails.eventTime)) {
      alert('Please select a future date and time');
      return;
    }

    const orderDetails = {
      customer_email: user.email,
      vendor_email: venue.vendor_email || 'vendor@gmail.com',
      item_name: venue.title,
      item_price: venue.price,
      item_image_url: venue.image_url,
      accepted: false,
      venue_id: venue.product_id,
      eventDetails: {
        ...eventDetails,
        eventLocation: venue.location,
      },
    };

    try {
      const response = await fetch('https://event-planner-y4fw.onrender.com/api/orders/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const orderData = await response.json();
        const orderId = orderData.order.order_id;

        // Update user's order history
        const userUpdateResponse = await fetch(`https://event-planner-y4fw.onrender.com/api/user/updateOrderHistory`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email, orderId }),
        });

        if (userUpdateResponse.ok) {
          const client = {
            name: user.name,
            email: user.email,
            phone: user.phone,
          };
          await sendBookingConfirmationEmail(venue.vendor_email, eventDetails, venue, client);

          alert("Order Placed Successfully!");
          navigate('/profile');
        } else {
          console.error('Error updating order history:', await userUpdateResponse.json());
        }
      } else {
        const errorData = await response.json();
        console.error('Error adding order:', errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '20px' }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</h2>;
  }

  if (!venue) {
    return <h2 style={{ textAlign: 'center', padding: '20px' }}>Venue not found</h2>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '30px',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
      }}>
        {/* Image Section */}
        <div style={{
          width: window.innerWidth <= 768 ? '100%' : '50%'
        }}>
          <img 
            src={venue.image_url} 
            alt={venue.title} 
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

        {/* Details Card */}
        <div style={{
          width: window.innerWidth <= 768 ? '100%' : '45%',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            color: '#333'
          }}>{venue.title}</h2>
          
          <p style={{
            margin: '5px 0',
            color: '#666'
          }}>{venue.location}</p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#ffc107',
            fontWeight: 'bold'
          }}>
            <span>{venue.ratings} ⭐</span>
          </div>
          
          {/* Price Card */}
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            margin: '15px 0'
          }}>
            <h3 style={{
              marginBottom: '10px',
              color: '#333'
            }}>Starting Price</h3>
            <p style={{ margin: '5px 0' }}>
              Total Price: {venue.price ? `INR ${venue.price}` : 'Price not available'}
            </p>
            <p style={{
              color: '#ff5a5f',
              fontWeight: 'bold',
              marginTop: '5px'
            }}>Special deal!!</p>
          </div>

          <button 
            onClick={fetchBookedDates}
            disabled={isCheckingAvailability}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isCheckingAvailability ? 'wait' : 'pointer',
              opacity: isCheckingAvailability ? 0.7 : 1
            }}
          >
            {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
          </button>

          {showBookedDates && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h4 style={{ margin: 0 }}>Booked Dates</h4>
                <button 
                  onClick={() => setShowBookedDates(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              {bookedDates.length > 0 ? (
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0 
                }}>
                  {bookedDates.map((date, index) => (
                    <li key={index} style={{
                      padding: '5px',
                      marginBottom: '5px',
                      backgroundColor: '#fee2e2',
                      borderRadius: '3px',
                      color: '#dc2626'
                    }}>
                      {new Date(date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: '#16a34a' }}>No dates are currently booked</p>
              )}
            </div>
          )}
          
          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginTop: '10px'
          }}>
            <button 
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '50%',
                backgroundColor: '#f8f8f8',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e8e8e8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f8f8f8'}
            >
              ❤️ Wishlist
            </button>
            
            <button 
              onClick={handleBookNow}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '50%',
                backgroundColor: '#ff5a5f',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e04a50'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff5a5f'}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Event Details */}
      {showModal && (
        <div style={{
          position: 'fixed',
          zIndex: 1000,
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: '90%',
            maxWidth: '400px',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{
              margin: '0 0 20px',
              fontSize: '1.5rem',
              textAlign: 'center',
              color: '#333'
            }}>Enter Event Details</h2>
            
            <form>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                fontSize: '0.9rem',
                color: '#333',
                marginBottom: '15px'
              }}>
                <label>Event Name:</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventDetails.eventName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter event name"
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                fontSize: '0.9rem',
                color: '#333',
                marginBottom: '15px'
              }}>
                <label>Event Date:</label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventDetails.eventDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                fontSize: '0.9rem',
                color: '#333',
                marginBottom: '15px'
              }}>
                <label>Event Time:</label>
                <input
                  type="time"
                  name="eventTime"
                  value={eventDetails.eventTime}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                fontSize: '0.9rem',
                color: '#333',
                marginBottom: '15px'
              }}>
                <label>Special Instructions:</label>
                <textarea
                  name="specialInstructions"
                  value={eventDetails.specialInstructions}
                  onChange={handleInputChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
              </div>
              
              <div className="venue-location" style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Venue Location:</label>
                <p style={{margin: 0, color: '#666'}}>{venue.location}</p>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '15px'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Cancel
                </button>
                
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    backgroundColor: '#28a745',
                    color: 'white',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  Submit
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