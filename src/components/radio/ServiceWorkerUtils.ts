
// Service Worker Registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const swCode = `
      let messageQueue = [];

      self.addEventListener('message', (event) => {
        if (event.data.type === 'BACKGROUND_MESSAGE') {
          messageQueue.push(event.data.payload);
          console.log('Background message queued:', event.data.payload);
        }
      });

      self.addEventListener('sync', (event) => {
        if (event.tag === 'mesh-radio-sync') {
          event.waitUntil(processMessageQueue());
        }
      });

      async function processMessageQueue() {
        console.log('Processing message queue:', messageQueue.length, 'messages');
        // Process queued messages when connection is restored
        messageQueue = [];
      }

      self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        clients.openWindow('/');
      });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  }
};
