// Initialize defaults on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["inu-saiten:settings"], (res) => {
    if (!res["inu-saiten:settings"]) {
      chrome.storage.local.set({
        "inu-saiten:settings": { dog: "pochi", enabled: true },
      });
    }
  });
});
