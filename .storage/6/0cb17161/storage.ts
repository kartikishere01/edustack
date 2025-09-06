import { User, Course, Chunk, Review, Badge, UserProgress } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'edu_users',
  COURSES: 'edu_courses',
  CHUNKS: 'edu_chunks',
  REVIEWS: 'edu_reviews',
  BADGES: 'edu_badges',
  PROGRESS: 'edu_progress',
  CURRENT_USER: 'edu_current_user'
};

// Initialize mock data
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BADGES)) {
    const badges: Badge[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first course chunk',
        icon: '🎯',
        requirement: 'complete_first_chunk'
      },
      {
        id: '2',
        name: 'Course Conqueror',
        description: 'Complete an entire course',
        icon: '🏆',
        requirement: 'complete_course'
      },
      {
        id: '3',
        name: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        requirement: 'streak_7_days'
      },
      {
        id: '4',
        name: 'Knowledge Seeker',
        description: 'Enroll in 5 different courses',
        icon: '📚',
        requirement: 'enroll_5_courses'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  }

  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    const courses: Course[] = [
      {
        id: '1',
        title: 'Introduction to Calculus',
        description: 'Master the fundamentals of calculus with step-by-step guidance',
        tutorId: 'tutor1',
        tutorName: 'Dr. Sarah Johnson',
        subject: 'Math',
        totalPrice: 120,
        numberOfSections: 6,
        pricePerSection: 20,
        averageRating: 4.8,
        totalReviews: 156,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Physics Fundamentals',
        description: 'Explore the basic principles of physics through interactive lessons',
        tutorId: 'tutor2',
        tutorName: 'Prof. Michael Chen',
        subject: 'Physics',
        totalPrice: 100,
        numberOfSections: 5,
        pricePerSection: 20,
        averageRating: 4.6,
        totalReviews: 89,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Organic Chemistry Basics',
        description: 'Understand organic chemistry concepts with practical examples',
        tutorId: 'tutor3',
        tutorName: 'Dr. Emily Rodriguez',
        subject: 'Chemistry',
        totalPrice: 140,
        numberOfSections: 7,
        pricePerSection: 20,
        averageRating: 4.9,
        totalReviews: 203,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CHUNKS)) {
    const chunks: Chunk[] = [
      // Calculus course chunks
      { id: '1-1', courseId: '1', title: 'Limits and Continuity', content: 'Introduction to limits...', order: 1, price: 20 },
      { id: '1-2', courseId: '1', title: 'Derivatives', content: 'Understanding derivatives...', order: 2, price: 20 },
      { id: '1-3', courseId: '1', title: 'Applications of Derivatives', content: 'Real-world applications...', order: 3, price: 20 },
      { id: '1-4', courseId: '1', title: 'Integrals', content: 'Introduction to integration...', order: 4, price: 20 },
      // Physics course chunks
      { id: '2-1', courseId: '2', title: 'Motion and Forces', content: 'Newton\'s laws...', order: 1, price: 20 },
      { id: '2-2', courseId: '2', title: 'Energy and Work', content: 'Conservation of energy...', order: 2, price: 20 },
      { id: '2-3', courseId: '2', title: 'Waves and Sound', content: 'Wave properties...', order: 3, price: 20 },
      { id: '2-4', courseId: '2', title: 'Electricity and Magnetism', content: 'Electric fields...', order: 4, price: 20 },
    ];
    localStorage.setItem(STORAGE_KEYS.CHUNKS, JSON.stringify(chunks));
  }
};

// User operations
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Course operations
export const getCourses = (): Course[] => {
  const courses = localStorage.getItem(STORAGE_KEYS.COURSES);
  return courses ? JSON.parse(courses) : [];
};

export const saveCourse = (course: Course): void => {
  const courses = getCourses();
  const existingIndex = courses.findIndex(c => c.id === course.id);
  if (existingIndex >= 0) {
    courses[existingIndex] = course;
  } else {
    courses.push(course);
  }
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
};

// Chunk operations
export const getChunks = (courseId?: string): Chunk[] => {
  const chunks = localStorage.getItem(STORAGE_KEYS.CHUNKS);
  const allChunks: Chunk[] = chunks ? JSON.parse(chunks) : [];
  return courseId ? allChunks.filter(chunk => chunk.courseId === courseId) : allChunks;
};

export const saveChunk = (chunk: Chunk): void => {
  const chunks = getChunks();
  const existingIndex = chunks.findIndex(c => c.id === chunk.id);
  if (existingIndex >= 0) {
    chunks[existingIndex] = chunk;
  } else {
    chunks.push(chunk);
  }
  localStorage.setItem(STORAGE_KEYS.CHUNKS, JSON.stringify(chunks));
};

// Review operations
export const getReviews = (courseId?: string): Review[] => {
  const reviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  const allReviews: Review[] = reviews ? JSON.parse(reviews) : [];
  return courseId ? allReviews.filter(review => review.courseId === courseId) : allReviews;
};

export const saveReview = (review: Review): void => {
  const reviews = getReviews();
  reviews.push(review);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

// Badge operations
export const getBadges = (): Badge[] => {
  const badges = localStorage.getItem(STORAGE_KEYS.BADGES);
  return badges ? JSON.parse(badges) : [];
};

// Progress operations
export const getUserProgress = (userId: string): UserProgress[] => {
  const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const allProgress: UserProgress[] = progress ? JSON.parse(progress) : [];
  return allProgress.filter(p => p.userId === userId);
};

export const saveUserProgress = (progress: UserProgress): void => {
  const allProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const progressArray: UserProgress[] = allProgress ? JSON.parse(allProgress) : [];
  const existingIndex = progressArray.findIndex(p => p.userId === progress.userId && p.courseId === progress.courseId);
  
  if (existingIndex >= 0) {
    progressArray[existingIndex] = progress;
  } else {
    progressArray.push(progress);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressArray));
};