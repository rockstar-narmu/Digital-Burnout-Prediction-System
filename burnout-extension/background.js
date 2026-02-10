chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab && tab.url) {
    console.log("Active Tab URL:", tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("Tab Updated URL:", tab.url);
  }
});

// Receive activity data from content.js
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "activity") {
    console.log("Activity Log Received:");
    console.log("URL:", message.url);
    console.log("Keystrokes:", message.keystrokes);
    console.log("Mouse Moves:", message.mouseMoves);
    console.log("Clicks:", message.clicks);
    console.log("Scrolls:", message.scrolls);
    console.log("Scroll Distance:", message.scrollDistance);
    console.log("---------------------------");
  }
});

// Send activity to backend
async function sendToBackend(data) {
  try {
    await fetch("http://localhost:5000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("Data sent to backend:", data);
  } catch (error) {
    console.error("Failed to send data:", error);
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "activity") {
    // Build the activity object
    const activity = {
      source: "browser",
      url: message.url,
      keystrokes: message.keystrokes,
      mouseMoves: message.mouseMoves,
      clicks: message.clicks,
      scrolls: message.scrolls,
      scrollDistance: message.scrollDistance,
      timestamp: new Date().toISOString(),
    };

    console.log("Activity Received:", activity);

    // Send to backend
    sendToBackend(activity);
  }
});
