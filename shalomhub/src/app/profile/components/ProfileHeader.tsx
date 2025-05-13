import React from 'react';
import { ProfileHeaderProps } from './types';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ firstName, lastName, description, onEdit }) => (
    <div className="space-y-6">
        <p className="text-lg text-gray-700">
            <strong className="font-semibold">Name:</strong> {firstName} {lastName}
        </p>
        <p className="text-lg text-gray-700">
            <strong className="font-semibold">Description:</strong> {description}
        </p>
        <button
            onClick={onEdit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Edit
        </button>
    </div>
);

export default ProfileHeader;
