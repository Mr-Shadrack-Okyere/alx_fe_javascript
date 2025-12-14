// Array to store quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" }
];

// Display a random quote
function showRandomQuote() {
  const filteredCategory = localStorage.getItem('lastCategory') || 'all';
  const displayQuotes = filteredCategory === 'all' ? quotes : quotes.filter(q => q.category === filteredCategory);
  if (displayQuotes.length === 0) return alert("No quotes available for this category!");

  const randomIndex = Math.floor(Math.random() * displayQuotes.length);
  document.getElementById('quoteDisplay').innerText = displayQuotes[randomIndex].text;
}

// Create dynamic form to add new quotes
function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.innerText = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Add a new quote to the array and update DOM/localStorage
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert('Please enter both a quote and a category.');

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  if (!select) return;

  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  select.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    select.appendChild(option);
  });

  // Restore last selected category
  const last = localStorage.getItem('lastCategory') || 'all';
  select.value = last;
}

// Filter quotes by selected category
function filterQuotes() {
  const select = document.getElementById('categoryFilter');
  const selected = select.value;
  localStorage.setItem('lastCategory', selected);
  showRandomQuote();
}

// Initialize DOM
document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();

  const newQuoteBtn = document.getElementById('newQuote');
  if (newQuoteBtn) newQuoteBtn.addEventListener('click', showRandomQuote);

  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) categoryFilter.addEventListener('change', filterQuotes);
});
