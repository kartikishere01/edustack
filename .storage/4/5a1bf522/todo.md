# Educational Platform MVP - Todo List

## Overview
Building a Codecademy-inspired educational platform with clean, modern design using React, TypeScript, Shadcn-UI, and Tailwind CSS. Using localStorage for data persistence.

## Core Files to Create/Modify

### 1. Data & Types (src/types/index.ts)
- User types (Student, Tutor)
- Course, Chunk, Review, Badge interfaces
- Authentication state types

### 2. Data Management (src/lib/storage.ts)
- localStorage utilities for users, courses, reviews, badges
- Mock data initialization
- CRUD operations

### 3. Authentication Context (src/contexts/AuthContext.tsx)
- User authentication state management
- Login/logout functionality
- Role-based access control

### 4. Pages
- **src/pages/Home.tsx** - Hero section, login/signup buttons
- **src/pages/Auth.tsx** - Combined login/signup with role selection
- **src/pages/StudentDashboard.tsx** - Course grid, search/filter, profile
- **src/pages/TutorDashboard.tsx** - Subject selection, course creation
- **src/pages/CourseDetail.tsx** - Course chunks, progress, purchase
- **src/pages/TutorAccess.tsx** - AI evaluation simulation

### 5. Components
- **src/components/CourseCard.tsx** - Course display card
- **src/components/Badge.tsx** - Achievement badges
- **src/components/ProgressTracker.tsx** - Course/chunk progress
- **src/components/StarRating.tsx** - Interactive rating component

### 6. Updated Files
- **src/App.tsx** - Add routing for all pages
- **index.html** - Update title and meta tags

## Features Implementation Priority
1. ✅ Basic routing and layout
2. ✅ Authentication system
3. ✅ Student dashboard with courses
4. ✅ Course detail and chunks
5. ✅ Tutor dashboard and course creation
6. ✅ Rating/review system
7. ✅ Badge/gamification system
8. ✅ Responsive design and styling

## Design Guidelines
- Codecademy-inspired color scheme (blues, greens, clean whites)
- Modern typography and spacing
- Responsive grid layouts
- Interactive hover effects
- Clean, intuitive navigation