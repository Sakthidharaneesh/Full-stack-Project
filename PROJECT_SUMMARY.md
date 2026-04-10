

# Connex - Professional Networking Platform

## Project Overview
**Connex** is a full-stack professional networking platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a modern, feature-rich alternative to LinkedIn with a stunning glassmorphism UI design.

## Tech Stack

### Backend
- **Node.js** v22.15.0 with Express.js 4.18.2
- **MongoDB** (Local) with Mongoose 8.0.3
- **Authentication**: JWT tokens with bcryptjs
- **Real-time**: Socket.IO 4.6.0 for messaging
- **Security**: Protected routes with auth middleware
- **Payload**: 50MB limit for image/video uploads

### Frontend
- **React** 18.2.0 with React Router 6.20.1
- **Styling**: Tailwind CSS 3.3.6 with custom animations
- **Icons**: Heroicons 2.1.1
- **HTTP Client**: Axios 1.6.2
- **Design**: Glassmorphism with gradient themes

## Core Features

### 1. Authentication System
- User registration and login
- JWT-based authentication
- Secure password hashing
- Floating animated orbs on auth pages

### 2. User Profiles
- Customizable profiles with cover images
- Edit profile functionality (name, headline, location, industry, about)
- Profile pictures with gradient avatars
- Editable skills and portfolio sections
- View other users' profiles

### 3. Feed & Posts
- Create posts with text, images, or videos
- Base64 media encoding with preview
- Like/unlike posts
- Comment on posts
- Share posts (clipboard copy)
- Save/bookmark posts
- Edit and delete own posts
- Scrollable feed with fixed sidebars

### 4. Job Opportunities
- Post job listings
- Edit and delete own job postings
- Apply to jobs
- Search jobs by title, company, or description
- Job details: title, company, location, type, salary, requirements
- View applicant count

### 5. Professional Network
- View suggested connections
- Add connections with animated UI
- Search for professionals
- View connection count

### 6. Messaging
- Real-time chat with Socket.IO
- Message history
- Online status indicators
- UI Avatars for profile pictures

### 7. Search Functionality
- Global search bar in navbar
- Search results organized by tabs (All/People/Posts/Jobs)
- Search users, posts, and jobs
- Real-time search results

### 8. Schedule Management
- Interactive calendar widget
- Add/edit/delete events
- Color-coded events (6 color options)
- Notification toggle for events
- Event details: date, day, title, time, location
- Hover to show edit/delete buttons

### 9. Community Features
- Browse communities
- Search communities
- Active member count
- Join communities

## UI/UX Highlights

### Design System
- **Theme**: Blue (#3b82f6) → Indigo (#6366f1) → Purple (#9333ea) gradients
- **Glassmorphism**: `bg-white/70` with `backdrop-blur-lg`
- **Animations**: Float, shimmer, fade-in, slide-in, scale-in
- **Scrollbars**: Hidden for clean look
- **Responsive**: Grid-based layout (12 columns)

### Custom Animations
- Floating orbs on login/register
- Gradient text animations
- Hover effects with scale transforms
- Smooth transitions (300ms duration)
- Loading spinners with gradients
- Pulsing notification badges

### Layout
- **Navbar**: Glass effect, sticky top, animated logo, enhanced search
- **Feed Layout**: 3-column grid with sticky sidebars
- **Left Sidebar**: Profile summary with editable sections
- **Main Feed**: Scrollable posts section
- **Right Sidebar**: Calendar, schedule, communities (sticky)

## Data & Seeding
- **5 Users** with different Pravatar images
- **15 Posts** with varied Unsplash images
- **6 Job Listings** from top tech companies
- **27 Messages** for testing chat functionality

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/search?q=` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `PUT /api/users/profile` - Update own profile

### Posts
- `GET /api/posts` - Get all posts (with search)
- `POST /api/posts` - Create post (text/image/video)
- `PUT /api/posts/:id` - Edit post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Comment on post

### Jobs
- `GET /api/jobs` - Get all jobs (with search)
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/apply` - Apply to job

### Messages
- `GET /api/messages/:userId` - Get conversation
- `POST /api/messages` - Send message

## Key Accomplishments

1. ✅ **Full CRUD Operations** on posts and jobs
2. ✅ **Real-time Messaging** with Socket.IO
3. ✅ **Media Upload** with base64 encoding (images/videos)
4. ✅ **Advanced Search** with tabs and filters
5. ✅ **Interactive Schedule** with full CRUD and notifications
6. ✅ **Stunning UI** with glassmorphism and animations
7. ✅ **Responsive Design** with Tailwind CSS
8. ✅ **Secure Authentication** with JWT
9. ✅ **Optimized Performance** with sticky sidebars and hidden scrollbars
10. ✅ **Professional Branding** as "Connex"

## Setup & Configuration

### Environment Variables
- Backend: MongoDB URI on port 5001
- Frontend: Proxy configured to backend

### Database
- Local MongoDB: `mongodb://localhost:27017/professional-network`

### Ports
- Backend: 5001
- Frontend: 3000

### Installation & Running

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Seeding
```bash
cd backend
node seed.js
```

## Project Structure
```
Mern Full Stack/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Job.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── jobs.js
│   │   ├── messages.js
│   │   └── connections.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── ProfileSidebar.js
    │   │   └── RightSidebar.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Feed.js
    │   │   ├── Profile.js
    │   │   ├── Jobs.js
    │   │   ├── Messages.js
    │   │   ├── Search.js
    │   │   └── Network.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

## Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "socket.io": "^4.6.0",
  "nodemon": "^3.1.11"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "@heroicons/react": "^2.1.1",
  "socket.io-client": "^4.6.0",
  "tailwindcss": "^3.3.6"
}
```

## Features Breakdown

### Authentication Flow
1. User registers with email and password
2. Password hashed with bcryptjs
3. JWT token generated and stored in localStorage
4. Token sent in headers for protected routes
5. Auto-login on page refresh if token valid

### Post Creation Flow
1. User types content or selects media
2. File converted to base64
3. Preview shown before posting
4. POST request with 50MB payload limit
5. Post appears in feed with author details

### Job Posting Flow
1. Authorized users create job listings
2. Form validates required fields
3. Job stored with poster's user ID
4. Only job creator can edit/delete
5. Applicants tracked in applicants array

### Schedule Management Flow
1. Click + button to add event
2. Modal opens with form (z-index 9999)
3. Fill title, time (required), date, location
4. Select color and enable notifications
5. Event saved with all details
6. Hover to show edit/delete options

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Protected API routes with auth middleware
- User authorization checks (can only edit own content)
- CORS configuration
- Environment variables for sensitive data

## Performance Optimizations
- Hidden scrollbars for cleaner UI
- Sticky sidebars to reduce scrolling
- Lazy loading of components
- Efficient state management
- Debounced search inputs
- Optimized animations (GPU-accelerated)

## Future Enhancements (Potential)
- Email notifications for events
- File upload to cloud storage (AWS S3/Cloudinary)
- Video calls integration
- Advanced analytics dashboard
- Connection recommendations algorithm
- Job application tracking
- Endorsements and recommendations
- Groups and communities expansion
- Mobile application (React Native)
- Progressive Web App (PWA)

## Known Issues & Fixes Applied
1. ✅ Proxy configuration for backend communication
2. ✅ 50MB payload limit for media uploads
3. ✅ Dynamic Tailwind classes replaced with conditional rendering
4. ✅ Modal z-index increased for proper overlay
5. ✅ Schedule validation fixed (only title and time required)
6. ✅ Edit profile endpoint added with authorization
7. ✅ Scrollbar hidden globally

---

## Project Status
**Status**: ✅ Fully Functional  
**Code Quality**: Production-ready with error handling  
**UI/UX**: Modern, professional, and polished  
**Performance**: Optimized with lazy loading and efficient state management  
**Documentation**: Comprehensive with inline comments  

---

## Credits
**Project Name**: Connex  
**Developer**: Full Stack MERN Development  
**Date**: January 2026  
**Version**: 1.0.0  

---

## Contact & Support
For questions or support, please refer to the codebase documentation or contact the development team.

**Happy Networking! 🚀**
