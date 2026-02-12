function categorizeActivity(text = "") {
  const t = text.toLowerCase();

  // -----------------------------
  // WORK / PRODUCTIVITY
  // -----------------------------
  const workKeywords = [
    // Coding / Dev
    "github",
    "gitlab",
    "bitbucket",
    "leetcode",
    "geeksforgeeks",
    "hackerrank",
    "codeforces",
    "stackoverflow",
    "w3schools",
    "mdn",
    "skillrack",
    "vscode",
    "visual studio",
    "intellij",
    "eclipse",
    "pycharm",
    "webstorm",
    "android studio",
    "lms",
    "google classroom",
    "moodle",
    "canvas",
    "blackboard",
    "schoology",
    "coursera",
    "udemy",
    "edX",
    "google scholar",
    "research gate",
    "jstor",
    "semantic scholar",

    // Docs / Writing / System Productivity Apps
    "docs.google",
    "sheets.google",
    "slides.google",
    "drive.google",
    "word",
    "excel",
    "powerpoint",
    "onenote",
    "notion",
    "confluence",
    "wordpad",
    "notepad",
    "snipping tool",
    "calculator",
    "file explorer",
    "settings",
    "control panel",
    "task manager",
    "device manager",
    "services",
    "event viewer",
    "paint",
    "paint 3d",

    // Browsers used for work
    "chatgpt",
    "openai",
    "bard",
    "devtools",
    "grammarly",
    "overleaf",
    "adobe acrobat",

    // Project / Task Management
    "jira",
    "trello",
    "asana",
    "clickup",
    "monday",
    "slack",
    "localhost",

    // Technical / System Tools
    "cmd",
    "command prompt",
    "terminal",
    "powershell",

    // Database / Data Tools
    "mongodb",
    "mongo",
    "mysql",
    "postgres",
    "phpmyadmin",
    "colab",
    "jupyter",
    "kaggle",

    // Work Email Clients
    "gmail",
    "outlook",
    "gworkspace",
    "workspace.google",
    "mail",

    "photos",
    "camera",
    "calendar",

    // Video calls / Communication Tools
    "meet.google",
    "zoom",
    "microsoft teams",
    "microsoft edge",
    "teamviewer",
    "webex",

    // Work Tools
    "figma",
    "canva",
    "postman",
    "firebase",
    "cloud",
    "aws",
  ];

  if (workKeywords.some((k) => t.includes(k))) return "work";

  // -----------------------------
  // SOCIAL MEDIA
  // -----------------------------
  const socialKeywords = [
    "instagram",
    "facebook",
    "whatsapp",
    "telegram",
    "snapchat",
    "x.com",
    "twitter",
    "reddit",
    "discord",
    "linkedin",
    "messenger",
  ];

  if (socialKeywords.some((k) => t.includes(k))) return "social";

  // -----------------------------
  // GAMING
  // -----------------------------
  const gamingKeywords = [
    "steam",
    "epic games",
    "valorant",
    "riot client",
    "roblox",
    "minecraft",
    "pubg",
    "call of duty",
    "gaming",
    "gog galaxy",
    "battle.net",
    "xbox",
    "xbox game bar",
    "xbox console companion",
    "solitaire",
    "chess",
    "crazygames",
    "poki",
    "skribbl",
    "microsoft solitaire collection",
    "sky",
    "heartopia",
    "2048",
  ];

  if (gamingKeywords.some((k) => t.includes(k))) return "gaming";

  // -----------------------------
  // LEISURE / ENTERTAINMENT
  // -----------------------------
  const leisureKeywords = [
    "youtube",
    "netflix",
    "hotstar",
    "primevideo",
    "zee5",
    "spotify",
    "wynk",
    "gaana",
    "soundcloud",
    "music",
    "aniwatch",
    "crunchyroll",
    "goodreads",
    "pinterest",

    // Windows Media Apps
    "media player",
    "movies & tv",
    "vlc",
    "groove music",
  ];

  if (leisureKeywords.some((k) => t.includes(k))) return "leisure";

  return "unknown";
}

module.exports = categorizeActivity;
