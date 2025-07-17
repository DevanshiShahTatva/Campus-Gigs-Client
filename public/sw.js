self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'Push Notification', body: 'You have a new notification!' };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/logo.svg',
    data: data.url || '/'
  });
});

// For static demo: listen for messages from the page to show a notification
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'STATIC_PUSH') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: '/logo.svg',
      data: event.data.url || '/'
    });
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
}); 