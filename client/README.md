# 🧑‍💼 Umar MERN Portfolio – Frontend

This is the **frontend** of the **Umar MERN Portfolio** — a full-stack portfolio management application where users can manage personal profiles including avatar, resume, social links, projects, skills, and more.

Built using **React.js**, **Redux Toolkit**, **React Router DOM**, and styled with **Tailwind CSS** and **DaisyUI**.

> 🔗 **Backend Repository**: [https://github.com/mohdumar-mern/umarmernportfoilo](https://github.com/mohdumar-mern/umarmernportfoilo)

---

## 🚀 Features

- 📄 **Profile Management** – Add and update name, avatar, resume, and social links.
- 🖼️ **Media Uploads** – Upload avatar and resume with real-time preview.
- 🧠 **Redux Toolkit** – Modern and maintainable state management.
- 🔄 **Dynamic Updates** – Update profile and project data seamlessly.
- 🔐 **Secure API Integration** – Interact with protected backend routes.
- 💅 **Responsive UI** – Clean design using Tailwind CSS and DaisyUI.

---

## 🛠️ Tech Stack

| Category       | Tools Used                            |
|----------------|----------------------------------------|
| Frontend       | React.js, Vite                         |
| State Manager  | Redux Toolkit, React-Redux             |
| Routing        | React Router DOM                       |
| Styling        | Tailwind CSS, DaisyUI                  |
| HTTP Requests  | Axios                                  |
| File Uploads   | Cloudinary (via backend integration)   |

---

## 📁 Folder Structure

```plaintext
umarmernportfolio-frontend/
├── public/                     # Static files
├── src/
│   ├── app/                    # Redux store setup
│   ├── components/             # Reusable UI components
│   ├── features/               # Redux slices (profileSlice, projectSlice, etc.)
│   ├── pages/                  # Route pages (Home, Profile, Projects, etc.)
│   ├── private/Dashboard/      # Authenticated dashboard pages
│   ├── routes/                 # Route definitions and protected routing
│   ├── services/               # Axios-based API requests
│   ├── App.jsx                 # Root component with all routes
│   ├── main.jsx                # React app entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── package.json                # Project metadata and dependencies
└── README.md                   # Project documentation




---

## 🧩 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mohdumar-mern/umarportfolio-frontend
cd umarmernportfolio-frontend

npm install

VITE_API_BASE_URL=http://localhost:5000/api

npm run dev

📦 Production Build

npm run build


📄 License
MIT License © Mohd Umar

📬 Connect with Me
GitHub: https://github.com/mohdumar-mern

LinkedIn: https://www.linkedin.com/in/mohd-umar-mern-stack-developer/

Portfolio: mohd-umar-mern.vercel.app


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
