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