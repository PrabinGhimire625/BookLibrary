import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"; 
import { addReview } from "../../store/ReviewSlice";

const Review = () => {
  const dispatch = useDispatch();
  const { bookId } = useParams(); 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRating = (star) => {
    setRating(star);
  };

  const handleReviewSubmit = () => {
    if (rating === 0 || !comment) {
      alert("Please provide a rating and a comment.");
      return;
    }

    const reviewData = {
      bookId,   
      rating,
      comment,
    };

    dispatch(addReview(reviewData));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      {/* Page Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Share Your Review</h2>
        <p className="text-gray-500">We'd love to hear your thoughts on this book!</p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            className={`text-4xl cursor-pointer transition-colors ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            } hover:text-yellow-500`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Review Instructions */}
      <div className="mb-6 text-gray-700">
        <p className="font-semibold">Your opinion matters!</p>
        <p>Provide a detailed review to help others make informed decisions.</p>
      </div>

      {/* Review Text Area */}
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-4 bg-gray-100 text-gray-800 rounded-lg resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        rows="6"
      />

      {/* Submit Button */}
      <button
        onClick={handleReviewSubmit}
        className="w-full py-3 bg-yellow-500 text-white rounded-lg text-xl hover:bg-yellow-400 transition-colors"
      >
        Submit Your Review
      </button>

      {/* Static Section for Visual Appeal */}
      <div className="mt-8 p-6 border-t-2 border-gray-200 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Thank you for your feedback!</h3>
        <p className="text-gray-500">Your review helps others discover great books.</p>
      </div>
    </div>
  );
};

export default Review;
