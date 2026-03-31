# Deployment Guide for Medicine Reminder System 2.0

This guide provides the exact settings you need to deploy your application to **Render (Backend)** and **Vercel (Frontend)**.

## 🛠️ Backend (Render)
Follow these steps to deploy your Node.js API:

1.  **Service Type**: Choose "Web Service".
2.  **Repository**: Connect your GitHub repo (`MRS-2.0`).
3.  **Root Directory**: `backend`
4.  **Runtime**: `Node`
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  **Environment Variables**:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A random string (e.g., `vErY_sEcReT_keY_123`).
    - `VAPID_PUBLIC_KEY`: Copy from your `.env`.
    - `VAPID_PRIVATE_KEY`: Copy from your `.env`.

---

## 🎨 Frontend (Vercel)
Follow these steps to deploy your React (Vite) app:

1.  **Project Name**: Any name you like.
2.  **Framework Preset**: `Vite`
3.  **Root Directory**: `frontend`
4.  **Build Command**: `npm install && npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    - `VITE_API_URL`: Your Render backend service URL (e.g., `https://mrs-backend.onrender.com/api`).
    
> [!NOTE]
> If you don't set `VITE_API_URL`, the frontend will default to `https://medicine-remainder-system.onrender.com/api`.

---

## 🔐 Environment Setup Summary
You can find the required variables in these template files:
- [backend/.env.example](file:///c:/Users/anilk/medicine%20remainder%20system%202.0/backend/.env.example)
- [frontend/.env.example](file:///c:/Users/anilk/medicine%20remainder%20system%202.0/frontend/.env.example)
