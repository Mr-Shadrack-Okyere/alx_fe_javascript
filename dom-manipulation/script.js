// Array to store quotes
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Knowledge is power.", category: "Education" },
  { text: "Practice makes perfect.", category: "Motivation" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — Category: ${quote.category}`;
}

// Function to create the form for adding a new quote
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Clear previous form if exists
  formContainer.innerHTML = "";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Function to add a new quote
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
  showRandomQuote(); // Update DOM
  textInput.value = "";
  categoryInput.value = "";
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize the page
createAddQuoteForm();
showRandomQuote();
