export interface User {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'tutor';
  name: string;
  createdAt: string;
  // Student specific
  enrolledCourses?: string[];
  completedChunks?: string[];
  badges?: string[];
  streak?: number;
  // Tutor specific
  subjects?: string[];
  isApproved?: boolean;
  accessScore?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  totalPrice: number;
  numberOfSections: number;
  pricePerSection: number;
  averageRating: number;
  totalReviews: number;
  previewImage?: string;
  createdAt: string;
}

export interface Chunk {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  price: number;
  pdfUrl?: string;
}

export interface Review {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedChunks: string[];
  completionPercentage: number;
  lastAccessed: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
}