export interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  description: string;
  userId: { email: string };
  createdAt: string;
  comments: Comment[];
  likesCount: number;
  likedBy: string[];
}

export interface EditModalProps {
  postToEdit: Post | null;
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export interface DeleteModalProps {
  postToDelete: Post | null;
  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export interface CommentModalProps {
  post: Post;
  onClose: () => void;
  onComment: (postId: string, text: string) => void;
  commentText: string;
  setCommentText: (text: string) => void;
}