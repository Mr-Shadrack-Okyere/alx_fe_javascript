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

  quotes.push(newQuote);
  saveQuotes();
  populateCategories(); // update dropdown dynamically
  showRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// ======= Create Add Quote Form (Missing Functionality) =======
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
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

// ======= Event Listener for New Quote Button =======
document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);

// ======= Fetch Quotes from Server (Missing Functionality) =======
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    return serverQuotes.map(sq => ({ text: sq.title, category: "Server" })); // simulate server quotes
  } catch (err) {
    console.error("Error fetching quotes from server:", err);
    return [];
  }
}

// ======= Sync Quotes (Missing Functionality) =======
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length === 0) return;

  // Merge: server data takes precedence if conflicts (simulation)
  quotes = serverQuotes.concat(quotes.filter(q => !serverQuotes.some(sq => sq.text === q.text)));
  saveQuotes();
  populateCategories();
  showRandomQuote();

  // Notify user
  const notification = document.createElement("div");
  notification.textContent = "Quotes synced with server!";
  notification.style.backgroundColor = "#d4edda";
  notification.style.padding = "10px";
  notification.style.margin = "10px 0";
  document.body.prepend(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Auto-sync every 60 seconds
setInterval(syncQuotes, 60000);

// ======= Initialize =======
window.onload = function() {
  createAddQuoteForm(); // add form dynamically
  populateCategories();
  showRandomQuote();
};
