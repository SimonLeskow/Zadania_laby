let tasks = [];
let currentFilter = "all";


const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const messageBox = document.getElementById("message");
const countAll = document.getElementById("count-all");
const countCompleted = document.getElementById("count-completed");
const filterButtons = document.querySelectorAll(".filters button");


function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(name + "=")) {
      return decodeURIComponent(trimmed.substring(name.length + 1));
    }
  }
  return null;
}

function showMessage(text) {
  messageBox.textContent = text;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Błąd serwera (${response.status})`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch (e) {
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function loadTasks() {
  try {
    tasks = await apiRequest("/api/tasks/");
    renderTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

async function addTask(title) {
  try {
    await apiRequest("/api/tasks/", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    input.value = "";
    showMessage("");
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

async function toggleTask(task) {
  try {
    await apiRequest(`/api/tasks/${task.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ completed: !task.completed }),
    });
    showMessage("");
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

async function deleteTask(task) {
  try {
    await apiRequest(`/api/tasks/${task.id}/`, { method: "DELETE" });
    showMessage("");
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const title = document.createElement("span");
  title.className = "title";
  title.textContent = task.title;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.textContent = task.completed ? "Przywróć" : "Ukończ";
  toggleBtn.addEventListener("click", () => toggleTask(task));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Usuń";
  deleteBtn.addEventListener("click", () => deleteTask(task));

  li.append(title, toggleBtn, deleteBtn);
  return li;
}

function renderTasks() {
  list.replaceChildren();
  const visible = getVisibleTasks();

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Brak zadań do wyświetlenia.";
    list.appendChild(empty);
  } else {
    visible.forEach((task) => list.appendChild(createTaskElement(task)));
  }
  updateCounters();
}

function updateCounters() {
  countAll.textContent = tasks.length;
  countCompleted.textContent = tasks.filter((t) => t.completed).length;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    showMessage("Wpisz treść zadania.");
    return;
  }
  addTask(title);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === button));
    renderTasks();
  });
});

loadTasks();