import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    eventName: '', // Add event name field
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    specialInstructions: '',
  });

  const validateDateTime = (date, time) => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    return selectedDateTime > now;
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

        // Find the vendor by comparing product_id strings
        const foundVendor = vendorData.find(v => String(v.product_id) === String(id));
        
        if (!foundVendor) {
          setError('Vendor not found');
        }
        setVendor(foundVendor);

        // Only fetch reviews if we found the vendor
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewInput({
      ...reviewInput,
      [name]: value,
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewInput.orderId) {
      alert('Please enter your order ID');
      return;
    }
  
    try {
      // 1. Verify the order exists and belongs to the user
      const orderResponse = await fetch(`http://localhost:5000/api/orders/${reviewInput.orderId}`);
      
      // First check response status
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Order not found or invalid order ID');
      }
  
      const orderData = await orderResponse.json();
      
      // Verify order ownership
      if (orderData.customer_email !== user.email) {
        alert('This order does not belong to you');
        return;
      }
  
      // Verify product match
      if (orderData.item_name !== vendor.title) {
        alert('This order is not for this product');
        return;
      }
  
      // 2. Check for existing review
      const checkReviewResponse = await fetch(
        `http://localhost:5000/api/reviews/check?productId=${id}&orderId=${reviewInput.orderId}`
      );
      
      if (!checkReviewResponse.ok) {
        const errorData = await checkReviewResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to check review status');
      }
  
      const checkReviewData = await checkReviewResponse.json();
      
      if (checkReviewData.exists) {
        alert('You have already reviewed this order');
        return;
      }
  
      // 3. Submit the review
      const reviewResponse = await fetch('http://localhost:5000/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          orderId: reviewInput.orderId,
          userId: user.email,
          userName: user.name,
          rating: reviewInput.rating,
          comment: reviewInput.comment,
          date: new Date().toISOString()
        }),
      });
  
      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }
  
      // Success case
      const newReview = {
        userName: user.name,
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
      
      // User-friendly error messages
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
    try {
      if (!validateDateTime(eventDetails.eventDate, eventDetails.eventTime)) {
        alert('Please select a future date and time');
        return;
      }

      if (!eventDetails.eventName.trim()) {
        alert('Please enter an event name');
        return;
      }

      const orderData = {
        order_id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer_email: user.email,
        vendor_email: vendor.vendor_email || 'vendor@gmail.com',
        item_name: vendor.title,
        item_price: vendor.price,
        item_image_url: vendor.image_url,
        venue_id: vendor.product_id, // Required field
        vendor_id: vendor.product_id, // Add vendor_id
        eventDetails: {
          ...eventDetails,
          eventLocation: eventDetails.eventLocation || vendor.location,
          eventName: eventDetails.eventName || vendor.title
        }
      };

      const response = await fetch('http://localhost:5000/api/orders/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to create order');
      }

      const data = await response.json();
      await sendBookingConfirmationEmail(vendor.vendor_email, eventDetails, vendor, user);
      setShowModal(false);
      alert('Order placed successfully!');
      navigate('/profile');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error placing order');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <h2 style={{ color: '#333' }}>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <h2 style={{ color: '#dc3545' }}>{error}</h2>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <h2 style={{ color: '#333' }}>Vendor not found</h2>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '30px',
        marginTop: '20px'
      }}>
        {/* Image Section */}
        <div style={{
          flex: 1,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={vendor.image_url} 
            alt={vendor.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        {/* Details Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              color: '#333',
              marginBottom: '10px'
            }}>{vendor.title}</h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '15px'
            }}>
              <span style={{
                color: '#ffc107',
                fontWeight: 'bold'
              }}>{vendor.ratings} ⭐</span>
              <span style={{ color: '#666' }}>{vendor.location}</span>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              margin: '15px 0'
            }}>
              <h3 style={{
                margin: '0 0 10px 0',
                color: '#333',
                fontSize: '18px'
              }}>Pricing Information</h3>
              <p style={{
                margin: '5px 0',
                fontSize: '16px'
              }}>
                <strong>Price:</strong> {vendor.price ? `INR ${vendor.price}` : 'Price not available'}
              </p>
              <p style={{
                color: '#ff5a5f',
                fontWeight: 'bold',
                margin: '5px 0 0 0'
              }}>Special deal available!</p>
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '20px'
            }}>
              <button 
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={e => e.target.style.backgroundColor = '#e9ecef'}
                onMouseOut={e => e.target.style.backgroundColor = '#f8f9fa'}
              >
                ❤️ Wishlist
              </button>
              
              <button 
                onClick={handleBookNow}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ff5a5f',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={e => e.target.style.backgroundColor = '#e04a50'}
                onMouseOut={e => e.target.style.backgroundColor = '#ff5a5f'}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Additional Vendor Details */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '20px'
            }}>About This Vendor</h3>
            <p style={{
              margin: 0,
              color: '#555',
              lineHeight: '1.6'
            }}>
              {vendor.description || 'No additional information available.'}
            </p>
          </div>

          {/* Reviews Section */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#333',
                fontSize: '20px'
              }}>Customer Reviews</h3>
              {user && (
                <button 
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={e => e.target.style.backgroundColor = '#007bff'}
                >
                  Write a Review
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>No reviews yet. Be the first to review!</p>
            ) : (
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '10px'
              }}>
                {reviews.map((review, index) => (
                  <div key={index} style={{
                    borderBottom: '1px solid #eee',
                    padding: '15px 0',
                    ':last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        fontWeight: 'bold',
                        color: '#333'
                      }}>
                        {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p style={{
                          margin: 0,
                          fontWeight: 'bold',
                          color: '#333'
                        }}>{review.userName || 'Anonymous'}</p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '2px'
                        }}>
                          <span style={{
                            color: '#ffc107',
                            marginRight: '5px'
                          }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                          <span style={{
                            color: '#999',
                            fontSize: '12px'
                          }}>
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p style={{
                      margin: 0,
                      color: '#555',
                      lineHeight: '1.5'
                    }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              color: '#333',
              textAlign: 'center'
            }}>Event Details</h2>
            
            <form>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventDetails.eventName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter event name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventDetails.eventDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Event Time</label>
                <input
                  type="time"
                  name="eventTime"
                  value={eventDetails.eventTime}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Event Location</label>
                <input
                  type="text"
                  name="eventLocation"
                  value={eventDetails.eventLocation}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={eventDetails.specialInstructions}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#5a6268'}
                  onMouseOut={e => e.target.style.backgroundColor = '#6c757d'}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={e => e.target.style.backgroundColor = '#28a745'}
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              color: '#333',
              textAlign: 'center'
            }}>Write a Review</h2>
            
            <form>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Order ID</label>
                <input
                  type="text"
                  name="orderId"
                  value={reviewInput.orderId}
                  onChange={handleReviewInputChange}
                  required
                  placeholder="Enter your order ID"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Rating</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewInput({...reviewInput, rating: star})}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: star <= reviewInput.rating ? '#ffc107' : '#ddd',
                        padding: 0
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>Your Review</label>
                <textarea
                  name="comment"
                  value={reviewInput.comment}
                  onChange={handleReviewInputChange}
                  required
                  placeholder="Share your experience with this vendor..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#5a6268'}
                  onMouseOut={e => e.target.style.backgroundColor = '#6c757d'}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={e => e.target.style.backgroundColor = '#007bff'}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;