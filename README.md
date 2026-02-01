
# 🧩 Playto Community App

A full-stack community application built with **Django (REST API)** and **React (Frontend)**.

---

## 📁 Project Structure

```txt
Playto-Assignment/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   └── core/
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│
├── .gitignore
└── README.md
└── README.md


```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

* **Python** ≥ 3.10
* **Node.js** ≥ 18
* **npm** or **yarn**
* **Git**

Verify:

```bash
python --version
node --version
npm --version
```

---

## 🚀 Local Development Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/community-app.git
cd community-app
```

---

## 🐍 Backend Setup (Django)

### 2️⃣ Go to backend directory

```bash
cd backend
```

---

### 3️⃣ Create a virtual environment

```bash
python -m venv venv
```

---

### 4️⃣ Activate the virtual environment

**macOS / Linux**

```bash
source venv/bin/activate
```

**Windows (PowerShell)**

```powershell
venv\Scripts\Activate.ps1
```

---

### 5️⃣ Install backend dependencies

```bash
pip install -r requirements.txt
```


### 7️⃣ Run database migrations

```bash
python manage.py migrate
```

---

### 8️⃣ (Optional) Create a superuser

```bash
python manage.py createsuperuser
```

---

### 9️⃣ Start the Django server

```bash
python manage.py runserver
```

Backend will run at:

```
http://localhost:8000
```

---

## ⚛️ Frontend Setup (React)

> Open a **new terminal window**.

### 🔟 Go to frontend directory

```bash
cd frontend
```

---

### 1️⃣1️⃣ Install frontend dependencies

```bash
npm install
```

---

### 1️⃣2️⃣ Configure environment variables (optional)

Create a `.env` file in `frontend`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

(Adjust based on your setup.)

---

### 1️⃣3️⃣ Start the React dev server

```bash
npm run dev
```

or (if using Create React App):

```bash
npm start
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🔗 Frontend ↔ Backend Communication

* Backend API: `http://localhost:8000`
* Frontend calls backend using **Axios**
* CORS is enabled in Django for local development

---

## 🧪 Common Commands

### Backend

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

### Frontend

```bash
npm run build
npm run lint
```



## 📦 Tech Stack

### Backend

* Django
* Django REST Framework
* SQLite (development)

### Frontend

* React
* Axios
* Tailwind CSS

---




## 📄 License

MIT License

---

## ✅ TL;DR – Quick Start

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

