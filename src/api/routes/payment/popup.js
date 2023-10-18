// popup.js

// This script is run in the context of the popup window.

window.onload = () => {
  // Send a message to the parent window
  window.opener.postMessage("Hello from the popup!", "*");
};
