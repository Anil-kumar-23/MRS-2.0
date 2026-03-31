self.addEventListener('push', function (event) {
  if (event.data) {
    const data = JSON.parse(event.data.text());

    const options = {
      body: data.body,
      icon: data.icon || '/pwa-icon.svg',
      vibrate: data.vibrate || [200, 100, 200],
      data: data.data,
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'confirm') {
    const medicineId = event.notification.data.primaryKey;
    const userId = event.notification.data.userId;
    
    // Automatically detect environment inside Service Worker
    const isLocal = event.notification.data.origin && (event.notification.data.origin.includes('localhost') || event.notification.data.origin.includes('127.0.0.1'));
    const baseUrl = isLocal ? 'http://localhost:5000' : 'https://medicine-remainder-system.onrender.com';
    
    // Attempt to mark as taken in the background
    console.log('Background marking as taken for ID:', medicineId);
    
    event.waitUntil(
      fetch(`${baseUrl}/api/medicines/${medicineId}/take`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      }).then(response => {
        console.log('Backend response for mark as taken:', response.status);
      }).catch(err => {
        console.error('Failed to mark as taken from BG:', err);
      })
    );
    
    // Still focus the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow('/');
      })
    );
  } else {
    // Just click on the notification body
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
