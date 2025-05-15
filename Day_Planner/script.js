const prioritySelect = document.getElementById("prioritySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskProgress = document.getElementById("taskProgress");
const taskProgressLabel = document.getElementById("taskProgressLabel");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
const datePicker = document.getElementById("datePicker");
const taskSearchInput = document.getElementById("taskSearchInput");

let selectedDate = new Date().toISOString().split('T')[0];  // Default to today's date

// Toggle Dark Mode
toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleDarkModeBtn.textContent = document.body.classList.contains("dark-mode")
    ? "🌞 Switch to Light Mode"
    : "🌙 Switch to Dark Mode";
});

// Use the selected date from the date picker
datePicker.addEventListener("input", (e) => {
  selectedDate = e.target.value;
  renderTaskList();
});

// Function to render tasks
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem(selectedDate)) || [];
    taskList.innerHTML = "";
  
    const searchTerm = taskSearchInput.value.toLowerCase();
    let completedTasks = 0;
  
    tasks
      .filter(task => task.text.toLowerCase().includes(searchTerm))
      .forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-item", task.priorityClass);
  
        if (task.completed) {
          taskElement.classList.add("completed");
          completedTasks++;
        }
  
        taskElement.innerHTML = `
          <input type="checkbox" class="task-complete-checkbox" ${task.completed ? "checked" : ""}>
          <div class="task-text">${task.text}</div>
          <button class="delete-btn">❌</button>
        `;
  
        const completeCheckbox = taskElement.querySelector(".task-complete-checkbox");
        completeCheckbox.addEventListener("change", () => {
          toggleTaskCompletion(task.text);
        });
  
        const deleteBtn = taskElement.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
          deleteTask(task.text);
        });
  
        taskList.appendChild(taskElement);
      });
  
    // Progress
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    taskProgress.value = progress;
    taskProgressLabel.textContent = `Progress: ${Math.round(progress)}%`;
  }
  

// Toggle Task Completion
function toggleTaskCompletion(taskText) {
  const tasks = JSON.parse(localStorage.getItem(selectedDate)) || [];
  const task = tasks.find(task => task.text === taskText);
  if (task) {
    task.completed = !task.completed;
  }
  localStorage.setItem(selectedDate, JSON.stringify(tasks));
  renderTaskList();
}

// Add Task Event
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return alert("Please enter a valid task!");

  const priority = prioritySelect.value;
  const priorityClass = `${priority}-priority`;  // Apply the corresponding class

  const newTask = {
    text: taskText,
    priorityClass: priorityClass,
    completed: false  // New tasks are initially not completed
  };

  const savedTasks = JSON.parse(localStorage.getItem(selectedDate)) || [];
  savedTasks.push(newTask);
  localStorage.setItem(selectedDate, JSON.stringify(savedTasks));

  taskInput.value = "";
  renderTaskList();
});

// Delete Task
function deleteTask(taskText) {
  const tasks = JSON.parse(localStorage.getItem(selectedDate)) || [];
  const updatedTasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem(selectedDate, JSON.stringify(updatedTasks));
  renderTaskList();
}

// Initialize
renderTaskList();
taskSearchInput.addEventListener("input", renderTaskList);
