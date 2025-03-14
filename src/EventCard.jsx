// EventCard.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Import Link for routing
import './EventCard.css'; 

const EventCard = ({ id, imageSrc, title, rating, location, category, type }) => {
  // Determine the URL based on the type (venue or vendor)
  const linkUrl = type === 'vendor' ? `/vendors/${category}/${id}` : `/venues/${id}`;

  return (
    <Link to={linkUrl} className="event-card-link"> {/* Updated the dynamic URL generation */}
      <div className="event-card">
        <div className="image-container">
          <img src={imageSrc} alt={title} className="event-image" />
        </div>
        <div className="event-details">
          <div className="event-header">
            <h3>{title}</h3>
            <div className="event-rating">
              <FontAwesomeIcon icon={faStar} className="star-icon" />
              <span>{rating}</span>
            </div>
          </div>
          <div className="event-location">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
