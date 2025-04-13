import React, { useEffect, useState } from 'react';
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
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newImagePreview, setNewImagePreview] = useState(null);

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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreview(reader.result);
                setEditingProduct({
                    ...editingProduct,
                    image_url: reader.result
                });
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

        const fetchVendorProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/product/vendor-products/${userData.vendor_email}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchVendorProducts();
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
            const response = await fetch('https://event-planner-y4fw.onrender.com/api/vendor/updateProfile', {
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

        const response = await fetch('https://event-planner-y4fw.onrender.com/api/vendor/updatePassword', {
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

    const handleRemoveProduct = async (productId) => {
        if (window.confirm('Are you sure you want to remove this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/product/remove/${productId}`);
                setProducts(products.filter(product => product.product_id !== productId));
                alert('Product removed successfully!');
            } catch (error) {
                console.error('Error removing product:', error);
                alert('Failed to remove product');
            }
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`http://localhost:5000/api/product/update/${editingProduct.product_id}`, editingProduct);
            setProducts(products.map(p => 
                p.product_id === editingProduct.product_id ? editingProduct : p
            ));
            setShowEditModal(false);
            setNewImagePreview(null);
            alert('Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
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
            <button style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                backgroundColor: isVerifiedButton ? '#28a745' : '#dc3545',
                color: 'white'
            }}>
                {isVerifiedButton === null ? 'Loading...' : isVerifiedButton ? 'Verified' : 'Not Verified'}
            </button>
        );
    };

    if (!vendor) {
        return <p>Loading vendor data...</p>;
    }

    return (
        <div style={{
            fontFamily: "'Roboto', sans-serif",
            margin: '0',
            padding: '0',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%'
        }}>
            <div style={{
                display: 'flex',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '90%',
                maxWidth: '1200px',
                height: '90vh',
                margin: '20px'
            }}>
                <div style={{
                    backgroundColor: '#333',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '200px',
                    color: 'white'
                }}>
                    <div style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginBottom: '20px'
                    }} onClick={() => document.getElementById('photoUpload').click()}>
                        <img
                            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSrlA_JbC4vGqrIkgT5g0SnosOxdBs7MepyDrFT8GEc5cQJM2iX"
                            alt="Profile Photo"
                            id="profilePhoto"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #007bff'
                            }}
                        />
                    </div>
                    <input
                        type="file"
                        id="photoUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={updatePhoto}
                    />
                    <h3 style={{ margin: '0', color: 'white' }}>{name}</h3>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '10px 0',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginTop: '10px'
                    }} onClick={() => setSection('account')}>Account</button>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '10px 0',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }} onClick={() => setSection('password')}>Password</button>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '10px 0',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }} onClick={() => setSection('orders')}>Orders</button>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '10px 0',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }} onClick={() => setSection('upload')}>Upload a New Product</button>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '10px 0',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }} onClick={() => setSection('products')}>View Products</button>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '10px 0',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }} onClick={logout}>Logout</button>
                </div>
                <div style={{
                    flex: '1',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    {section === 'account' && (
                        <div style={{ margin: '20px 0' }}>
                            <h2>Account Settings</h2>
                            <IsVerifiedButton /> 
                            <br />
                            <br />
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="email">Email</label>
                                <div style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '4px',
                                    cursor: 'not-allowed',
                                    color: '#333'
                                }}>{vendor_email}</div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button 
                                    style={{
                                        padding: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: '#dc3545',
                                        color: 'white'
                                    }} 
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </button>
                                <button 
                                    style={{
                                        padding: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: '#28a745',
                                        color: 'white'
                                    }} 
                                    onClick={updateProfile}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    )}
                    {section === 'password' && (
                        <div style={{ margin: '20px 0' }}>
                            <h2>Change Password</h2>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="oldPassword">Old Password</label>
                                <input 
                                    type="password" 
                                    id="oldPassword" 
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="newPassword">New Password</label>
                                <input 
                                    type="password" 
                                    id="newPassword" 
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="confirmPassword">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <button 
                                style={{
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    backgroundColor: '#28a745',
                                    color: 'white'
                                }} 
                                onClick={updatePassword}
                            >
                                Update Password
                            </button>
                        </div>
                    )}
                    {section === 'orders' && (
                        <div style={{ margin: '20px 0' }}>
                            <h2>Your Orders</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {orders.length > 0 ? (
                                    orders.map(order => <OrderCard key={order._id} order={order} />)
                                ) : (
                                    <p>No orders available.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {section === 'upload' && (
                        <div style={{ margin: '20px 0' }}>
                            <h2>Upload a New Product</h2>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                >
                                    <option value="">Select a category</option>
                                    <option value="wedding-cake">Wedding Cake</option>
                                    <option value="photographers">Photographers</option>
                                    <option value="makeup">Makeup</option>
                                    <option value="mehndi">Mehandi</option>
                                    <option value="bridal_wear">Bridal Wear</option>
                                    <option value="groom_wear">Groom Wear</option>
                                    <option value="venue">Venue</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="ratings">Ratings (out of 5)</label>
                                <input
                                    type="number"
                                    id="ratings"
                                    value={ratings}
                                    min="0"
                                    max="5"
                                    onChange={(e) => setRatings(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="imageUpload">Upload Image</label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <button 
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    backgroundColor: '#007bff',
                                    color: 'white'
                                }} 
                                onClick={uploadProduct}
                            >
                                Upload Product
                            </button>
                        </div>
                    )}
                    {section === 'products' && (
                        <div style={{ margin: '20px 0' }}>
                            <h2>Your Products</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {products.map(product => (
                                    <div key={product.product_id} style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        backgroundColor: 'white'
                                    }}>
                                        <img src={product.image_url} alt={product.title} style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }} />
                                        <h3>{product.title}</h3>
                                        <p>Category: {product.category}</p>
                                        <p>Price: ₹{product.price}</p>
                                        <p>Location: {product.location}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button 
                                                onClick={() => handleEditProduct(product)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleRemoveProduct(product.product_id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Edit Product Modal */}
                            {showEditModal && (
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
                                        padding: '20px',
                                        borderRadius: '8px',
                                        width: '90%',
                                        maxWidth: '500px',
                                        maxHeight: '90vh',
                                        overflowY: 'auto'
                                    }}>
                                        <h2>Edit Product</h2>
                                        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                            <img 
                                                src={newImagePreview || editingProduct.image_url} 
                                                alt="Product Preview"
                                                style={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    marginBottom: '10px'
                                                }}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                                id="image-upload"
                                            />
                                            <label 
                                                htmlFor="image-upload"
                                                style={{
                                                    display: 'block',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#6c757d',
                                                    color: 'white',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    marginTop: '10px'
                                                }}
                                            >
                                                Change Image
                                            </label>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
                                            <input
                                                type="text"
                                                value={editingProduct.title}
                                                onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Price</label>
                                            <input
                                                type="number"
                                                value={editingProduct.price}
                                                onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Location</label>
                                            <input
                                                type="text"
                                                value={editingProduct.location}
                                                onChange={(e) => setEditingProduct({...editingProduct, location: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => {
                                                    setShowEditModal(false);
                                                    setNewImagePreview(null);
                                                }}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#6c757d',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateProduct}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;