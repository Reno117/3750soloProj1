console.log("JavaScript loaded");

const API_BASE = "https://three750soloproj1.onrender.com/";
let verses = [];
const PAGE_SIZE = 10;
let currentPage = 1;



async function loadVerses() {
  const res = await fetch(`${API_BASE}/getVerses.php`);
  verses = await res.json();
  renderVerseList();
  renderStats();
}

loadVerses();
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
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageIndicator = document.getElementById("pageIndicator");

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

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = verses.slice(start, end);

  pageItems.forEach(v => {
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

  updatePagingControls();
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

async function deleteVerse(id) {
  if (!confirm("Delete this verse?")) return;

  await fetch(`${API_BASE}/deleteVerse.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  // Reload authoritative data
  await loadVerses();

  // Fix paging AFTER reload
  const maxPage = Math.ceil(verses.length / PAGE_SIZE);
  if (currentPage > maxPage) {
    currentPage = maxPage || 1;
  }

  renderVerseList();
}


function renderStats() {
  const total = verses.length;

  const memorized = verses.filter(v => v.memorized).length;
  const notMemorized = total - memorized;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("memorizedCount").textContent = memorized;
  document.getElementById("notMemorizedCount").textContent = notMemorized;
}

// --------------------
// Form Submit
// --------------------

document.getElementById("verseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const verse = {
    id: editingVerseId,
    reference: referenceInput.value.trim(),
    text: textInput.value.trim(),
    translation: translationInput.value,
    memorized: memorizedInput.checked
  };

  const endpoint = editingVerseId === null
    ? "addVerse.php"
    : "updateVerse.php";

  await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(verse)
  });

  resetForm();
  showView(listView);

  // Reload from server FIRST
  await loadVerses();

  // If adding, jump to last page
  if (editingVerseId === null) {
    currentPage = Math.ceil(verses.length / PAGE_SIZE);
  }

  renderVerseList();
});


function resetForm() {
  editingVerseId = null;
  document.getElementById("verseForm").reset();
}

cancelBtn.addEventListener("click", () => {
  resetForm();
  showView(listView);
});


statsViewBtn.addEventListener("click", () => {
  listView.classList.add("hidden");
  formView.classList.add("hidden");
  statsView.classList.remove("hidden");

  renderStats();
});


// --------------------
// Initial Load

function updatePagingControls() {
  const totalPages = Math.ceil(verses.length / PAGE_SIZE);

  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderVerseList();
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(verses.length / PAGE_SIZE);
  if (currentPage < totalPages) {
    currentPage++;
    renderVerseList();
  }
});
// --------------------

showView(listView);
