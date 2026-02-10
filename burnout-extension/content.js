let keystrokeCount = 0;
let mouseMoveCount = 0;
let clickCount = 0;
let scrollCount = 0;
let scrollDistance = 0;
let lastScrollY = window.scrollY;

// Count key presses
document.addEventListener("keydown", () => {
  keystrokeCount++;
});

// Count mouse movement
document.addEventListener("mousemove", () => {
  mouseMoveCount++;
});

// Count clicks
document.addEventListener("click", () => {
  clickCount++;
});

// Count scroll events + distance
window.addEventListener("scroll", () => {
  scrollCount++;

  const currentY = window.scrollY;
  scrollDistance += Math.abs(currentY - lastScrollY);
  lastScrollY = currentY;
});

// Send the counts to the background script every 10 seconds
setInterval(() => {
  chrome.runtime.sendMessage({
    type: "activity",
    keystrokes: keystrokeCount,
    mouseMoves: mouseMoveCount,
    clicks: clickCount,
    scrolls: scrollCount,
    scrollDistance: scrollDistance,
    url: window.location.href,
  });

  // Reset counts after sending
  keystrokeCount = 0;
  mouseMoveCount = 0;
  clickCount = 0;
  scrollCount = 0;
  scrollDistance = 0;
}, 10000);
