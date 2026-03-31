/**
 * 未来ポスト - Background Service Worker
 * Handles letter delivery scheduling and notifications
 */

// Check for deliverable letters every 30 minutes
const CHECK_INTERVAL_MINUTES = 30;
const ALARM_NAME = 'miraipost-delivery-check';

// Set up periodic alarm on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 1,
    periodInMinutes: CHECK_INTERVAL_MINUTES
  });
  console.log('[未来ポスト] Delivery check alarm set');
});

// Also set alarm on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 1,
    periodInMinutes: CHECK_INTERVAL_MINUTES
  });
});

// Handle alarm fires
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    await checkDeliveries();
  }
});

// Check for letters ready to deliver
async function checkDeliveries() {
  const now = Date.now();
  const data = await chrome.storage.local.get(['letters']);
  const letters = data.letters || [];
  let updated = false;

  for (const letter of letters) {
    if (letter.status === 'sealed' && letter.deliverAt <= now) {
      letter.status = 'delivered';
      letter.deliveredAt = now;
      updated = true;

      // Send notification
      const isWorry = letter.type === 'worry';
      const title = isWorry ? '📮 不安ポストから手紙が届きました' : '📮 未来の手紙が届きました';
      const message = letter.preview || letter.body.substring(0, 80);

      chrome.notifications.create(`letter-${letter.id}`, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: title,
        message: message + '...',
        priority: 1
      });
    }
  }

  if (updated) {
    await chrome.storage.local.set({ letters });
  }
}

// Handle notification clicks - open popup
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith('letter-')) {
    chrome.action.openPopup();
  }
});
