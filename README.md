# Professional Networking Platform

A full-stack professional networking platform built with the MERN stack (MongoDB, Express, React, Node.js). Connect with professionals, share updates, find jobs, and network with industry peers.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication and authorization
- **Profile Management**: Create and customize professional profiles with experience, education, and skills
- **Professional Feed**: Share posts, like, and comment on updates from your network
- **Networking**: Send and accept connection requests, build your professional network
- **Job Board**: Post job listings and apply to opportunities
- **Real-time Messaging**: Chat with connections using Socket.IO
- **Professional UI**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful icons
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time messaging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier works)

## ⚙️ Installation & Setup

### 1. Clone the repository or navigate to the project folder

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit the `.env` file with your MongoDB Atlas credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/professional-network?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from root)
cd frontend

# Install dependencies
npm install
```

## 🔐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free M0 tier is sufficient)
4. Click "Connect" → "Connect your application"
5. Copy the connection string and replace `<username>`, `<password>`, and `<cluster>` in your `.env` file
6. In Atlas, go to "Network Access" and add your IP address (or use 0.0.0.0/0 for development)
7. In "Database Access", create a database user with read/write permissions

## 🚀 Running the Application

### Development Mode

You need to run both backend and frontend servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Client runs on: http://localhost:3000

The frontend is configured to proxy API requests to the backend automatically.

## 📁 Project Structure

```
professional-network/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Message.js
│   │   └── Job.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── connections.js
│   │   ├── messages.js
│   │   └── jobs.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── server.js         # Express app setup
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/   # Reusable components
    │   │   └── Navbar.js
    │   ├── pages/        # Page components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Feed.js
    │   │   ├── Profile.js
    │   │   ├── Network.js
    │   │   ├── Jobs.js
    │   │   └── Messages.js
    │   ├── context/      # React Context
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search/:query` - Search users

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id/like` - Like/Unlike post
- `POST /api/posts/:id/comment` - Comment on post
- `DELETE /api/posts/:id` - Delete post

### Connections
- `GET /api/connections` - Get user connections
- `GET /api/connections/pending` - Get pending requests
- `POST /api/connections/request/:userId` - Send connection request
- `POST /api/connections/accept/:userId` - Accept request
- `DELETE /api/connections/:userId` - Remove connection

### Messages
- `GET /api/messages` - Get all conversations
- `GET /api/messages/:userId` - Get conversation with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job posting
- `POST /api/jobs/:id/apply` - Apply to job
- `DELETE /api/jobs/:id` - Delete job

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional look inspired by LinkedIn
- **Interactive Components**: Real-time updates, hover effects, smooth transitions
- **Icon System**: Heroicons for consistent, beautiful icons
- **Color Scheme**: Professional blue theme with Tailwind CSS

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation with express-validator
- CORS enabled for frontend-backend communication

## 📝 Usage

1. **Register** a new account or **Login** with existing credentials
2. **Complete your profile** with professional information
3. **Connect** with other professionals
4. **Share posts** and engage with your network
5. **Browse jobs** and apply to opportunities
6. **Message** your connections in real-time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first framework
- Heroicons for beautiful icons
- MongoDB Atlas for reliable cloud database hosting
- The MERN stack community

---

**Happy Networking! 🚀**
