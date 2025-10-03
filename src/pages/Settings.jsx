import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from '../components/ProfileModal';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {user?.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {user?.email}
              </div>
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Settings;