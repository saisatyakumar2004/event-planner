import React, { useEffect, useState } from 'react';
import './VendorDashboard.css';
import axios from 'axios';
import OrderCard from './OrderCard'; // Import the OrderCard component

const VendorDashboard = () => {
    const [section, setSection] = useState('account');
    const [vendor, setUser] = useState(null);
    const [name, setName] = useState('');
    const [vendor_email, setEmail] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [isVerified, setVerified] = useState(null); // Changed initial state to null
    const [orders, setOrders] = useState([]);
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [ratings, setRatings] = useState(0);
    const [price, setPrice] = useState(0);
    const [image_url, setImageUrl] = useState('');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImageUrl(base64String); // Store the Base64 string in image_url
            };
            reader.readAsDataURL(file);
        }
    };
    


    const uploadProduct = async () => {
        console.log();
        const vendor = JSON.parse(localStorage.getItem('vendor')); // Parse the vendor object from local storage
    
    
            const vendor_email = vendor.vendor_email; // Get the vendor email from local storage
            const newProduct = {
                vendor_email,
                category,
                title,
                location,
                ratings,
                price,
                image_url
            };
    
            try {
                const response = await axios.post('http://localhost:5000/api/product/add', newProduct); // Updated endpoint
                if (response.status === 201) { // Check for status 201 (Created)
                    alert('Product added successfully!');
                    // Clear the form fields after successful upload
                    setCategory('');
                    setTitle('');
                    setLocation('');
                    setRatings(0);
                    setPrice(0);
                    setImageUrl('');
                } else {
                    alert('Failed to add product.');
                }
            } catch (error) {
                console.error('Error uploading product:', error);
                alert('An error occurred while adding the product.');
            }
        
    };
    
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem('vendor');
        if (!loggedInUser) {
            window.location.href = '/vendor-login';
            return;
        }

        const userData = JSON.parse(loggedInUser);
        setUser(userData);

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/vendor?vendor_email=${userData.vendor_email}`);
                const { name, vendor_email, phone, isVerified } = response.data;
                setName(name);
                setEmail(vendor_email);
                setPhoneNumber(phone);
                setVerified(isVerified);
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/fetchOrders');
                const vendorOrders = response.data.filter(order => order.vendor_email === vendor_email);
                setOrders(vendorOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (section === 'orders') {
            fetchOrders();
        }
    }, [section, vendor_email]);

    const updateProfile = async () => {
        const updatedVendor = { name, vendor_email, phone, isVerified };
        try {
            const response = await fetch('http://localhost:5000/api/vendor/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedVendor),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUser(updatedData);
                localStorage.setItem('vendor', JSON.stringify(updatedData));
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

        const response = await fetch('http://localhost:5000/api/vendor/updatePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vendor_email: vendor_email,
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
        localStorage.removeItem('vendor');
        window.location.href = '/';
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

    // IsVerifiedButton component
    const IsVerifiedButton = () => {
        const [isVerifiedButton, setIsVerifiedButton] = useState(null);

        useEffect(() => {
            const fetchVendorData = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/vendor?vendor_email=${vendor_email}`);
                    const data = await response.json();

                    if (data) {
                        setIsVerifiedButton(data.isVerified); // Assuming API returns a single object
                    } else {
                        setIsVerifiedButton(false); // No vendor found
                    }
                } catch (error) {
                    console.error('Error fetching vendor data:', error);
                }
            };

            fetchVendorData();
        }, [vendor_email]);

        return (
            <button className={`is-verified-button ${isVerifiedButton ? 'verified' : 'not-verified'}`}>
                {isVerifiedButton === null ? 'Loading...' : isVerifiedButton ? 'Verified' : 'Not Verified'}
            </button>
        );
    };

    if (!vendor) {
        return <p>Loading vendor data...</p>;
    }

    return (
        <div className="bodyVendorDashboard">
            <div className="containerVendorDashboard">
                <div className="sidebarVendorDashboard">
                    <div className="profilePhotoContainerVendorDashboard" onClick={() => document.getElementById('photoUpload').click()}>
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
                    <h3 id="usernameDisplay" className='h3ClassVendorDashboard'>{name}</h3>
                    <button onClick={() => setSection('account')}>Account</button>
                    <button onClick={() => setSection('password')}>Password</button>
                    <button onClick={() => setSection('orders')}>Orders</button>
                    <button onClick={() => setSection('upload')}>Upload a New Product</button>
                    <button onClick={logout}>Logout</button>
                </div>
                <div className="contentVendorDashboard">
                    {section === 'account' && (
                        <div id="accountSettingsVendorDashboard" className="sectionVendorDashboard">
                            <h2>Account Settings</h2>
                            <IsVerifiedButton /> 
                            {/* Use the IsVerifiedButton here */}
                            <br />
                            <br />
                            <div className="formGroupVendorDashboard">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="formGroupVendorDashboard">
                            <label htmlFor="email">Email</label>
                            <div className="emailDisplay">{vendor_email}</div>
                            </div>
                            <div className="formGroupVendorDashboard">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="buttonsVendorDashboard">
                                <button className="cancelVendorDashboard" onClick={cancelEdit}>Cancel</button>
                                <button className="updateVendorDashboard" onClick={updateProfile}>Update</button>
                            </div>
                        </div>
                    )}
                    {section === 'password' && (
                        <div id="passwordSettingsVendorDashboard" className="sectionVendorDashboard">
                            <h2>Change Password</h2>
                            <div className="formGroupVendorDashboard">
                                <label htmlFor="oldPassword">Old Password</label>
                                <input type="password" id="oldPassword" />
                            </div>
                            <div className="formGroupVendorDashboard">
                                <label htmlFor="newPassword">New Password</label>
                                <input type="password" id="newPassword" />
                            </div>
                            <div className="formGroupVendorDashboard">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" />
                            </div>
                            <button className="updatePasswordVendorDashboard" onClick={updatePassword}>Update Password</button>
                        </div>
                    )}
                    {section === 'orders' && (
                        <div id="ordersSectionVendorDashboard" className="sectionVendorDashboard">
                            <h2>Your Orders</h2>
                            <div className="ordersContainer">
                                {orders.length > 0 ? (
                                    orders.map(order => <OrderCard key={order._id} order={order} />)
                                ) : (
                                    <p>No orders available.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {section === 'upload' && (
    <div id="uploadProductSectionVendorDashboard" className="sectionVendorDashboard">
        <h2>Upload a New Product</h2>
        <div className="formGroupVendorDashboard">
            <label htmlFor="category">Category</label>
            <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
        </div>
        <div className="formGroupVendorDashboard">
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className="formGroupVendorDashboard">
            <label htmlFor="location">Location</label>
            <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
        </div>
        <div className="formGroupVendorDashboard">
            <label htmlFor="ratings">Ratings (out of 5)</label>
            <input
                type="number"
                id="ratings"
                value={ratings}
                min="0"
                max="5"
                onChange={(e) => setRatings(e.target.value)}
            />
        </div>
        <div className="formGroupVendorDashboard">
            <label htmlFor="price">Price</label>
            <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
        </div>
        <div className="formGroupVendorDashboard">
            <label htmlFor="imageUpload">Upload Image</label>
            <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
            />
        </div>
        <button onClick={uploadProduct}>Upload Product</button>
    </div>
)}

                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
