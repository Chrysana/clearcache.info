import { instructions } from './instructions.js';

const detectionMessage = document.getElementById('detection-message');
const instructionsSection = document.getElementById('instructions');
const browserSelect = document.getElementById('browser-select');
const osSelect = document.getElementById('os-select');
const manualSubmit = document.getElementById('manual-submit');

function detectBrowserAndOS() {
  const userAgent = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (userAgent.includes("Edg")) {
    browser = "Edge";
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    browser = "Opera";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  }

  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "macOS";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  }

  return { browser, os };
}

function displayInstructions(browser, os) {
  if (instructions[browser] && instructions[browser][os]) {
    instructionsSection.innerHTML = `<h2>Steps to Clear Cache</h2><p>${instructions[browser][os]}</p>`;
  } else if (instructions["Default"] && instructions["Default"][os]) {
    instructionsSection.innerHTML = `<h2>Steps to Clear Cache</h2><p>${instructions["Default"][os]}</p>`;
  } else {
    instructionsSection.innerHTML = `<h2>Instructions Not Found</h2><p>We couldn't find specific instructions for ${browser} on ${os}. Try using the manual selection below.</p>`;
  }
}

const detected = detectBrowserAndOS();
detectionMessage.textContent = `Detected: ${detected.browser} on ${detected.os}`;
displayInstructions(detected.browser, detected.os);

manualSubmit.addEventListener('click', () => {
  const selectedBrowser = browserSelect.value;
  const selectedOS = osSelect.value;

  if (selectedBrowser && selectedOS) {
    displayInstructions(selectedBrowser, selectedOS);
  } else {
    instructionsSection.innerHTML = `<h2>Error</h2><p>Please select both a browser and an operating system.</p>`;
  }
});
