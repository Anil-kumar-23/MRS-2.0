import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddMedicine from './pages/AddMedicine';
import MedicineList from './pages/MedicineList';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotificationManager from './components/NotificationManager';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-200 bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
        <Navbar />
        <main className="flex-grow w-full flex flex-col">
          <NotificationManager />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-medicine" element={
              <ProtectedRoute>
                <AddMedicine />
              </ProtectedRoute>
            } />
            <Route path="/medicines" element={
              <ProtectedRoute>
                <MedicineList />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
