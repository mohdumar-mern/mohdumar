# Portfolio Backend API

This is a Node.js + Express backend to handle profile data for a personal portfolio project.

## Features

- User authentication with JWT
- Create/update user profiles
- Upload avatar and resume (via Multer)
- Protected routes using middleware
- Cloud file storage ready (Cloudinary)
- MongoDB database integration
- CRUD operations for projects including image uploads and URLs
- Manage contacts to send and store emails
- Skills and services management

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Multer for file upload
- JWT for authentication
- Cloudinary (optional for image/resume hosting)

---

## 📁 Folder Structure

---

## 📦 API Endpoints (Examples)

- `POST /api/profile/add` — Create profile with avatar and resume upload
- `PUT /api/profile/:id/edit` — Update existing profile
- `GET /api/profile` — Retrieve all profiles
- `GET /api/profile/avatar` — Get avatar for authenticated user
- `GET /api/profile/resume` — Get resume for authenticated user
- `POST /api/projects/add` — Add a project with image upload and URL
- `GET /api/projects` — Retrieve all projects
- `POST /api/contacts` — Send and store contact emails
- `GET /api/skills` — List all skills
- `POST /api/services/add` — Add a new service

---

## 🚀 Getting Started

1. Clone the repository:  
   `git clone https://github.com/mohdumar-mern/umarmernportfoilo.git`
2. Install dependencies:  
   `npm install`
3. Create a `.env` file based on `.env.example` and configure:
   - MongoDB connection URI
   - JWT secret key
   - Cloudinary credentials (optional)
4. Start the development server:  
   `npm start` or `nodemon server.js`

---

## License

MIT © [Mohammad Umar]
