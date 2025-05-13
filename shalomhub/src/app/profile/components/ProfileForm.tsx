import React from 'react';
import { ProfileFormProps } from './types';

const ProfileForm: React.FC<ProfileFormProps> = ({
  newData,
  setNewData,
  onSave,
  onCancel,
}) => (
  <div className="space-y-6">
    <div>
      <label className="block text-lg font-medium text-gray-700">First Name</label>
      <input
        type="text"
        value={newData.firstName}
        onChange={(e) => setNewData({ ...newData, firstName: e.target.value })}
        placeholder="Enter first name"
        className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-lg font-medium text-gray-700">Last Name</label>
      <input
        type="text"
        value={newData.lastName}
        onChange={(e) => setNewData({ ...newData, lastName: e.target.value })}
        placeholder="Enter last name"
        className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-lg font-medium text-gray-700">Description</label>
      <textarea
        value={newData.description}
        onChange={(e) => setNewData({ ...newData, description: e.target.value })}
        placeholder="Write a short description"
        className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="flex gap-4">
      <button
        onClick={onSave}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ProfileForm;
