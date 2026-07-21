// Academic Planner — interactive task management
// Demonstrates: async/await, Supabase REST calls, event handling, DOM manipulation

const SUPABASE_URL = "https://eoqldzsqdoxfzvrkbbhf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pTE5Y2HfCYalXMlR5AtPHw_vN7lLNhk";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** @type {{id: number, title: string, due: string|null, priority: string, completed: boolean}[]} */
let tasks = [];
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

async function loadTasks() {
  taskList.innerHTML = "";
  const loading = document.createElement("div");
  loading.className = "empty-state";
  loading.textContent = "Loading tasks…";
  taskList.appendChild(loading);

  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    renderError(error.message);
    return;
  }

  tasks = data;
  renderTasks();
}

async function addTask(title, due, priority) {
  const { data, error } = await supabaseClient
    .from("tasks")
    .insert({ title: title.trim(), due: due || null, priority, completed: false })
    .select()
    .single();

  if (error) {
    renderError(error.message);
    return;
  }

  tasks = [data, ...tasks];
  renderTasks();
}

async function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  const { data, error } = await supabaseClient
    .from("tasks")
    .update({ completed: !task.completed })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    renderError(error.message);
    return;
  }

  tasks = tasks.map((t) => (t.id === id ? data : t));
  renderTasks();
}

async function deleteTask(id) {
  const { error } = await supabaseClient.from("tasks").delete().eq("id", id);

  if (error) {
    renderError(error.message);
    return;
  }

  tasks = tasks.filter((t) => t.id !== id);
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

function renderError(message) {
  taskList.innerHTML = "";
  const errorEl = document.createElement("div");
  errorEl.className = "empty-state";
  errorEl.textContent = `Couldn't reach the database: ${message}`;
  taskList.appendChild(errorEl);
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

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  const submitBtn = taskForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  await addTask(title, dueInput.value, priorityInput.value);
  submitBtn.disabled = false;

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

loadTasks();
