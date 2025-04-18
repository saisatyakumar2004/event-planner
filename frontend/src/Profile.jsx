import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
    const [section, setSection] = useState('account');
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [orderHistory, setOrderHistory] = useState([]); // Constant for order history
    const [orderDetails, setOrderDetails] = useState([]);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [cancelLoading, setCancelLoading] = useState({}); // New state for tracking cancel loading per order

    const handleCancelOrder = async (orderId) => {
        // Set loading state for this order
        setCancelLoading(prev => ({ ...prev, [orderId]: true }));
        try {
            // Make the API call to delete the order
            const response = await fetch(`https://event-planner-ihsd.onrender.com/api/orders/deleteOrder/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check if the response is successful
            if (response.ok) {
                // Remove the deleted order from the state
                setOrderDetails((prevOrders) =>
                    prevOrders.filter((order) => order.order_id !== orderId)
                );
                alert(`Order with ID: ${orderId} successfully cancelled.`);
            } else {
                alert(`Failed to cancel order with ID: ${orderId}.`);
            }
        } catch (error) {
            console.error('Error cancelling the order:', error);
        } finally {
            // Reset loading state for this order regardless of outcome
            setCancelLoading(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const handleViewEventDetails = (order) => {
        setSelectedOrder(order);
        setShowEventDetails(true);
    };
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            // Redirect to login page if user is not logged in
            window.location.href = '/login';
            return;
        }

        const userData = JSON.parse(loggedInUser);
        setUser(userData);

        // Fetch user data from the backend using the email
        const fetchUserData = async () => {
            try {
                // First get user profile data
                const userResponse = await axios.get(`https://event-planner-ihsd.onrender.com/api/user?email=${userData.email}`);
                
                if (userResponse.data && userResponse.data.orderHistory?.length > 0) {
                    // Then fetch orders using the order IDs
                    const ordersResponse = await axios.post('https://event-planner-ihsd.onrender.com/api/orders/fetchOrdersByIds', {
                        orderIds: userResponse.data.orderHistory
                    });
                    
                    if (ordersResponse.data) {
                        setOrderDetails(ordersResponse.data);
                    }
                }
                
                setFirstName(userResponse.data.firstName);
                setLastName(userResponse.data.lastName);
                setEmail(userResponse.data.email);
                setPhoneNumber(userResponse.data.phoneNumber);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data. Please try again later.');
            }
        };

        fetchUserData();
    }, []);

    const updateProfile = async () => {
        const updatedUser = { firstName, lastName, email, phoneNumber };
        try {
            const response = await fetch('https://event-planner-ihsd.onrender.com/api/user/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUser(updatedData);
                localStorage.setItem('user', JSON.stringify(updatedData));
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    const updatePassword = async () => {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match. Please try again.');
            return;
        }

        const response = await fetch('https://event-planner-ihsd.onrender.com/api/user/updatePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                oldPassword,
                newPassword,
            }),
        });

        if (response.ok) {
            alert('Password updated successfully.');
        } else {
            const error = await response.json();
            alert('Error updating password: ' + error.message);
        }
    };

    const cancelEdit = () => {
        setSection('account');
    };

    const logout = () => {
        localStorage.removeItem('user'); // Clear user data on logout
        window.location.href = '/'; // Redirect to home page
    };

    const updatePhoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profilePhoto').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="bodyProfile">
            <div className="containerProfile">
                <div className="sidebarProfile">
                    <div className="profilePhotoContainerProfile" onClick={() => document.getElementById('photoUpload').click()}>
                        <img
                            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSrlA_JbC4vGqrIkgT5g0SnosOxdBs7MepyDrFT8GEc5cQJM2iX"
                            alt="Profile Photo"
                            id="profilePhoto"
                        />
                    </div>
                    <input
                        type="file"
                        id="photoUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={updatePhoto}
                    />
                    <h3 id="usernameDisplay" className='h3ClassProfile'>{`${firstName} ${lastName}`}</h3>
                    <button onClick={() => setSection('account')}>Account</button>
                    <button onClick={() => setSection('password')}>Password</button>
                    <button onClick={() => setSection('orders')}>Orders</button>
                    <button onClick={logout}>Logout</button>
                </div>
                <div className="contentProfile">
                    {section === 'account' && (
                        <div id="accountSettingsProfile" className="sectionProfile">
                            <h2>Account Settings</h2>
                            <div className="formGroupProfile">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="formGroupProfile">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="formGroupProfile">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="formGroupProfile">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="buttonsProfile">
                                <button className="cancelProfile" onClick={cancelEdit}>Cancel</button>
                                <button className="updateProfile" onClick={updateProfile}>Update</button>
                            </div>
                        </div>
                    )}
                    {section === 'password' && (
                        <div id="passwordSettingsProfile" className="sectionProfile">
                            <h2>Change Password</h2>
                            <div className="formGroupProfile">
                                <label htmlFor="oldPassword">Old Password</label>
                                <input type="password" id="oldPassword" placeholder="Enter old password" />
                            </div>
                            <div className="formGroupProfile">
                                <label htmlFor="newPassword">New Password</label>
                                <input type="password" id="newPassword" placeholder="Enter new password" />
                            </div>
                            <div className="formGroupProfile">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" placeholder="Confirm new password" />
                            </div>
                            <div className="buttonsProfile">
                                <button className="cancelProfile" onClick={cancelEdit}>Cancel</button>
                                <button className="updateProfile" onClick={updatePassword}>Update</button>
                            </div>
                        </div>
                    )}
                    {section === 'orders' && (
                        <div id="orderHistoryProfile">
                            <h2>Order History</h2>
                            <div className="orderCardsContainer">
                                {orderDetails && orderDetails.length > 0 ? (
                                    orderDetails.map((order) => (
                                        <div key={order.order_id} className="orderCard">
                                            <div className="orderCardUpper">
                                                <span className="orderCardLeft">Order ID: {order.order_id}</span>
                                                <span className="orderCardRight">Total: ₹{order.item_price}</span>
                                            </div>
                                            <div className="orderCardLower">
                                                <span className="orderCardLeft">Item: {order.item_name}</span>
                                                <div className="orderCardActions">
                                                    <button
                                                        className={`orderButton ${
                                                            order.accepted ? 'accepted' : order.rejected ? 'rejected' : 'requested'
                                                        }`}
                                                    >
                                                        {order.accepted ? 'Order Accepted' : order.rejected ? 'Order Rejected' : 'Requested'}
                                                    </button>
                                                    <button
                                                        className="viewDetailsButton"
                                                        onClick={() => handleViewEventDetails(order)}
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        className="cancelOrderButton"
                                                        onClick={() => handleCancelOrder(order.order_id)}
                                                    >
                                                        {cancelLoading[order.order_id] ? 'Canceling Order..' : 'Cancel Order'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No orders found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Event Details Modal */}
            {showEventDetails && selectedOrder && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Event Details</h2>
                        <div className="eventDetailsContainer">
                            <div className="detailRow">
                                <strong>Event Name:</strong>
                                <span>{selectedOrder.eventDetails?.eventName || 'N/A'}</span>
                            </div>
                            <div className="detailRow">
                                <strong>Event Date:</strong>
                                <span>{selectedOrder.eventDetails?.eventDate || 'N/A'}</span>
                            </div>
                            <div className="detailRow">
                                <strong>Event Time:</strong>
                                <span>{selectedOrder.eventDetails?.eventTime || 'N/A'}</span>
                            </div>
                            <div className="detailRow">
                                <strong>Event Location:</strong>
                                <span>{selectedOrder.eventDetails?.eventLocation || 'N/A'}</span>
                            </div>
                            <div className="detailRow">
                                <strong>Special Instructions:</strong>
                                <p>{selectedOrder.eventDetails?.specialInstructions || 'No special instructions'}</p>
                            </div>
                        </div>
                        <button 
                            className="closeButton"
                            onClick={() => setShowEventDetails(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
