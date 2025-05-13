export default interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'message' | 'friendRequest' | 'friendRequestAccepted' | string;
  recipient: string;
  sender: string;
  relatedObject: string;
  relatedObjectType: 'post' | 'message' | 'profile' | string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}