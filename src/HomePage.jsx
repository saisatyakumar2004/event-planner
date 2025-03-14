import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon you want
import "./HomePage.css"; // Custom CSS for further styling

function HomePage() {
  return (
    <div className="home-container">
      <div className="background-image"></div>
      <div className="overlay">
        <h1 className="heading text-center">
          SEARCH YOUR HOME CITY FOR WEDDING SERVICES
        </h1>
        <div className="search-box d-flex justify-content-center my-3">
          <input
            type="text"
            placeholder="Search"
            className="form-control w-50"
          />
          <button className="btn btn-primary ms-2">
            <FontAwesomeIcon icon={faSearch} /> {/* Using FontAwesomeIcon for the search icon */}
          </button>
        </div>
        <div className="dropdown-menu row text-center ">
          <div className="dropdown-column col-md-4">
            <h3>Venues</h3>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="btn btn-outline-dark my-1">
                  5 Star Hotels
                </a>
              </li>
              <li>
                <a href="#" className="btn btn-outline-dark my-1">
                  Lawns / Farmhouses
                </a>
              </li>
              <li>
                <a href="#" className="btn btn-outline-dark my-1">Resorts</a>
              </li>
            </ul>
          </div>
          <div className="dropdown-column col-md-4">
            <h3>Photographers</h3>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="btn btn-outline-dark my-1">
                  Photographers
                </a>
              </li>
              <li>
                <a href="#" className="btn btn-outline-dark my-1">
                  Mehndi Artist
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown-column col-md-4">
            <h3>Makeup Artist</h3>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="btn btn-outline-dark my-1">Groom</a>
              </li>
              <li>
                <a href="#" className="btn btn-outline-dark my-1">Bride</a>
              </li>
              <li>
                <a href="#" className="btn btn-outline-dark my-1">
                  Mehendi Artist
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
