import React, { useState } from 'react';

const RatingModal = ({ isOpen, onClose, onSubmit, initialRating = 0 }) => {
    const [rating, setRating] = useState(initialRating);
    const [hoveredRating, setHoveredRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(rating);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 w-96 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Rate this Game</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="p-1 focus:outline-none transform transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <svg
                                className={`w-10 h-10 ${
                                    (hoveredRating ? hoveredRating >= star : rating >= star)
                                        ? 'text-yellow-400'
                                        : 'text-gray-600'
                                } transition-colors duration-200`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    ))}
                </div>

                <div className="text-center mb-6">
                    <p className="text-2xl font-bold text-yellow-400">
                        {rating}
                        <span className="text-gray-400 text-lg ml-1">/ 5</span>
                    </p>
                    <p className="text-gray-400 mt-2">
                        {rating === 0 && "Select your rating"}
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
                            ${rating === 0 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Submit Rating
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-medium
                            hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal; 