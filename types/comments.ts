// Create a new comment
export interface CreateCommentData {
  content: string;
  postId: string;
  userId: string;
}

// Create a reply
export interface CreateReplyData {
  content: string;
  postId: string;
  userId: string;
  parentCommentId: string;
}

// A reply (nested comment)
export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  parentCommentId: string;

  author: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };
}

// A comment with optional replies
export interface Comment {
  id: string;
  content: string;
  createdAt: string;

  author: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };

  // replies loaded from backend
  replies?: Reply[];
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}
