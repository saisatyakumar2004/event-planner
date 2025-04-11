// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Import axios for API requests
// import './VenueDetail.css';

// const VenueDetail = () => {
//   const { id } = useParams(); // Extract venue ID from URL
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));
//   const [venues, setVenues] = useState([]); // State to store the fetched venue array
//   const [venue, setVenue] = useState(null); // State to store the selected venue
//   const [error, setError] = useState(null); // State to handle errors

//   // Fetch all venues from the backend
//   useEffect(() => {
//     const fetchVenues = async () => {
//       try {
//         const response = await axios.get('https://event-planner-y4fw.onrender.com/api/product/venues'); // Fetch all venues
//         console.log(response.data);
//         setVenues(response.data); // Store the array of venues
//       } catch (error) {
//         console.error('Error fetching venues:', error);
//         setError('Error loading venues');
//       }
//     };

//     fetchVenues();
//   }, []);

//   // Find the specific venue by matching the id from params
//   useEffect(() => {
//     if (venues.length > 0) {
//       const foundVenue = venues.find((v) => v.product_id === id); // Directly compare the id
//       if (foundVenue) {
//         setVenue(foundVenue); // Set the matching venue

//       } else {
//         setError('Venue not found');
//       }
//     }
//   }, [venues, id]);

//   if (!venue) {
//     return <h2>{error || 'Loading venue details...'}</h2>; // Display loading or error message
//   }

//   const handleBookNow = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     const orderDetails = {
//       customer_email: user.email,
//       vendor_email: venue.vendor_email || 'vendor@gmail.com', // Fetched vendor email
//       item_name: venue.title,
//       item_price: venue.price,
//       item_image_url: venue.image_url, // Use fetched image URL
//       accepted: false,
//     };

//     try {
//       const response = await fetch('https://event-planner-y4fw.onrender.com/api/orders/addOrder', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderDetails),
//       });

//       if (response.ok) {
//         const orderData = await response.json(); // Get the order data including the generated order ID
//         const orderId = orderData.order.order_id; // Adjust this based on your response structure

//         // Update user's order history
//         const userUpdateResponse = await fetch(`https://event-planner-y4fw.onrender.com/api/user/updateOrderHistory`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email: user.email, orderId }), // Send email and order ID to update
//         });

//         if (userUpdateResponse.ok) {
//           alert("Order placed successfully!");
//           navigate('/profile'); // Redirect to profile after updating order history
//         } else {
//           console.error('Error updating order history:', await userUpdateResponse.json());
//         }
//       } else {
//         const errorData = await response.json();
//         console.error('Error adding order:', errorData.message || response.statusText);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="venue-detail-container">
//       <div className="image-price-section">
//         <div className="image-section">
//           <img src={venue.image_url} alt={venue.title} /> {/* Updated to match the backend field */}
//         </div>
//         <div className="price-card">
//           <h3 className='h3Class'>Starting Price</h3>
//           <p>Total Price: {venue.price ? `INR ${venue.price}` : 'Price not available'}</p>
//           <p className="special-deal">Special deal!!</p>
//         </div>
//       </div>
//       <div className="details-card">
//         <h2>{venue.title}</h2>
//         <p>{venue.location}</p>
//         <div className="rating-section">
//           <span>{venue.ratings} ⭐</span> {/* Updated to match the backend field */}
//         </div>
//         <div className="button-group">
//           <button className="wishlist-button">❤️ Wishlist</button>
//           <button className="book-button" onClick={handleBookNow}>Book Now</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VenueDetail;

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
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    specialInstructions: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
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
    const orderDetails = {
      customer_email: user.email,
      vendor_email: venue.vendor_email || 'vendor@gmail.com',
      item_name: venue.title,
      item_price: venue.price,
      item_image_url: venue.image_url,
      accepted: false,
      eventDetails,
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
                <label>Event Date:</label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventDetails.eventDate}
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
                <label>Event Location:</label>
                <input
                  type="text"
                  name="eventLocation"
                  value={eventDetails.eventLocation}
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