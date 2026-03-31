import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl transition-colors">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-primary">Login</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-2xl mb-2 font-medium">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 text-xl border rounded-lg focus:ring-4 focus:ring-primary focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-2xl mb-2 font-medium">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 text-xl border rounded-lg focus:ring-4 focus:ring-primary focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white text-2xl font-bold py-4 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            Login to Account
          </button>
        </form>
        
        <div className="mt-8 text-center text-xl">
          <p>Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold">Register Here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
