export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  bio: string | null;
  username: string;  
  isFollowing:boolean,
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};