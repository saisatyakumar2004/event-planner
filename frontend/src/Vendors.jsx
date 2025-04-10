import React, { useEffect, useState } from 'react';
import './Vendors.css';
import EventCard from './EventCard'; // Importing EventCard component

const Vendors = () => {
    const [weddingCakeData, setWeddingCakeData] = useState([]); // State for wedding cake data
    const [photographerData, setPhotographerData] = useState([]); // State for photographer data
    const [makeupData, setMakeupData] = useState([]); // State for makeup data
    const [mehndiData, setMehndiData] = useState([]);
    const [bridal_wearData, setBridalWearData] = useState([]);
    const [groom_wearData, setGroomWearData] = useState([]);
    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/product/products'); // Adjust the API endpoint as necessary
                const data = await response.json();

                // Assuming the data structure contains WeddingCakeData, PhotographerData, and MakeupData
                setWeddingCakeData(data.WeddingCakeData || []); // Set wedding cake data
                setPhotographerData(data.PhotographerData || []); // Set photographer data
                setMakeupData(data.MakeupData || []); // Set makeup data
                setMehndiData(data.MehndiData || []); 
                setBridalWearData(data.BridalWearData || []); 
                setGroomWearData(data.GroomWearData || []); 
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="header">VENDORS PAGE</div>
            <div className="subheader">Wedding Categories</div>
            <div className="vendors-grid">
                {/* Wedding Cake Category */}
                <a href="#wedding-cake-section" className="vendor-card cake">
                    <img src="https://tinyurl.com/wedding-cake-event-planner" alt="Wedding Cake" />
                    <div className="details">
                        <div className="title">Wedding Cake</div>
                        <div className="services">Black Forest, Vanilla, Chocolate, Blueberry, Strawberry</div>
                    </div>
                </a>

                {/* Photographer Category */}
                <a href="#photographer-section" className="vendor-card photographer">
                    <img src="https://tinyurl.com/photographer-event-planner" alt="Photographer" />
                    <div className="details">
                        <div className="title">Photographer</div>
                        <div className="services">Photographers, Cinema/Video</div>
                    </div>
                </a>

                {/* Makeup Category */}
                <a href="#makeup-section" className="vendor-card makeup">
                    <img src="https://tinyurl.com/makeup-event-planner" alt="Makeup" />
                    <div className="details">
                        <div className="title">Makeup</div>
                        <div className="services">Bridal Makeup, Family Makeup</div>
                    </div>
                </a>

                {/* Other Vendor Categories */}
                <a href="#mehndi-section" className="vendor-card mehndi">
                    <img src="https://tinyurl.com/mehndi-event-planner" alt="Mehndi" />
                    <div className="details">
                        <div className="title">Mehndi</div>
                        <div className="services">Mehndi Artist</div>
                    </div>
                </a>

                <a href="#bridal_wear-section" className="vendor-card bridalwear">
                    <img src="https://tinyurl.com/bridal-wear-event-planner" alt="Bridal Wear" />
                    <div className="details">
                        <div className="title">Bridal Wear</div>
                        <div className="services">Bridal Lehengas, Kanjeevaram / Silk Saree</div>
                    </div>
                </a>

                <a href="#groom_wear-section" className="vendor-card groomwear">
                    <img src="https://i.ibb.co/XytSj33/groom-wear.jpg" alt="Groom Wear" />
                    <div className="details">
                        <div className="title">Groom Wear</div>
                        <div className="services">Sherwani, Wedding Suits / Tuxes</div>
                    </div>
                </a>
            </div>
            <br />
            {/* Wedding Cake Section */}
            <div id="wedding-cake-section" className="wedding-cake-section">
                <h2 className="left-align">Wedding Cakes</h2>
                <p className="left-align">Showing {weddingCakeData.length} results as per your criteria</p>

                <div className="wedding-cake-grid">
                    {weddingCakeData.map((cake) => (
                        <EventCard
                            key={cake.id} // Use unique identifier for each cake
                            id={cake.product_id}
                            imageSrc={cake.image_url}
                            title={cake.title}
                            rating={cake.rating}
                            location={cake.location}
                            category="wedding-cake" // Pass the category for routing
                            type="vendor" // Specify the type as vendor
                        />
                    ))}
                </div>
            </div>
            <br />
            {/* Photographer Section */}
            <div id="photographer-section" className="photographer-section">
                <h2 className="left-align">Photographers</h2>
                <p className="left-align">Showing {photographerData.length} results as per your criteria</p>

                <div className="photographer-grid">
                    {photographerData.map((photographer) => (
                        <EventCard
                            key={photographer.id} // Use unique identifier for each photographer
                            id={photographer.product_id}
                            imageSrc={photographer.image_url}
                            title={photographer.title}
                            rating={photographer.rating}
                            location={photographer.location}
                            category="photographers" // Pass the category for routing
                            type="vendor" // Specify the type as vendor
                        />
                    ))}
                </div>
            </div>
            
            <br />
            {/* Makeup Section */}
            <div id="makeup-section" className="photographer-section">
                <h2 className="left-align">Makeup Artists</h2>
                <p className="left-align">Showing {makeupData.length} results as per your criteria</p>

                <div className="photographer-grid">
                    {makeupData.map((makeupArtist) => (
                        <EventCard
                            key={makeupArtist.id} // Use unique identifier for each makeup artist
                            id={makeupArtist.product_id}
                            imageSrc={makeupArtist.image_url}
                            title={makeupArtist.title}
                            rating={makeupArtist.rating}
                            location={makeupArtist.location}
                            category="makeup" // Pass the category for routing
                            type="vendor" // Specify the type as vendor
                        />
                    ))}
                </div>
            </div>
            
            <br />
            {/* Mehndi Section */}
            <div id="mehndi-section" className="photographer-section">
                <h2 className="left-align">Mehndi</h2>
                <p className="left-align">Showing {mehndiData.length} results as per your criteria</p>

                <div className="photographer-grid">
                    {mehndiData.map((mehndi) => (
                        <EventCard
                            key={mehndi.id} // Use unique identifier for each makeup artist
                            id={mehndi.product_id}
                            imageSrc={mehndi.image_url}
                            title={mehndi.title}
                            rating={mehndi.rating}
                            location={mehndi.location}
                            category="mehndi" // Pass the category for routing
                            type="vendor" // Specify the type as vendor
                        />
                    ))}
                </div>
            </div>

            <br />
            {/* Bridal  Wear Section */}
            <div id="bridal_wear-section" className="photographer-section">
                <h2 className="left-align">Bridal Wear</h2>
                <p className="left-align">Showing {bridal_wearData.length} results as per your criteria</p>

                <div className="photographer-grid">
                    {bridal_wearData.map((bridal) => (
                        <EventCard
                            key={bridal.id} // Use unique identifier for each makeup artist
                            id={bridal.product_id}
                            imageSrc={bridal.image_url}
                            title={bridal.title}
                            rating={bridal.rating}
                            location={bridal.location}
                            category="bridal_wear" // Pass the category for routing
                            type="vendor" // Specify the type as vendor
                        />
                    ))}
                </div>
                
            </div>


            <br />
                {/* Groom  Wear Section */}
            <div id="groom_wear-section" className="photographer-section">
                <h2 className="left-align">Groom Wear</h2>
                <p className="left-align">Showing {groom_wearData.length} results as per your criteria</p>
                <div className="photographer-grid">
                    {groom_wearData.map((groom) => (
                        <EventCard
                            key={groom.id} // Use unique identifier for each makeup artist
                            id={groom.product_id}
                            imageSrc={groom.image_url}
                            title={groom.title}
                            rating={groom.rating}
                            location={groom.location}
                            category="groom_wear" // Pass the category for routing
                            type="vendor" // Specify the type as vendor
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Vendors;
