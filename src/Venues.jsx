import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import EventCard from './EventCard'; // Import your EventCard component
import './Venues.css'; // Optional: CSS for styling

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null); // To handle any potential errors

  useEffect(() => {
    // Fetch venue data from the backend API
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product/venues'); // Adjust API URL as necessary
        setVenues(response.data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching venues:', error);
        ///etError('Failed to load venue data');
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="venues-container">
      <div className="venues-header">
        <h1>VENUES PAGE</h1>
      </div>
      <br />
      <div className="venues-info">
        <h2>Available Venues</h2>
        <p>Showing {venues.length} results as per your search criteria</p>
      </div>
      {error && <p className="error-message">{error}</p>} {/* Display error message if there's any */}
      <div className="venues-grid">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <EventCard
              key={venue.product_id} // Assuming product_id as unique ID from the backend
              id={venue.product_id} // Pass ID for routing
              imageSrc={venue.image_url} // Updated to match the field from the database
              title={venue.title}
              rating={venue.ratings}
              location={venue.location}
              type="venue" // Specify the type as venue
            />
          ))
        ) : (
          <p>No venues available at the moment.</p> // Show a message if no venues are returned
        )}
      </div>
    </div>
  );
};

export default Venues;
