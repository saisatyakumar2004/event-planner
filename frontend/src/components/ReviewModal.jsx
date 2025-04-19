import React, { useState } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [reviewData, setReviewData] = useState({
    orderId: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(reviewData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <h2>Write a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Order ID:</label>
            <input
              type="text"
              value={reviewData.orderId}
              onChange={(e) => setReviewData({...reviewData, orderId: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= reviewData.rating ? 'filled' : ''}`}
                  onClick={() => setReviewData({...reviewData, rating: star})}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Your Review:</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">
              {isSubmitting ? 'submitting review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
