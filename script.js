import { instructions } from './instructions.js';

const detectionMessage = document.getElementById('detection-message');
const instructionsSection = document.getElementById('instructions');
const browserSelect = document.getElementById('browser-select');
const osSelect = document.getElementById('os-select');
const manualSubmit = document.getElementById('manual-submit');

const allBrowsers = Object.keys(instructions).filter(b => b !== "Default");
const allOSes = [...new Set(allBrowsers.flatMap(b => Object.keys(instructions[b])))];

function getOSesForBrowser(browser) {
  return instructions[browser] ? Object.keys(instructions[browser]) : allOSes;
}

function getBrowsersForOS(os) {
  return os ? allBrowsers.filter(b => instructions[b]?.[os]) : allBrowsers;
}

function populateSelect(select, options, currentValue, placeholder) {
  const frag = document.createDocumentFragment();

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.disabled = true;
  defaultOpt.textContent = placeholder;
  frag.appendChild(defaultOpt);

  let currentStillValid = false;
  for (const value of options) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;
    if (value === currentValue) currentStillValid = true;
    frag.appendChild(opt);
  }

  select.textContent = '';
  select.appendChild(frag);

  if (currentStillValid) {
    select.value = currentValue;
  } else {
    select.selectedIndex = 0;
  }
}

function updateDropdowns() {
  const selectedBrowser = browserSelect.value;
  const selectedOS = osSelect.value;

  const validOSes = selectedBrowser ? getOSesForBrowser(selectedBrowser) : allOSes;
  populateSelect(osSelect, validOSes, selectedOS, 'Choose an OS');

  const validBrowsers = osSelect.value ? getBrowsersForOS(osSelect.value) : allBrowsers;
  populateSelect(browserSelect, validBrowsers, selectedBrowser, 'Choose a browser');
}

populateSelect(browserSelect, allBrowsers, '', 'Choose a browser');
populateSelect(osSelect, allOSes, '', 'Choose an OS');

browserSelect.addEventListener('change', updateDropdowns);
osSelect.addEventListener('change', updateDropdowns);

function detectBrowser() {
  const uad = navigator.userAgentData;
  if (uad) {
    const brands = uad.brands.map(b => b.brand);
    if (brands.some(b => b === "DuckDuckGo")) return "DuckDuckGo";
    if (navigator.brave) return "Brave";
    if (brands.some(b => b === "Samsung Internet")) return "Samsung Internet";
    if (brands.some(b => b === "Vivaldi")) return "Vivaldi";
    if (brands.some(b => b === "Opera")) return "Opera";
    if (brands.some(b => b === "Microsoft Edge")) return "Edge";
    if (brands.some(b => b === "Google Chrome" || b === "Chromium")) return "Chrome";
  }

  const ua = navigator.userAgent;
  if (ua.includes("DuckDuckGo")) return "DuckDuckGo";
  if (ua.includes("SamsungBrowser")) return "Samsung Internet";
  if (navigator.brave) return "Brave";
  if (ua.includes("Vivaldi")) return "Vivaldi";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Chrome")) return "Chrome";
  return "Unknown Browser";
}

function detectOS() {
  const uad = navigator.userAgentData;
  if (uad) {
    const p = uad.platform;
    if (p === "Android") return "Android";
    if (p === "Chrome OS" || p === "ChromeOS") return "ChromeOS";
    if (p === "iOS") return "iOS";
    if (p === "Windows") return "Windows";
    if (p === "macOS") {
      // iPadOS 13+ reports as macOS — distinguish via touch support
      if (navigator.maxTouchPoints > 1) return "iOS";
      return "macOS";
    }
    if (p === "Linux") return "Linux";
  }

  const ua = navigator.userAgent;
  if (ua.includes("iPhone") || ua.includes("iPod")) return "iOS";
  if (ua.includes("iPad")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("CrOS")) return "ChromeOS";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Macintosh") || ua.includes("Mac OS")) {
    // iPadOS 13+ sends a desktop Macintosh UA
    if (navigator.maxTouchPoints > 1) return "iOS";
    return "macOS";
  }
  if (ua.includes("Linux")) return "Linux";
  return "Unknown OS";
}

function detectBrowserAndOS() {
  return { browser: detectBrowser(), os: detectOS() };
}

function displayInstructions(browser, os) {
  const steps = instructions[browser]?.[os]
    || instructions["Default"]?.[os];

  instructionsSection.textContent = '';

  if (steps) {
    const heading = document.createElement('h2');
    heading.textContent = `Clear Cache in ${browser} on ${os}`;
    instructionsSection.appendChild(heading);

    const list = document.createElement('ol');
    for (const step of steps) {
      const li = document.createElement('li');
      li.textContent = step;
      list.appendChild(li);
    }
    instructionsSection.appendChild(list);
  } else {
    const heading = document.createElement('h2');
    heading.textContent = 'Instructions Not Found';
    instructionsSection.appendChild(heading);

    const msg = document.createElement('p');
    msg.textContent = `We don't have specific instructions for ${browser} on ${os}. Try using the manual selection below.`;
    instructionsSection.appendChild(msg);
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
    instructionsSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    instructionsSection.textContent = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Missing Selection';
    instructionsSection.appendChild(heading);

    const msg = document.createElement('p');
    msg.textContent = 'Please select both a browser and an operating system.';
    instructionsSection.appendChild(msg);
  }
});
