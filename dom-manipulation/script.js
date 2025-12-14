// ======= Quotes Array and Storage Handling =======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do something today that your future self will thank you for.", category: "Motivation" },
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ======= Random Quote Display =======
function showRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";

  const filteredQuotes = selectedCategory === "all" 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// ======= Add New Quote =======
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (!newQuote.text || !newQuote.category) {
    alert("Please enter both quote text and category!");
    return;
  }

  quotes.push(newQuote);        // update quotes array
  saveQuotes();                 // update local storage
  populateCategories();         // update dropdown dynamically
  showRandomQuote();            // display the new quote

  textInput.value = "";
  categoryInput.value = "";
}

// ======= Populate Categories =======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selectedCategory;
}

// ======= Filter Quotes =======
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// ======= Export Quotes to JSON =======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ======= Import Quotes from JSON =======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch (e) {
      alert("Invalid JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ======= Event Listeners =======
document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);

// ======= Fetch Quotes From Server =======
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(item => ({ text: item.title, category: "Server" }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// ======= Sync Quotes with Server & Conflict Resolution =======
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  serverQuotes.forEach(sq => {
    const exists = quotes.some(q => q.text === sq.text && q.category === sq.category);
    if (!exists) {
      quotes.push(sq);
    }
  });

  saveQuotes();
  populateCategories();
  showRandomQuote();

  // Notification for updates
  if (!document.getElementById("notification")) {
    const notifDiv = document.createElement("div");
    notifDiv.id = "notification";
    notifDiv.textContent = "Quotes updated from server!";
    notifDiv.style.background = "#e0f7fa";
    notifDiv.style.padding = "10px";
    notifDiv.style.marginTop = "10px";
    notifDiv.style.border = "1px solid #00796b";
    document.body.prepend(notifDiv);
    setTimeout(() => notifDiv.remove(), 5000);
  }
}

// Auto-sync every 30 seconds
setInterval(syncQuotes, 30000);

// ======= Initialize =======
window.onload = function() {
  populateCategories();
  showRandomQuote();
};
