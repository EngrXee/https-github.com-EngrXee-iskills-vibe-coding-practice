// ===== Get elements from the page =====
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");

// Key used to save tasks in localStorage
const STORAGE_KEY = "aiProjectTasks";

// Load saved tasks (or start with an empty list)
let tasks = loadTasks();

// ===== localStorage helpers =====
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    // If saved data is broken, start fresh
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== Show tasks on the page =====
function renderTasks() {
  // Clear the current list
  taskList.innerHTML = "";

  // Show or hide the empty message
  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    taskCount.textContent = "";
    return;
  }
  emptyMessage.style.display = "none";

  // Update the counter
  const doneCount = tasks.filter(function (task) {
    return task.completed;
  }).length;
  taskCount.textContent = doneCount + " of " + tasks.length + " tasks completed";

  // Create a list item for each task
  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) {
      li.classList.add("completed");
    }

    // Task title (textContent keeps user input safe)
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    // Buttons container
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Complete / Undo button
    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-complete";
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", function () {
      toggleTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(title);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

// ===== Task actions =====
function addTask(title) {
  const newTask = {
    id: Date.now(), // simple unique id
    title: title,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// ===== Handle the form submit =====
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const title = taskInput.value.trim();
  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  addTask(title);
  taskInput.value = "";
  taskInput.focus();
});

// Show tasks when the page first loads
renderTasks();
