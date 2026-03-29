/**
 * LoveBytes — Guestbook (90s-style message wall).
 */
(function (exports) {
  'use strict';

  const GUESTBOOK_KEY = 'lovebytes_guestbook';

  function createMessage(author, text, color) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      author: author || 'Anonymous',
      text: text,
      color: color || '#00ff00',
      timestamp: new Date().toISOString(),
    };
  }

  function loadMessages() {
    try {
      return JSON.parse(localStorage.getItem(GUESTBOOK_KEY) || '[]');
    } catch { return []; }
  }

  function saveMessages(messages) {
    localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(messages));
  }

  function addMessage(msg) {
    const messages = loadMessages();
    messages.push(msg);
    saveMessages(messages);
    return messages;
  }

  function getMessageCount() {
    return loadMessages().length;
  }

  exports.createMessage = createMessage;
  exports.loadMessages = loadMessages;
  exports.saveMessages = saveMessages;
  exports.addMessage = addMessage;
  exports.getMessageCount = getMessageCount;

})(typeof window !== 'undefined' ? window : module.exports);
