import React from 'react';
import { Mail, MessageCircle, User } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl mt-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Help & Contact</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">Need support? We're here to help.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white" placeholder="Jane Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white" placeholder="jane@example.com" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                  <MessageCircle size={18} />
                </div>
                <textarea rows="5" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white resize-none" placeholder="How can we help?"></textarea>
              </div>
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg">
              Send Message
            </button>
          </form>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white">Other ways to reach us</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">support@medicinereminder.com</p>
          </div>
          <div className="mt-4 md:mt-0 text-primary font-medium text-lg">
            1-800-HEALTH-0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
