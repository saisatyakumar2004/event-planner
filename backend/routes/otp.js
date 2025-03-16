// const express = require("express");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();

// const router = express.Router();

// // Store OTPs with expiration (5 minutes)
// const otpStorage = new Map();

// // Generate a 6-digit OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
  
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // Route to generate and send OTP
// router.post("/generate", async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, msg: "Email is required" });
//   }

//   const otp = generateOTP();
//   console.log(process.env.EMAIL_USER);
//   console.log(otp);
//   const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
//   otpStorage.set(email, { otp, expiresAt });

//   // Auto-delete OTP after expiration
//   setTimeout(() => otpStorage.delete(email), 5 * 60 * 1000);

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is: ${otp} (Valid for 5 minutes).`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       return res.status(500).json({ success: false, msg: "Error sending OTP" });
//     }
//     console.log("Email sent:", info.response);
//     res.status(200).json({ success: true, msg: "OTP sent successfully" });
//   });
// });

// // Route to verify OTP
// router.post("/verify", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, msg: "Email and OTP are required" });
//   }

//   const storedOtpData = otpStorage.get(email);

//   if (!storedOtpData) {
//     return res.status(400).json({ success: false, msg: "OTP expired or not requested" });
//   }

//   if (Date.now() > storedOtpData.expiresAt) {
//     otpStorage.delete(email);
//     return res.status(400).json({ success: false, msg: "OTP expired" });
//   }

//   if (storedOtpData.otp === otp) {
//     otpStorage.delete(email); // Remove OTP after successful verification
//     return res.status(200).json({ success: true, msg: "OTP verified successfully" });
//   } else {
//     return res.status(400).json({ success: false, msg: "Invalid OTP" });
//   }
// });

// module.exports = router;




const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Store OTPs with expiration (5 minutes)
const otpStorage = new Map();

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Route to generate and send OTP
router.post('/generate', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, msg: 'Email is required' });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    otpStorage.set(email, { otp, expiresAt });

    // Auto-delete OTP after expiration
    setTimeout(() => otpStorage.delete(email), 5 * 60 * 1000);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp} (Valid for 5 minutes).`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, msg: 'Error sending OTP' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, msg: 'OTP sent successfully' });
    });
});

// Route to verify OTP
router.post('/verify', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, msg: 'Email and OTP are required' });
    }

    const storedOtpData = otpStorage.get(email);

    if (!storedOtpData) {
        return res.status(400).json({ success: false, msg: 'OTP expired or not requested' });
    }

    if (Date.now() > storedOtpData.expiresAt) {
        otpStorage.delete(email);
        return res.status(400).json({ success: false, msg: 'OTP expired' });
    }

    if (storedOtpData.otp === otp) {
        otpStorage.delete(email); // Remove OTP after successful verification
        return res.status(200).json({ success: true, msg: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ success: false, msg: 'Invalid OTP' });
    }
});





// Route to send booking confirmation email to vendor with client details
router.post('/send-booking-confirmation', async (req, res) => {
    const { email, eventDetails, vendor, client } = req.body;
  
    if (!email || !eventDetails || !vendor || !client) {
      return res.status(400).json({ success: false, msg: 'Email, event details, vendor details, and client details are required' });
    }
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send email to vendor
      subject: 'New Booking Confirmation',
      text: `You have a new booking for ${vendor.title}!\n\nClient Details:\nName: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\n\nEvent Details:\nDate: ${eventDetails.eventDate}\nTime: ${eventDetails.eventTime}\nLocation: ${eventDetails.eventLocation}\nSpecial Instructions: ${eventDetails.specialInstructions}\n\nPlease check your event planner site for more details: http://youreventplanner.com/events`, // Add link to event planner site
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, msg: 'Error sending booking confirmation email', error: error.message });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ success: true, msg: 'Booking confirmation email sent successfully' });
    });
  });






  
module.exports = router;