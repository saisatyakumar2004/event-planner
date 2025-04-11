// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import './VendorDetail.css'; // Import the same CSS styles

// // const VendorDetail = () => {
// //   const navigate = useNavigate();
// //   const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
// //   const { category, id } = useParams(); // Get both category and id from URL params
// //   const [vendor, setVendor] = useState(null); // State to hold the vendor data
// //   const [loading, setLoading] = useState(true); // State to manage loading
// //   const [showModal, setShowModal] = useState(false); // State to manage modal visibility
// //   const [eventDetails, setEventDetails] = useState({
// //     eventDate: '',
// //     eventTime: '',
// //     eventLocation: '',
// //     specialInstructions: '',
// //   });

// //   useEffect(() => {
// //     // Function to fetch data from MongoDB
// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch('https://event-planner-y4fw.onrender.com/api/product/products'); // Fetch from API
// //         const data = await response.json();
        
// //         let vendorData = [];
// //         if (category === 'wedding-cake') {
// //           vendorData = Array.isArray(data.WeddingCakeData) ? data.WeddingCakeData : [];
// //         }if (category === 'photographers') {
// //           vendorData = Array.isArray(data.PhotographerData) ? data.PhotographerData : [];
// //         }

// //         const foundVendor = vendorData.find((v) => v.product_id === id); // Match product ID
// //         setVendor(foundVendor);
// //       } catch (error) {
// //         console.error('Error fetching vendor data:', error);
// //       } finally {
// //         setLoading(false); // Stop loading after data is fetched
// //       }
// //     };

// //     fetchData();
// //   }, [category, id]);

// //   const handleBookNow = () => {
// //     if (!user) {
// //       navigate('/login'); // Redirect to login if user is not authenticated
// //       return;
// //     }
// //     setShowModal(true); // Show the modal
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setEventDetails({
// //       ...eventDetails,
// //       [name]: value,
// //     });
// //   };

// //   const handleSubmit = async () => {
// //     const orderDetails = {
// //       customer_email: user.email,
// //       vendor_email: vendor.vendor_email || 'vendor@gmail.com', // Fallback email
// //       item_name: vendor.title,
// //       item_price: vendor.price,
// //       item_image_url: vendor.image_url,
// //       accepted: false,
// //       eventDetails, // Include event details in the order
// //     };

// //     try {
// //       const response = await fetch('https://event-planner-y4fw.onrender.com/api/orders/addOrder', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(orderDetails),
// //       });

// //       if (response.ok) {
// //         const orderData = await response.json(); // Get the order data including the generated order ID
// //         const orderId = orderData.order.order_id; // Adjust this based on your response structure

// //         // Update user's order history
// //         const userUpdateResponse = await fetch('https://event-planner-y4fw.onrender.com/api/user/updateOrderHistory', {
// //           method: 'PUT',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({ email: user.email, orderId }), // Send email and order ID to update
// //         });

// //         if (userUpdateResponse.ok) {
// //           alert("Order Placed Successfully!");
// //           navigate('/profile'); // Redirect to profile after updating order history
// //         } else {
// //           console.error('Error updating order history:', await userUpdateResponse.json());
// //         }
// //       } else {
// //         const errorData = await response.json();
// //         console.error('Error adding order:', errorData.message || response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //     } finally {
// //       setShowModal(false); // Close the modal after submission
// //     }
// //   };

// //   if (loading) {
// //     return <h2>Loading...</h2>; // Display loading message while fetching
// //   }

// //   if (!vendor) {
// //     return <h2>Vendor Not Found</h2>; // Display a message if vendor is not found
// //   }

// //   return (
// //     <div className="vendor-detail-container">
// //       <div className="image-price-section">
// //         <div className="image-section">
// //           <img src={vendor.image_url} alt={vendor.title} />
// //         </div>
// //         <div className="price-card">
// //           <h3 className="h3Class">Starting Price</h3>
// //           <p>Total Price: {vendor.price ? `INR ${vendor.price}` : 'Price not available'}</p>
// //           <p className="special-deal">Special deal!!</p>
// //         </div>
// //       </div>
// //       <div className="details-card">
// //         <h2>{vendor.title}</h2>
// //         <p>{vendor.location}</p>
// //         <div className="rating-section">
// //           <span>{vendor.ratings} ⭐</span>
// //         </div>
// //         <div className="button-group">
// //           <button className="wishlist-button">❤️ Wishlist</button>
// //           <button className="book-button" onClick={handleBookNow}>Book Now</button>
// //         </div>
// //       </div>

// //       {showModal && (
// //   <div className="modal-overlay">
// //     <div className="modal-content">
// //       <h2>Enter Event Details</h2>
// //       <form>
// //         <label>
// //           Event Date:
// //           <input
// //             type="date"
// //             name="eventDate"
// //             value={eventDetails.eventDate}
// //             onChange={handleInputChange}
// //             required
// //           />
// //         </label>
// //         <label>
// //           Event Time:
// //           <input
// //             type="time"
// //             name="eventTime"
// //             value={eventDetails.eventTime}
// //             onChange={handleInputChange}
// //             required
// //           />
// //         </label>
// //         <label>
// //           Event Location:
// //           <input
// //             type="text"
// //             name="eventLocation"
// //             value={eventDetails.eventLocation}
// //             onChange={handleInputChange}
// //             required
// //           />
// //         </label>
// //         <label>
// //           Special Instructions:
// //           <textarea
// //             name="specialInstructions"
// //             value={eventDetails.specialInstructions}
// //             onChange={handleInputChange}
// //           />
// //         </label>
// //         <div className="modal-buttons">
// //           <button type="button" onClick={() => setShowModal(false)}>
// //             Cancel
// //           </button>
// //           <button type="button" onClick={handleSubmit}>
// //             Submit
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   );
// // };

// // export default VendorDetail;






// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './VendorDetail.css';

// const VendorDetail = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
//   const { category, id } = useParams(); // Get both category and id from URL params
//   const [vendor, setVendor] = useState(null); // State to hold the vendor data
//   const [loading, setLoading] = useState(true); // State to manage loading
//   const [showModal, setShowModal] = useState(false); // State to manage modal visibility
//   const [eventDetails, setEventDetails] = useState({
//     eventDate: '',
//     eventTime: '',
//     eventLocation: '',
//     specialInstructions: '',
//   });

//   useEffect(() => {
//     // Function to fetch data from MongoDB
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://event-planner-y4fw.onrender.com/api/product/products'); // Fetch from API
//         const data = await response.json();
        
//         let vendorData = [];
//         if (category === 'wedding-cake') {
//           vendorData = Array.isArray(data.WeddingCakeData) ? data.WeddingCakeData : [];
//         } else if (category === 'photographers') {
//           vendorData = Array.isArray(data.PhotographerData) ? data.PhotographerData : [];
//         }

//         const foundVendor = vendorData.find((v) => v.product_id === id); // Match product ID
//         setVendor(foundVendor);
//       } catch (error) {
//         console.error('Error fetching vendor data:', error);
//       } finally {
//         setLoading(false); // Stop loading after data is fetched
//       }
//     };

//     fetchData();
//   }, [category, id]);

//   const handleBookNow = () => {
//     if (!user) {
//       navigate('/login'); // Redirect to login if user is not authenticated
//       return;
//     }
//     setShowModal(true); // Show the modal
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEventDetails({
//       ...eventDetails,
//       [name]: value,
//     });
//   };

//   const sendBookingConfirmationEmail = async (vendorEmail, eventDetails, vendor, client) => {
//     try {
//       const response = await fetch('https://event-planner-y4fw.onrender.com/api/otp/send-booking-confirmation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: vendorEmail, // Send email to vendor
//           eventDetails,
//           vendor,
//           client, // Include client details
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send booking confirmation email');
//       }

//       const data = await response.json();
//       console.log(data.msg); // Log success message
//     } catch (error) {
//       console.error('Error sending booking confirmation email:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     const orderDetails = {
//       customer_email: user.email,
//       vendor_email: vendor.vendor_email || 'vendor@gmail.com', // Fallback email
//       item_name: vendor.title,
//       item_price: vendor.price,
//       item_image_url: vendor.image_url,
//       accepted: false,
//       eventDetails, // Include event details in the order
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
//         const userUpdateResponse = await fetch('https://event-planner-y4fw.onrender.com/api/user/updateOrderHistory', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email: user.email, orderId }), // Send email and order ID to update
//         });

//         if (userUpdateResponse.ok) {
//           // Send booking confirmation email to vendor with client details
//           const client = {
//             name: user.name, // Assuming the user's name is stored in localStorage
//             email: user.email,
//             phone: user.phone, // Assuming the user's phone is stored in localStorage
//           };
//           await sendBookingConfirmationEmail(vendor.vendor_email, eventDetails, vendor, client);

//           alert("Order Placed Successfully!");
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
//     } finally {
//       setShowModal(false); // Close the modal after submission
//     }
//   };

//   if (loading) {
//     return <h2>Loading...</h2>; // Display loading message while fetching
//   }

//   if (!vendor) {
//     return <h2>Vendor Not Found</h2>; // Display a message if vendor is not found
//   }

//   return (
//     <div className="vendor-detail-container">
//       <div className="image-price-section">
//         <div className="image-section">
//           <img src={vendor.image_url} alt={vendor.title} />
//         </div>
//         <div className="price-card">
//           <h3 className="h3Class">Starting Price</h3>
//           <p>Total Price: {vendor.price ? `INR ${vendor.price}` : 'Price not available'}</p>
//           <p className="special-deal">Special deal!!</p>
//         </div>
//       </div>
//       <div className="details-card">
//         <h2>{vendor.title}</h2>
//         <p>{vendor.location}</p>
//         <div className="rating-section">
//           <span>{vendor.ratings} ⭐</span>
//         </div>
//         <div className="button-group">
//           <button className="wishlist-button">❤️ Wishlist</button>
//           <button className="book-button" onClick={handleBookNow}>Book Now</button>
//         </div>
//       </div>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Enter Event Details</h2>
//             <form>
//               <label>
//                 Event Date:
//                 <input
//                   type="date"
//                   name="eventDate"
//                   value={eventDetails.eventDate}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Event Time:
//                 <input
//                   type="time"
//                   name="eventTime"
//                   value={eventDetails.eventTime}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Event Location:
//                 <input
//                   type="text"
//                   name="eventLocation"
//                   value={eventDetails.eventLocation}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Special Instructions:
//                 <textarea
//                   name="specialInstructions"
//                   value={eventDetails.specialInstructions}
//                   onChange={handleInputChange}
//                 />
//               </label>
//               <div className="modal-buttons">
//                 <button type="button" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="button" onClick={handleSubmit}>
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorDetail;



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
  const [eventDetails, setEventDetails] = useState({
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    specialInstructions: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://event-planner-y4fw.onrender.com/api/product/products');
        const data = await response.json();
        
        let vendorData = [];
        if (category === 'wedding-cake') {
          vendorData = Array.isArray(data.WeddingCakeData) ? data.WeddingCakeData : [];
        } else if (category === 'photographers') {
          vendorData = Array.isArray(data.PhotographerData) ? data.PhotographerData : [];
        }

        const foundVendor = vendorData.find((v) => v.product_id === id);
        if (!foundVendor) {
          setError('Vendor not found');
        }
        setVendor(foundVendor);
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

  const sendBookingConfirmationEmail = async (vendorEmail, eventDetails, vendor, client) => {
    try {
      const response = await fetch('https://event-planner-y4fw.onrender.com/api/otp/send-booking-confirmation', {
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
    const orderDetails = {
      customer_email: user.email,
      vendor_email: vendor.vendor_email || 'vendor@gmail.com',
      item_name: vendor.title,
      item_price: vendor.price,
      item_image_url: vendor.image_url,
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

        const userUpdateResponse = await fetch('https://event-planner-y4fw.onrender.com/api/user/updateOrderHistory', {
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
          await sendBookingConfirmationEmail(vendor.vendor_email, eventDetails, vendor, client);

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
                  ':hover': {
                    backgroundColor: '#e9ecef'
                  }
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
                  ':hover': {
                    backgroundColor: '#e04a50'
                  }
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
                }}>Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventDetails.eventDate}
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
    </div>
  );
};

export default VendorDetail;