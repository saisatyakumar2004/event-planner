const mongoose = require('mongoose');

const connectDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('MongoDB Connected');
                resolve();
            })
            .catch((err) => {
                console.error('MongoDB connection error:', err);
                reject(err);
            });
    });
};

module.exports = connectDB;
