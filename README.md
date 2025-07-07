# 🏥 SehatBridge

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]

## 💡 Project Overview

SehatBridge is a healthcare platform designed to streamline medical appointment scheduling and healthcare management using the MERN stack (MongoDB, Express.js, React, Node.js). It simplifies the process of connecting patients and healthcare providers through a user-friendly interface and secure backend services.

Demo: 🌐 **[Live App Preview](https://sehatbridge.tech2stack.com)**

---

## 🚀 Features

- **Frontend (React)**  
  - User-friendly appointment booking
  - Doctor and patient dashboards
  - Authentication and authorization

- **Backend (Node.js + Express)**  
  - JWT-based secure authentication
  - Role-based access controls
  - API endpoints for appointments, users, and medical records

- **Database (MongoDB)**  
  - Stores user profiles, appointments, and medical data securely

---

## 🔧 Tech Stack & System Architecture

- **React** with functional components and React Router
- **Node.js** & **Express** RESTful API
- **MongoDB** with Mongoose ODM
- **Docker** for containerized development

```
[frontend] <--REST--> [backend] <--MongoDB--> [database]
```

---

## 📦 Getting Started (Local Setup)

### 🔧 Prerequisites

- Node.js >= 14.x
- MongoDB (local or Atlas)
- Docker & Docker-Compose (optional)

### 🏗️ Installation

```bash
# Clone the repo
git clone https://github.com/shivuu2005/SehatBridge.git
cd SehatBridge

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### ⚙️ Configuration

Create `.env` files:

**server/.env**
```
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<a_long_secret_key>
```

**client/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### ▶️ Running Locally

**Without Docker**
```bash
# Run backend
cd server && npm run dev

# Run frontend
cd client && npm start
```

**With Docker**
```bash
docker-compose up --build
```

Access it at: `http://localhost:3000`

---

## 📂 Project Structure

```
SehatBridge/
├── server/                # Node.js + Express backend APIs
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── middlewares/       # Auth, error handling
│   ├── config/            # DB and server configs
│   └── index.js           # Entry point
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-based pages
│   │   ├── context/       # React contexts for state
│   │   └── App.js, index.js
├── docker-compose.yaml
└── README.md
```

---

## 🧪 Testing

```bash
# From server directory
npm test

# From client directory
npm test
```

---

## 🤝 Contribution Guidelines

Contributions are welcome! To contribute:

1. ⭐ Fork the repo
2. 🔧 Create a feature branch (`git checkout -b feature/NewFeature`)
3. 🧹 Make changes and add tests if possible
4. 📄 Submit a pull request

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- Thanks to open-source libraries like React, Express, Mongoose.
- Inspired by healthcare digitization initiatives.

---

### 📢 Connect with Me

**Shivam Malviya**
- 👤 GitHub: [@shivuu2005](https://github.com/shivuu2005)


---

> “Health is wealth.” 💡
