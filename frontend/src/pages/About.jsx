import React from 'react';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl mt-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">About Us</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">Our mission is to make healthcare management accessible and reliable.</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Why We Built This</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          For many, especially the elderly, managing a daily medication regimen is complicated and stressful. Missing a dose or taking the wrong medication can have serious health consequences. We designed this Smart Medicine Reminder to provide a seamless, intuitive, and reassuring experience.
        </p>
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          Our platform focuses on what matters most: clarity and reliability. With features like real-time notifications, soft and accessible color themes, and a simple dashboard layout, we hope to empower individuals and caretakers to stay on top of their health confidently.
        </p>
        
        <div className="flex items-center gap-4 text-primary font-semibold">
          <span>Join us in building healthier habits</span>
          <ArrowRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default About;
