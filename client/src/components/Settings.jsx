import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios.mjs';
import { AuthContext } from '../context/AuthContext';
import { enqueueSnackbar } from 'notistack';

const Settings = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user.id}`, {
        username,
      }, { withCredentials: true });

      if (response.status === 200) {
        enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
        onClose();
        window.location.reload();
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update profile', { variant: 'error' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('New passwords do not match', { variant: 'error' });
      return;
    }

    try {
      const response = await api.put(`/users/${user.id}/password`, {
        currentPassword,
        newPassword
      }, { withCredentials: true });

      if (response.status === 200) {
        enqueueSnackbar('Password updated successfully!', { variant: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update password', { variant: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete(`/users/${user.id}`, { withCredentials: true });
      if (response.status === 200) {
        enqueueSnackbar('Account deleted successfully', { variant: 'success' });
        logout();
        navigate('/');
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete account', { variant: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-6 animate-scale-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-400">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold
              hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          >
            Update Profile
          </button>
        </form>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold
              hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Update Password
          </button>
        </form>

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold
              hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
          >
            Delete Account
          </button>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full animate-scale-in">
              <h3 className="text-xl font-bold text-red-500 mb-4">Delete Account</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold
                    hover:bg-red-600 transition-all duration-300"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-semibold
                    hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 