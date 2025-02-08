// querySelector wrapper
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage
export function getLocalStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error parsing cart data:", e);
    return [];
  }
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

// Get query parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Function to render a list of items using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

// templating utility
export async function loadHeaderFooter() {
  const headerResponse = await fetch("/partials/header.html");
  const footerResponse = await fetch("/partials/footer.html");
  
  const headerHTML = await headerResponse.text();
  const footerHTML = await footerResponse.text();
  
  // Insert the partials as HTML
  const headerEl = document.querySelector("header");
  const footerEl = document.querySelector("footer");
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;
}

