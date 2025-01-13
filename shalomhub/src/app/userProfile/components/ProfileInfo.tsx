interface ProfileInfoProps {
  description: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ description }) => {
  return <p className="text-lg text-gray-700 mb-6">{description}</p>;
};

export default ProfileInfo;
