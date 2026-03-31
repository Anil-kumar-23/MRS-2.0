const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const webpush = require('web-push');

const init = () => {
  console.log('Reminder service initialized. Checking for medicines every minute.');
  
  // Run this job every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      // In 2.0, 'times' is an array of strings.
      // We look for medicines where 'times' array contains the currentTime.
      const medicines = await Medicine.find({ times: currentTime, isActive: true }).populate('userId');

      if (medicines.length > 0) {
        console.log(`\n🔔 REMINDER CHECKS FOR ${currentTime}`);
        
        for (let med of medicines) {
          const user = med.userId;
          if (user) {
            console.log(`[ALERT] -> User: ${user.name} | Medicine: ${med.name}`);
            
            const payload = JSON.stringify({
              title: 'Medicine Reminder',
              body: `It is time to take your ${med.name} (${med.dosage}).`,
              icon: '/pwa-icon.svg',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              data: {
                dateOfArrival: Date.now(),
                primaryKey: med._id,
                userId: user._id
              },
              actions: [
                {action: 'confirm', title: 'I took it'}
              ]
            });

            // Web Push notification
            if (user.subscription) {
              try {
                await webpush.sendNotification(user.subscription, payload);
                console.log('✅ Web Push Notification sent to', user.name);
              } catch (err) {
                console.error('❌ Failed to send Web Push');
                if (err.statusCode === 410 || err.statusCode === 404) {
                   // Remove expired subscription
                   user.subscription = null;
                   await user.save();
                }
              }
            } else {
              console.log('⚠️ No push subscription for', user.name, '- Consider adding email fallback.');
              // We could add email fallback here if nodemailer was configured in .env
            }
          }
        }
        console.log('----------------------------------------\n');
      }
    } catch (error) {
      console.error('Error running scheduler:', error);
    }
  });
};

module.exports = { init };
