import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Clock, Activity } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300">
    <div className="h-12 w-12 bg-primary-light text-primary dark:bg-primary-dark/20 dark:text-primary-light rounded-xl flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.png" alt="Medical Background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light font-medium text-sm mb-6 shadow-sm">
            #1 Medicine Management App
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight">
            Stay Healthy with <br className="hidden md:block"/> <span className="text-primary">Smart Medicine Reminders</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Never miss a dose again. Track your medications, manage your health schedule, and get timely notifications—all in one secure place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 text-center">
              Get Started
            </Link>
            <Link to="/about" className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 text-center">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Why Choose Our App?</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">We've designed our platform with simplicity and reliability in mind, specifically tailored to ensure your health is always the priority.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Pill} 
            title="Effortless Tracking" 
            description="Manage all your prescriptions, vitamins, and supplements in one clean, easy-to-read dashboard."
          />
          <FeatureCard 
            icon={Clock} 
            title="Timely Alerts" 
            description="Get precise notifications exactly when it's time to take your medication, based on your custom schedule."
          />
          <FeatureCard 
            icon={Activity} 
            title="Health Overview" 
            description="Keep a consistent record of your medication habits to share with your healthcare provider."
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
