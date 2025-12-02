export interface Post {
  id: string;
  text: string | null;
  image: string | null;
  imagePublicId: string | null; // Make nullable if not always present
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string | null; // Make nullable
    username: string | null; // Make nullable  
    image: string | null;
  };  
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}

export interface PostStats{
  commentsCount:number,
  likesCount:number,
  liked:boolean
}