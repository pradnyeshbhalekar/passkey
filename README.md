# 🔐 PassKey - Secure Password Manager

PassKey is a modern full-stack password management application designed to help users securely store, manage, and generate strong passwords. The project focuses on implementing practical cybersecurity concepts such as encrypted credential storage, secure authentication, and password security best practices.

## 🌐 Live Demo

https://passkey-ftx3.onrender.com

## 📂 Repository

https://github.com/pradnyeshbhalekar/passkey

---

## 🚀 Features

### Authentication

* Google OAuth Login
* Secure user authentication flow
* Session management

### Password Vault

* Store and manage credentials securely
* Add, edit, delete, and view saved passwords
* Search and organize stored credentials

### Password Generator

* Generate strong passwords instantly
* Customizable password length
* Support for uppercase, lowercase, numbers, and special characters

### AES Encryption

* Passwords are encrypted before storage
* Sensitive information is protected from unauthorized access
* Implements secure data protection practices

### Modern User Interface

* Responsive design
* User-friendly dashboard
* Clean and intuitive navigation

---

## 🔒 Security Features

### AES Encryption

PassKey uses AES-based encryption to secure sensitive password data before storage, ensuring credentials remain protected.

### Google Authentication

Users can securely sign in using Google OAuth, reducing reliance on traditional password-only authentication.

### Secure Credential Storage

Stored passwords are protected using encryption techniques and security-focused application design.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Security

* AES Encryption (CryptoJS)
* Google OAuth
* Environment Variable Management

---

## 📁 Project Structure

```bash
passkey/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── config/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/pradnyeshbhalekar/passkey.git
cd passkey
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Environment Variables

Frontend:

```env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Backend:

```env
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
SESSION_SECRET=YOUR_SESSION_SECRET
```

---

## 🎯 Cybersecurity Concepts Demonstrated

* Authentication & Authorization
* Password Security Best Practices
* Secure Credential Storage
* Data Encryption
* OAuth Authentication
* Full-Stack Security Design
* Secure API Development

---

## 🔮 Planned Enhancements

* Multi-Factor Authentication (MFA)
* Security Dashboard
* Password Health Analysis
* Audit Logging
* Breach Detection Integration
* Session Monitoring
* Account Security Analytics

---

## 👨‍💻 Contributors

* Ayush Sawant
* Pradnyesh Bhalekar
* Daksh Goyal

---

## 📜 License

This project is developed for educational, portfolio, and cybersecurity learning purposes.
