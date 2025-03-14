const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const Product = require('../models/Product'); // Import the Product model
const router = express.Router();

// Route to add a new product
router.post('/add', async (req, res) => {
    const { vendor_email, category, title, location, ratings, price, image_url } = req.body;

    try {
        // Generate a unique product_id
        const product_id = uuidv4();

        const newProduct = new Product({
            product_id,
            vendor_email,
            category,
            title,
            location,
            ratings,
            price,
            image_url,
        });

        // Log the new product for debugging
        console.log('New Product:', newProduct);

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error adding product', error });
    }
});

// Route to remove a product by product_id
router.delete('/remove/:product_id', async (req, res) => {
    const { product_id } = req.params;

    try {
        const deletedProduct = await Product.findOneAndDelete({ product_id });

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product removed successfully!', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product', error });
    }
});

// Route to fetch all products by category
router.get('/products', async (req, res) => {
    try {
        // Fetch all wedding cakes
        const weddingCakes = await Product.find({ category: 'wedding-cake' });
        
        // Fetch all photographers
        const photographers = await Product.find({ category: 'photographers' });

        // Fetch all makeup artists
        const makeupArtists = await Product.find({ category: 'makeup' });

        const mehndi = await Product.find({ category: 'mehndi' });

        const bridal = await Product.find({ category: 'bridal_wear' });


        const groom = await Product.find({ category: 'groom_wear' });
        res.status(200).json({
            WeddingCakeData: weddingCakes,
            PhotographerData: photographers,
            MakeupData: makeupArtists, // Send makeup data
            MehndiData: mehndi,
            BridalWearData: bridal,
            GroomWearData: groom,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Route to fetch all venues
router.get('/venues', async (req, res) => {
    try {
        // Fetch all venues with category 'venue'
        const venues = await Product.find({ category: 'venue' });
        console.log(venues);
        if (venues.length === 0) {
            return res.status(404).json({ message: 'No venues found' });
        }

        res.status(200).json(venues); // Send the venue data as JSON
    } catch (error) {
        console.error('Error fetching venues:', error);
        res.status(500).json({ message: 'Error fetching venues', error });
    }
});

module.exports = router;
