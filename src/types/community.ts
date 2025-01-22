export interface Post {
  id: string;
  type: 'announcement' | 'discussion';
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: Date;
  likes: number;
} 