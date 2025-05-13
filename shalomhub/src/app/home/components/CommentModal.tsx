import React, { useRef } from 'react';
import Link from 'next/link';
import { CommentModalProps } from '../types';


const CommentModal: React.FC<CommentModalProps> = ({
  post,
  onClose,
  onComment,
  commentText,
  setCommentText,
}) => {
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        onComment(post._id, commentText);
        if (commentInputRef.current) {
          commentInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800 transition-all"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold">
          <Link
            href={
              post.userId.email === localStorage.getItem("userEmail")
                ? "/profile"
                : `/userProfile/${post.userId.email}`
            }
          >
            {post.userId.email}
          </Link>
        </h2>
        <p className="text-gray-600">{post.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Posted on: {new Date(post.createdAt).toLocaleString()}
        </p>

        <div className="mt-4 max-h-[300px] overflow-y-auto">
          <h3 className="font-semibold text-gray-700">Comments:</h3>
          {post.comments.map((comment, index) => (
            <div key={index} className="p-2 mt-2 bg-gray-100 rounded-md shadow-sm">
              <p className="font-semibold">
                <Link
                  href={
                    comment.userId === localStorage.getItem("userEmail")
                      ? "/profile"
                      : `/userProfile/${comment.userId}`
                  }
                >
                  {comment.userId}
                </Link>
              </p>
              <p>{comment.text}</p>
              <p className="text-sm text-gray-500">
                Posted on: {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Write a comment..."
          />
          <button
            onClick={() => {
              if (commentText.trim()) {
                onComment(post._id, commentText);
              }
            }}
            className="mt-2 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
