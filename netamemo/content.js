// content.js — Content script for page info extraction

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXTRACT_PAGE_INFO") {
    const info = extractPageInfo();
    sendResponse(info);
  }
  return false;
});

function extractPageInfo() {
  const title = document.title || "";
  const url = window.location.href || "";

  // Meta description
  const metaDesc =
    getMetaContent("description") ||
    getMetaContent("og:description") ||
    getMetaContent("twitter:description") ||
    "";

  // Thumbnail from og:image
  const thumbnail =
    getMetaContent("og:image") ||
    getMetaContent("twitter:image") ||
    null;

  // Selected text
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().trim() : "";

  return {
    title,
    url,
    description: metaDesc,
    thumbnail,
    selectedText,
  };
}

function getMetaContent(name) {
  const el =
    document.querySelector(`meta[property="${name}"]`) ||
    document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute("content") : null;
}
