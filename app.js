console.log("JavaScript loaded");

// --------------------
// Seed Data
// --------------------

const SEED_VERSES = [
  { id: 1, reference: "Genesis 1:1", text: "In the beginning, God created the heavens and the earth.", translation: "ESV", memorized: false },
  { id: 2, reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", translation: "ESV", memorized: false },
  { id: 3, reference: "Psalm 46:10", text: "Be still, and know that I am God.", translation: "ESV", memorized: false },
  { id: 4, reference: "Proverbs 3:5", text: "Trust in the Lord with all your heart.", translation: "ESV", memorized: false },
  { id: 5, reference: "Isaiah 41:10", text: "Fear not, for I am with you.", translation: "ESV", memorized: false },
  { id: 6, reference: "Jeremiah 29:11", text: "For I know the plans I have for you.", translation: "ESV", memorized: false },
  { id: 7, reference: "Micah 6:8", text: "What does the Lord require of you?", translation: "ESV", memorized: false },
  { id: 8, reference: "Matthew 5:9", text: "Blessed are the peacemakers.", translation: "ESV", memorized: false },
  { id: 9, reference: "Matthew 11:28", text: "Come to me, all who labor and are heavy laden.", translation: "ESV", memorized: false },
  { id: 10, reference: "Matthew 22:37", text: "You shall love the Lord your God.", translation: "ESV", memorized: false },

  { id: 11, reference: "Mark 12:30", text: "Love the Lord your God with all your heart.", translation: "ESV", memorized: false },
  { id: 12, reference: "Luke 6:31", text: "Do to others as you would have them do to you.", translation: "ESV", memorized: false },
  { id: 13, reference: "Luke 11:9", text: "Ask, and it will be given to you.", translation: "ESV", memorized: false },
  { id: 14, reference: "John 1:1", text: "In the beginning was the Word.", translation: "ESV", memorized: false },
  { id: 15, reference: "John 3:16", text: "For God so loved the world.", translation: "ESV", memorized: false },
  { id: 16, reference: "John 14:6", text: "I am the way, and the truth, and the life.", translation: "ESV", memorized: false },
  { id: 17, reference: "Acts 1:8", text: "You will receive power when the Holy Spirit comes.", translation: "ESV", memorized: false },
  { id: 18, reference: "Romans 8:28", text: "All things work together for good.", translation: "ESV", memorized: false },
  { id: 19, reference: "Romans 12:2", text: "Do not be conformed to this world.", translation: "ESV", memorized: false },
  { id: 20, reference: "1 Corinthians 13:4", text: "Love is patient and kind.", translation: "ESV", memorized: false },

  { id: 21, reference: "2 Corinthians 5:7", text: "For we walk by faith, not by sight.", translation: "ESV", memorized: false },
  { id: 22, reference: "Galatians 5:22", text: "The fruit of the Spirit is love, joy, peace.", translation: "ESV", memorized: false },
  { id: 23, reference: "Ephesians 2:8", text: "By grace you have been saved through faith.", translation: "ESV", memorized: false },
  { id: 24, reference: "Philippians 4:6", text: "Do not be anxious about anything.", translation: "ESV", memorized: false },
  { id: 25, reference: "Philippians 4:13", text: "I can do all things through Christ.", translation: "ESV", memorized: false },
  { id: 26, reference: "Colossians 3:23", text: "Whatever you do, work heartily.", translation: "ESV", memorized: false },
  { id: 27, reference: "1 Thessalonians 5:16", text: "Rejoice always.", translation: "ESV", memorized: false },
  { id: 28, reference: "Hebrews 11:1", text: "Faith is the assurance of things hoped for.", translation: "ESV", memorized: false },
  { id: 29, reference: "James 1:5", text: "If any of you lacks wisdom, let him ask God.", translation: "ESV", memorized: false },
  { id: 30, reference: "Revelation 21:4", text: "He will wipe away every tear.", translation: "ESV", memorized: false }
];

// --------------------
// localStorage
// --------------------

const STORAGE_KEY = "bibleVerses";

function loadVerses() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VERSES));
    return SEED_VERSES;
  }
  return JSON.parse(stored);
}

function saveVerses(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let verses = loadVerses();
let editingVerseId = null;

// --------------------
// DOM References
// --------------------

const listView = document.getElementById("listView");
const formView = document.getElementById("formView");
const statsView = document.getElementById("statsView");

const listViewBtn = document.getElementById("listViewBtn");
const addViewBtn = document.getElementById("addViewBtn");
const statsViewBtn = document.getElementById("statsViewBtn");
const cancelBtn = document.getElementById("cancelBtn");

const verseTableBody = document.getElementById("verseTableBody");

const referenceInput = document.getElementById("reference");
const textInput = document.getElementById("text");
const translationInput = document.getElementById("translation");
const memorizedInput = document.getElementById("memorized");

// --------------------
// View Switching
// --------------------

function showView(view) {
  listView.classList.add("hidden");
  formView.classList.add("hidden");
  statsView.classList.add("hidden");
  view.classList.remove("hidden");
}

listViewBtn.addEventListener("click", () => showView(listView));
addViewBtn.addEventListener("click", () => showView(formView));
statsViewBtn.addEventListener("click", () => showView(statsView));

// --------------------
// Render List
// --------------------

function renderVerseList() {
  verseTableBody.innerHTML = "";

  verses.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.reference}</td>
      <td>${v.text}</td>
      <td>${v.translation}</td>
      <td>${v.memorized ? "Yes" : "No"}</td>
      <td>
        <button class="edit-btn" data-id="${v.id}">Edit</button>
        <button class="delete-btn" data-id="${v.id}">Delete</button>
      </td>
    `;
    verseTableBody.appendChild(row);
  });
}

// --------------------
// Edit / Delete
// --------------------

verseTableBody.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("edit-btn")) {
    startEdit(id);
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteVerse(id);
  }
});

function startEdit(id) {
  const verse = verses.find(v => v.id === id);
  if (!verse) return;

  editingVerseId = id;

  referenceInput.value = verse.reference;
  textInput.value = verse.text;
  translationInput.value = verse.translation;
  memorizedInput.checked = verse.memorized;

  showView(formView);
}

function deleteVerse(id) {
  if (!confirm("Delete this verse?")) return;

  verses = verses.filter(v => v.id !== id);
  saveVerses(verses);
  renderVerseList();
}

// --------------------
// Form Submit
// --------------------

document.getElementById("verseForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const reference = referenceInput.value.trim();
  const text = textInput.value.trim();
  const translation = translationInput.value;
  const memorized = memorizedInput.checked;

  if (editingVerseId === null) {
    verses.push({
      id: Date.now(),
      reference,
      text,
      translation,
      memorized
    });
  } else {
    const verse = verses.find(v => v.id === editingVerseId);
    verse.reference = reference;
    verse.text = text;
    verse.translation = translation;
    verse.memorized = memorized;
  }

  saveVerses(verses);
  renderVerseList();
  resetForm();
  showView(listView);
});

function resetForm() {
  editingVerseId = null;
  document.getElementById("verseForm").reset();
}

cancelBtn.addEventListener("click", () => {
  resetForm();
  showView(listView);
});

// --------------------
// Initial Load
// --------------------

showView(listView);
renderVerseList();
