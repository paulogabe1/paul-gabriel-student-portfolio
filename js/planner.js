// Academic Planner — interactive task management
// Demonstrates: arrays, functions, event handling, DOM manipulation, dynamic content updates

const STORAGE_KEY = "cos106-planner-tasks";

/** @type {{id: number, title: string, due: string, priority: string, completed: boolean}[]} */
let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const dueInput = document.getElementById("task-due");
const priorityInput = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const statTotal = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statCompleted = document.getElementById("stat-completed");

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultTasks();
  } catch (err) {
    return defaultTasks();
  }
}

function defaultTasks() {
  return [
    { id: 1, title: "Submit COS 106 term project", due: "", priority: "high", completed: false },
    { id: 2, title: "Review JavaScript DOM notes", due: "", priority: "medium", completed: false },
    { id: 3, title: "Read Chapter 3 of course material", due: "", priority: "low", completed: true },
  ];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(title, due, priority) {
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    due,
    priority,
    completed: false,
  };
  tasks = [newTask, ...tasks];
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function renderTasks() {
  const filtered = getFilteredTasks();
  taskList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = tasks.length === 0
      ? "No tasks yet — add your first task above."
      : "No tasks match this filter.";
    taskList.appendChild(empty);
  } else {
    filtered.forEach((task) => {
      taskList.appendChild(buildTaskElement(task));
    });
  }

  updateStats();
}

function buildTaskElement(task) {
  const item = document.createElement("div");
  item.className = "task-item" + (task.completed ? " completed" : "");
  item.dataset.id = task.id;

  const check = document.createElement("button");
  check.className = "task-check";
  check.type = "button";
  check.setAttribute("aria-label", task.completed ? "Mark task as active" : "Mark task as completed");
  check.textContent = task.completed ? "✓" : "";
  check.addEventListener("click", () => toggleComplete(task.id));

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.textContent = formatDate(task.due);

  content.appendChild(title);
  content.appendChild(meta);

  const priority = document.createElement("span");
  priority.className = `task-priority priority-${task.priority}`;
  priority.textContent = task.priority;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.type = "button";
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.textContent = "✕";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  item.appendChild(check);
  item.appendChild(content);
  item.appendChild(priority);
  item.appendChild(deleteBtn);

  return item;
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  statTotal.textContent = total;
  statCompleted.textContent = completed;
  statActive.textContent = total - completed;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  addTask(title, dueInput.value, priorityInput.value);
  taskForm.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
