// Quotes array
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const category = document.getElementById('categoryFilter').value;
  let filtered = quotes;
  if (category !== 'all') {
    filtered = quotes.filter(q => q.category === category);
  }
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerText = randomQuote ? randomQuote.text : 'No quotes available';
}

// Add new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert('Enter both quote and category');

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
}

// Populate category dropdown dynamically
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = ['all', ...new Set(quotes.map(q => q.category))];

  select.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem('lastCategory') || 'all';
  select.value = lastCategory;
}

// Filter quotes based on category selection
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastCategory', category);
  showRandomQuote();
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
document.getElementById('exportJson').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initial load
loadQuotes();
populateCategories();
showRandomQuote();
