interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  isFriend: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ firstName, lastName, isFriend }) => {
  return (
    <h1 className="text-4xl font-semibold text-gray-800 mb-4 flex items-center space-x-4">
      <span>
        {firstName} {lastName}
      </span>
      {isFriend && (
        <div className="px-3 py-1 bg-green-500 text-white text-sm rounded-md mt-1">
          Friend
        </div>
      )}
    </h1>
  );
};

export default ProfileHeader;
