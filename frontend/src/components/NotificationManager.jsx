import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Bell, AlertTriangle } from 'lucide-react';

// URL-safe Base64 to Uint8Array helper
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationManager = () => {
  const { user } = useContext(AuthContext);
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      setLoading(true);
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
          if (!publicVapidKey) {
            console.error('VITE_VAPID_PUBLIC_KEY is not defined in environment');
            setLoading(false);
            return;
          }
          
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });
        }

        // Send subscription to backend
        await api.post('/notifications/subscribe', {
          subscription,
          userId: user._id
        });
        
        console.log('Push successfully subscribed!');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported || permission === 'granted' || !user) {
    return null; // Don't show anything if not supported or already granted or not logged in
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 shadow-sm flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-indigo-900 font-medium">Enable Background Reminders</h3>
          <p className="text-indigo-700 text-sm mt-1">Get notified even when you close the app. Ensure you never miss a dose.</p>
        </div>
      </div>
      
      {permission === 'denied' ? (
        <div className="flex items-center text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded border border-amber-200">
          <AlertTriangle className="w-4 h-4 mr-2" />
          You blocked notifications. Please unblock in site settings.
        </div>
      ) : (
        <button 
          onClick={requestPermission} 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap disabled:opacity-70"
        >
          {loading ? 'Setting up...' : 'Enable Reminders'}
        </button>
      )}
    </div>
  );
};

export default NotificationManager;
