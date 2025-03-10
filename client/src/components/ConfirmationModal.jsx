import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 w-96 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-gray-300 mb-8 text-center">
                    {message}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium
                            hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Remove
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

export default ConfirmationModal; 