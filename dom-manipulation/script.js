// Array to store quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" }
];

// Display a random quote
function showRandomQuote() {
  const selectedCategory = localStorage.getItem('lastCategory') || 'all';
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes in this category!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').textContent = filteredQuotes[randomIndex].text;
}

// Populate the category dropdown dynamically
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  if (!select) return;

  const uniqueCategories = ['all', ...new Set(quotes.map(q => q.category))];
  select.innerHTML = ''; // clear existing options

  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat; // <-- textContent used here
    select.appendChild(option);
  });

  // Restore last selected category
  const lastSelected = localStorage.getItem('lastCategory') || 'all';
  select.value = lastSelected;
}

// Filter quotes based on selected category
function filterQuotes() {
  const select = document.getElementById('categoryFilter');
  const selected = select.value;
  localStorage.setItem('lastCategory', selected); // save selected category
  showRandomQuote();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert('Please enter both a quote and a category.');

  quotes.push({ text, category });
  localStorage.setItem('quotes', JSON.stringify(quotes)); // save quotes
  populateCategories(); // update dropdown
  showRandomQuote();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  showRandomQuote();

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
});
